import createAndAnimateMarker from './live.js';
import RouteOptimizer from './optmize.js';

// Dictionary to store voting data
// const votingData = {
//   '2025-02-05': {
//     ida: {
//       'Student A': 'Shopping Vale Sul, São José dos Campos',
//       'Student B': 'Embraer, São José dos Campos',
//       'Student C': 'Praça Afonso Pena, São José dos Campos',
//       'Student D': 'Praça Ulisses Guimarães, São José dos Campos',
//       'Student E': 'Praça Cônego Lima, São José dos Campos',
//       'Student F': 'Praça da Bandeira, São José dos Campos',
//       'Student G': 'Praça da Independência, São José dos Campos',
//     },
//     volta: {
//       'Student C': 'Praça Afonso Pena, São José dos Campos',
//       'Student H': 'Shopping Jacarei, Jacareí, Sao Paulo',
//       'Student I': 'Jardim Santa Maria, Jacareí, Sao Paulo',
//       'Student J': 'Praça dos Três Poderes, Jacareí, Sao Paulo',
//       'Student K': 'Praça Raul Chaves, Jacareí, Sao Paulo',
//       'Student L': "Altos de Santana, Jacareí, Sao Paulo",
//     }
//   },
//   '2025-02-04': {
//     ida: {
//       'Student H': 'Shopping Jacarei, Jacareí, Sao Paulo',
//       'Student I': 'Jardim Santa Maria, Jacareí, Sao Paulo',
//       'Student J': 'Praça dos Três Poderes, Jacareí, Sao Paulo',
//       'Student K': 'Praça Raul Chaves, Jacareí, Sao Paulo',
//       'Student L': "Altos de Santana, Jacareí, Sao Paulo",
//     },
//     volta: {
//       'Student H': 'Shopping Jacarei, Jacareí, Sao Paulo',
//       'Student I': 'Jardim Santa Maria, Jacareí, Sao Paulo',
//       'Student J': 'Praça dos Três Poderes, Jacareí, Sao Paulo',
//       'Student K': 'Praça Raul Chaves, Jacareí, Sao Paulo',
//       'Student L': "Altos de Santana, Jacareí, Sao Paulo",
//     }
//   },
//   // ...other dates...
// };


const updateData = async () =>  {
  const driver_id = 1;
  const voting = {"ida": {}, "volta": {}};
  const users_id = [];
  const message_users = `http://localhost:3000/driverUsers/${driver_id}`;

  try {
    const response = await fetch(message_users, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    for (let i = 0; i < data.message.length; i ++) {
      users_id.push([data.message[i]["passageiro_id"], data.message[i]["passageiro_email"]]);
    }
    //console.log("Entrada :",data.message);
  }
  catch (error) {
    console.error('Erro ao buscar passageiros:', error);
    return {};
  }

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const route = 1; // exemplo
  let destino = "";
  users_id.forEach(async (user_data) => {
    const message_calendario = `http://localhost:3000/getCalendario/${user_data[0]}/${route}/${year}/${month}/${day}`;
    try {
      const response = await fetch(message_calendario, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.message[0]["ida"] != 0) {
        const message_dest = `http://localhost:3000/getRaceInfo/${user_data[1]}`;
        const reply = await fetch(message_dest, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data_dest = await reply.json();
        voting["volta"][data_dest.message[0]["nome"]] = data_dest.message[0]["destino"];
        destino = data_dest.message[0]["destino"];
      }

      if (data.message[0]["volta"] != 0) {
        const message_dest = `http://localhost:3000/getRaceInfo/${user_data[1]}`;
        const reply = await fetch(message_dest, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data_dest = await reply.json();
        voting["volta"][data_dest.message[0]["nome"]] = data_dest.message[0]["origem"];
      }
      
    }
    catch (error) {
      console.error('Erro ao buscar viagens:', error);
      return {};
    }
  })
  
  return voting, destino;

}

const {votingData, defaultDestinations} = await updateData();

// Default destinations
// const defaultDestinations = {
//   'Unifesp ICT - São José dos Campos': 'Av. Cesare Mansueto Giulio Lattes, 1201 - Eugênio de Melo, São José dos Campos - SP, 12247-014',
//   'Fatec': 'Av. Cesare Mansueto Giulio Lattes, 1350 - Eugênio de Melo, São José dos Campos - SP, 12247-014',
//   'Instituto Federal': 'R. Pedro Rachid, 3 - Jardim Diamante, São José dos Campos - SP, 12230-000'
// };

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
    this.destinationAddress = defaultDestinations; // Set default destination
    this.waypoints = [];
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
    this.errorMessage = null; // Limpa a mensagem de erro ao remover um waypoint
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
      //erro digitar endereço invalido, nao reconhecido
      //erro só pedir o de origem se estiver nesse modo, caso contrario usa loc atual
      if (!this.destinationAddress) {
        this.errorMessage = "O endereço de destino precisa ser preenchido.";
        return;
      }
  
      // Verificar o endereço de origem apenas se estiver no modo de endereço manual
      if (this.useManualAddress && !this.originAddress) {
        this.errorMessage = "O endereço de origem precisa ser preenchido.";
        return;
      }
  
      // Verificar se todos os waypoints têm endereços válidos
      for (let i = 0; i < this.waypoints.length; i++) {
        if (!this.waypoints[i].address) {
          this.errorMessage = `O endereço da parada ${i + 1} precisa ser preenchido.`;
          return;
        }
      }
  
      let origin;
      try {
        // Try to get current location if not using manual address
        if (!this.useManualAddress) {
          origin = await getCurrentLocation();
        } else {
          origin = await this.geocodeAddress(this.originAddress);
        }
      } catch (locationError) {
        // If location cannot be retrieved, fall back to manual address input
        origin = await this.geocodeAddress(this.originAddress);
      }
  
      const destination = await this.geocodeAddress(this.destinationAddress);
      
      // Use current date for voting data
      const today = new Date().toISOString().split('T')[0];
      const students = votingData[this.selectedTurn];
      if (!students) {
        this.errorMessage = `Nenhuma votação encontrada para a data: ${today} e turno: ${this.selectedTurn}`;
        return;
      }

      const waypoints = await Promise.all(Object.values(students).map(address => this.geocodeAddress(address)));
  
      const routingParameters = {
        routingMode: "fast",
        transportMode: "car",
        return: "polyline,turnByTurnActions,actions,instructions,summary",
      };
  
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
  
      const combinedRoute = Object.keys(optimizedRoute).map((key, index) => {
        const optimizedStop = optimizedRoute[key];
        const originalLocation = locations.find(location => location.name === optimizedStop.name);
        
        return {
            name: originalLocation ? originalLocation.name : `Parada ${index}`,
            lat: originalLocation ? originalLocation.lat : null,
            lng: originalLocation ? originalLocation.lng : null,
            restrictions: originalLocation && originalLocation.restrictions ? originalLocation.restrictions : null,
            arrival: optimizedStop.arrival,
            distance: optimizedStop.distance
        };
      });
  
      const orderedAddresses = combinedRoute.map(stop => {
        if (stop.name === 'Start') {
          return this.originAddress;
        } else if (stop.name === 'End') {
          return this.destinationAddress;
        } else {
          const waypointIndex = parseInt(stop.name.split(' ')[1]) - 1;
          return Object.values(students)[waypointIndex];
        }
      });
  
      this.map.removeObjects(this.map.getObjects());
      const group = new H.map.Group();
  
      for (let i = 0; i < combinedRoute.length - 1; i++) {
        const start = { lat: combinedRoute[i].lat, lng: combinedRoute[i].lng };
        const end = { lat: combinedRoute[i + 1].lat, lng: combinedRoute[i + 1].lng };
  
        await this.calculateSegmentRoute(start, end, routingParameters, group);
      }
  
      const lastMarker = new H.map.Marker({ lat: combinedRoute[combinedRoute.length - 1].lat, lng: combinedRoute[combinedRoute.length - 1].lng });
      group.addObject(lastMarker);
  
      group.addEventListener('tap', async function (evt) {
        this.ui.getBubbles().forEach(bubble => this.ui.removeBubble(bubble));
      
        const coords = evt.target.getGeometry();
        const address = await this.reverseGeocode(coords.lat, coords.lng);
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
              ${address}
            </div>
          </div>
        `;
      
        const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
          content: bubbleContent
        });
        this.ui.addBubble(bubble);
      
        window.closeBubble = () => {
          this.ui.removeBubble(bubble);
        };
      }.bind(this), false);
  
     
      console.log('Rota otimizada:', combinedRoute);
      console.log('Endereços ordenados:', orderedAddresses);
      for (let i = 0; i < combinedRoute.length; i++) {
        const location = combinedRoute[i];
        const address = orderedAddresses[i];
        
        // Create a custom marker icon with the order number
        const markerIcon = new H.map.Icon(
          `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
            <circle cx="20" cy="20" r="18" fill="#007bff" stroke="white" stroke-width="2"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                  font-size="16" font-weight="bold" fill="white">
              ${i + 1}
            </text>
          </svg>`, 
          { size: { w: 40, h: 40 } }
        );
        
        const marker = new H.map.Marker(
          { lat: location.lat, lng: location.lng }, 
          { icon: markerIcon }
        );
        
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
      
      this.totalDuration = totalDuration; // Armazena a duração total no estado
      this.totalDistance = totalDistance; // Armazena a distância total no estado
      this.routeCalculated = true; // Habilita o botão "Iniciar Viagem"
  
      this.map.addObject(group);
      this.map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });
      return{
      combinedRoute, orderedAddresses
    }
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
          const route = result.routes[0];
          const section = route.sections[0];
          
          // Extract turn-by-turn instructions
          const turnInstructions = section.actions.map(action => ({
            instruction: action.instruction,
                type: action.type,
                distance: action.distance,
                duration: action.duration
          }));

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
          resolve({
            lineString,
            turnInstructions,
            summary: route.sections[0].summary
          });
          this.turnInstructions = turnInstructions.map((step) => ({
            instruction: step.instruction,
            distance: step.distance,
            duration: step.duration
          }));
        } else {
          reject(new Error("Nenhuma rota encontrada entre os pontos"));
        }
      }, (error) => {
        console.error('Erro ao calcular segmento da rota:', error.message);
        reject(error);
      });
    });
  }

  return {initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute, reverseGeocode, getCurrentLocation};
}
