import createAndAnimateMarker from './live.js';
import RouteOptimizer from './optmize.js';

export default function maps() {

  function initMapPlatform() {
    const apiKey_env = import.meta.env.VITE_HERE_API_KEY;
    if (!apiKey_env) {
      console.error('VITE_HERE_API_KEY is not defined in the .env file');
      return;
    }
    const apiKey = apiKey_env;
    this.platform = new H.service.Platform({ apikey: apiKey });
    
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(this.$refs.mapContainer, defaultLayers.vector.normal.map, { zoom: 10, center: { lat: -23.5505, lng: -46.6333 } });
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    const mapEvents = new H.mapevents.MapEvents(this.map);
    new H.mapevents.Behavior(mapEvents);
    this.map.addEventListener('mapviewchange', () => {
      if (this.currentBubble) {
        this.currentBubble.setPosition(this.map.screenToGeo(
          this.map.geoToScreen(this.currentBubble.getPosition())
        ));
      }
    });
    this.searchService = this.platform.getSearchService();

    // Add the CSS rule to hide .H_btn elements
    const style = document.createElement('style');
    style.innerHTML = '.H_btn { display: none; }';
    document.head.appendChild(style);

    this.van = createAndAnimateMarker(this.map);
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

  async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                const { latitude, longitude } = position.coords;
                resolve({ lat: latitude, lng: longitude });
              },
              function (error) {
                // If permission is granted but location cannot be retrieved
                reject(new Error("Não foi possível obter a localização"));
              }
            );
          } else {
            // If permission is not granted, reject with a specific error
            reject(new Error("Localização não permitida"));
          }
        });
      } else {
        reject(new Error("Geolocalização não é suportada"));
      }
    });
  }

  function reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {
      this.searchService.reverseGeocode({
        at: `${lat},${lng}`
      }, (result) => {
        const location = result.items[0]?.address;
        if (location) {
          const formattedAddress = `${location.street}, ${location.city}, ${location.state}`;
          resolve(formattedAddress);
        } else {
          reject(new Error(`Endereço não encontrado para as coordenadas: ${lat}, ${lng}`));
        }
      }, (error) => reject(error));
    });
  }
      // Rest of the existing updateRoute method remains the same
  async function updateRoute() {
    try {
      let origin;
      try {
        // Try to get current location
        origin = await getCurrentLocation();
      } catch (locationError) {
        // If location cannot be retrieved, fall back to manual address input
        origin = await this.geocodeAddress(this.originAddress);
      }

      const destination = await this.geocodeAddress(this.destinationAddress);
      // Geocodificar cada waypoint inserido pelo usuário
      // if (!this.waypoints.includes({address: this.originAddress})){
      //   this.waypoints.push({address: this.originAddress});
      // }
      //console.log();
      const waypoints = await Promise.all(this.waypoints.map(wp => this.geocodeAddress(wp.address)));


      // Parâmetros para o roteamento
      const routingParameters = {
        routingMode: "fast",
        transportMode: "car",
        return: "polyline"
      };

      // Otimizar a rota
      const user = import.meta.env.VITE_ROUTEXL_USER;      
      if (!user) {
        console.error('VITE_HERE_ROUTEXL_USER is not defined in the .env file');
        return;
      }

      const password = import.meta.env.VITE_ROUTEXL_PASSWORD;
      if (!password) {
        console.error('VITE_HERE_ROUTEXL_PASSWORD is not defined in the .env file');
        return;
      }
      const routeOptimizer = new RouteOptimizer(user, password);
      const { locations, optimizedRoute } = await routeOptimizer.optimizeRoute(origin, destination, waypoints);

      console.log(locations, optimizedRoute); // Debug
      //esse dicionario combina as informações de locations com a de rotas otimizadas
      const combinedRoute = Object.keys(optimizedRoute).map((key, index) => {
        const optimizedStop = optimizedRoute[key];
        const originalLocation = locations.find(location => location.name === optimizedStop.name);
        
        // Criar objeto combinado
        return {
            name: originalLocation ? originalLocation.name : `Parada ${index}`,
            lat: originalLocation ? originalLocation.lat : null,
            lng: originalLocation ? originalLocation.lng : null,
            restrictions: originalLocation && originalLocation.restrictions ? originalLocation.restrictions : null,
            arrival: optimizedStop.arrival,
            distance: optimizedStop.distance
        };
      });

      

      console.log(combinedRoute); // Debug
          // Criar um novo array para armazenar os endereços na ordem de combinedRoute
      const orderedAddresses = combinedRoute.map(stop => {
        if (stop.name === 'Start') {
          return this.originAddress;
        } else if (stop.name === 'End') {
          return this.destinationAddress;
        } else {
          const waypointIndex = parseInt(stop.name.split(' ')[1]) - 1;
          return this.waypoints[waypointIndex].address;
        }
      });

      console.log('Ordered Addresses:', orderedAddresses); // Debug

      // Iniciar o grupo para exibir os pontos e a rota
      this.map.removeObjects(this.map.getObjects());
      const group = new H.map.Group();

      // Adicionar marcador para o ponto de origem
      for (let i = 0; i < combinedRoute.length - 1; i++) {
          const start = { lat: combinedRoute[i].lat, lng: combinedRoute[i].lng };
          const end = { lat: combinedRoute[i + 1].lat, lng: combinedRoute[i + 1].lng };

          // Calcular a rota para o segmento atual
          await this.calculateSegmentRoute(start, end, routingParameters, group);
      }

      // Adicionar marcador para o último ponto do combinedRoute
      const lastMarker = new H.map.Marker({ lat: combinedRoute[combinedRoute.length - 1].lat, lng: combinedRoute[combinedRoute.length - 1].lng });
      group.addObject(lastMarker);

      // Adicionar bubbles de informação
      group.addEventListener('tap', function (evt) {
        this.ui.getBubbles().forEach(bubble => this.ui.removeBubble(bubble));
      
        const bubbleContent = `
          <div style="
              min-width: 200px; 
              background-color: darkgray; 
              color: black; 
              padding: 10px; 
              display: flex; 
              flex-direction: column; 
              position: relative; 
              border-radius: 8px; 
              box-shadow: 6px rgba(0, 0, 0, 0.1);">
            <button onclick="closeBubble()" 
              style="
                position: absolute; 
                top: 10px; 
                right: 10px; 
                background: transparent; 
                border: none; 
                font-size: 14px; 
                cursor: pointer;">
              X
            </button>
            <div style="margin-top: 20px;">
              ${evt.target.getData()}
            </div>
          </div>
        `;

        
      
        const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
          content: bubbleContent
        });
        this.ui.addBubble(bubble);
      
        // Função para fechar o bubble
        window.closeBubble = () => {
          this.ui.removeBubble(bubble);
        };
      }.bind(this), false);

      for (let i = 0; i < combinedRoute.length; i++) {
        const location = combinedRoute[i];
        const address = orderedAddresses[i];
        
        let prevLocation = null;
        if (i > 0) {
          prevLocation = combinedRoute[i - 1];
        }
        
        let distanceToNext = 0;
        let timeToNext = 0;
        if (prevLocation) {
          distanceToNext = (location.distance - prevLocation.distance).toFixed(2);
          timeToNext = (location.arrival - prevLocation.arrival).toFixed(2);
        }
        
        const marker = new H.map.Marker({ lat: location.lat, lng: location.lng });
        if (i == 0){
          const loc = await this.reverseGeocode(location.lat, location.lng);
          marker.setData(`Ponto de partida: ${loc}`);
        }
        else{
          marker.setData(`
            <div>Endereço: ${address}</div>
            <div>Distância total até aqui: ${location.distance.toFixed(2)} km</div>
            <div>Tempo total até aqui: ${location.arrival.toFixed(2)} min</div>
            <div>Distância a partir da última parada: ${distanceToNext} km</div>
            <div>Tempo a partir da última parada: ${timeToNext} min</div>
          `);
        }
        group.addObject(marker);
      }

      const totalDistance = combinedRoute[combinedRoute.length - 1].distance;
      const totalDuration = combinedRoute[combinedRoute.length - 1].arrival;
      console.log(`Distância total: ${totalDistance} km`);
      console.log(`Duração total: ${totalDuration} min`);
      
      // Exibir o grupo no mapa
      this.map.addObject(group);
      this.map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });
    } catch (error) {
      console.error('Erro ao geocodificar endereços:', error);
    }
    if (this.van && !this.map.getObjects().includes(this.van)){
      this.map.addObject(this.van);
      console.log("Van readicionada");
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

  return {initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute, reverseGeocode};
}
