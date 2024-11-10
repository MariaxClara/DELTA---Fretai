export default function maps() {

  function initMapPlatform() {
      const apiKey = 'KJ72fZC8X7n9q7BlK42O4rv6upXTF6_B9l2JNVGhcBY';
      this.platform = new H.service.Platform({ apikey: apiKey });
      const defaultLayers = this.platform.createDefaultLayers();
      this.map = new H.Map(this.$refs.mapContainer, defaultLayers.vector.normal.map, { zoom: 10, center: { lat: -23.5505, lng: -46.6333 } });
      this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
      const mapEvents = new H.mapevents.MapEvents(this.map);
      new H.mapevents.Behavior(mapEvents);
      
      this.searchService = this.platform.getSearchService();
    }

  function geocodeAddress(address) {
      return new Promise((resolve, reject) => {
        this.searchService.geocode({ q: address }, (result) => {
          const location = result.items[0]?.position;
          if (location) resolve({ lat: location.lat, lng: location.lng });
          else reject(new Error(`Endereço não encontrado: ${address}`));
        }, (error) => reject(error));
      });
    }

  function addWaypoint() {
      this.waypoints.push({ address: "" });
    }

  function removeWaypoint(index) {
      this.waypoints.splice(index, 1);
      this.updateRoute(); // Recalcula a rota automaticamente após remover o waypoint
    }

  async function updateRoute() {
    try {
      // Geocodificar origem, destino e waypoints
      const origin = await this.geocodeAddress(this.originAddress);
      const destination = await this.geocodeAddress(this.destinationAddress);
      
      // Geocodificar cada waypoint inserido pelo usuário
      const waypoints = await Promise.all(this.waypoints.map(wp => this.geocodeAddress(wp.address)));

      // Parâmetros para o roteamento
      const routingParameters = {
        routingMode: "fast",
        transportMode: "car",
        return: "polyline"
      };

      // Iniciar o grupo para exibir os pontos e a rota
      this.map.removeObjects(this.map.getObjects());
      const group = new H.map.Group();

      // Adicionar marcador de origem
      group.addObject(new H.map.Marker(origin));

      // Calcular a rota entre os pontos sequencialmente
      let previousPoint = origin;
      for (const waypoint of waypoints) {
        // Adicionar marcador para cada waypoint
        const waypointMarker = new H.map.Marker(waypoint);
        group.addObject(waypointMarker);

        // Calcular a rota para o segmento atual
        await this.calculateSegmentRoute(previousPoint, waypoint, routingParameters, group);
        previousPoint = waypoint;
      }

      // Calcular a última rota entre o último waypoint e o destino
      await this.calculateSegmentRoute(previousPoint, destination, routingParameters, group);

      // Adicionar marcador de destino
      group.addObject(new H.map.Marker(destination));

      // Exibir o grupo no mapa
      this.map.addObject(group);
      this.map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });

    } catch (error) {
      console.error('Erro ao geocodificar endereços:', error);
    }
  }

  async function calculateSegmentRoute(start, end, routingParameters, group) {
    return new Promise((resolve, reject) => {
      const segmentParams = {
        ...routingParameters,
        origin: `${start.lat},${start.lng}`,
        destination: `${end.lat},${end.lng}`
      };

      const router = this.platform.getRoutingService(null, 8);
      router.calculateRoute(segmentParams, (result) => {
        if (result.routes.length) {
          const lineString = H.geo.LineString.fromFlexiblePolyline(result.routes[0].sections[0].polyline);

          // Rota com fundo azul
          const routeBackground = new H.map.Polyline(lineString, {
            style: {
              lineWidth: 6,
              strokeColor: 'rgba(0, 128, 255, 0.7)',
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head'
            }
          });

          // Setas brancas na rota
          const routeArrows = new H.map.Polyline(lineString, {
            style: {
              lineWidth: 6,
              fillColor: 'white',
              strokeColor: 'rgba(255, 255, 255, 1)',
              lineDash: [0, 2],
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head'
            }
          });

          // Adicionar a rota segmentada ao grupo
          group.addObjects([routeBackground, routeArrows]);
          resolve();
        } else {
          reject(new Error("Nenhuma rota encontrada entre os pontos"));
        }
      }, (error) => {
        console.error('Erro ao calcular segmento da rota:', error.message);
        reject(error);
      });
    });
  }

  return {initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute};
}

