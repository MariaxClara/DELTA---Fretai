<template>
  <div id="app">
    <!-- Turn Selection Modal -->
    <div v-if="showTurnSelectionModal" class="modal">
      <div class="modal-content">
        <p>Selecione o turno:</p>
        <div class="modal-buttons">
          <button @click="selectTurn('morning')">Manhã</button>
          <button @click="selectTurn('afternoon')">Tarde</button>
          <button @click="selectTurn('night')">Noite</button>
        </div>
      </div>
    </div>

    <!-- Geolocation Deny Modal -->
    <div v-if="showGeolocationDenyModal" class="modal">
      <div class="modal-content">
        <p>Se você não permitir acesso, o passageiro não verá a sua localização em tempo real.</p>
        <div class="modal-buttons">
          <button @click="handleGeolocationDeny('retry')">Permitir localização!</button>
          <button @click="handleGeolocationDeny('continue')">Manter dessa forma</button>
        </div>
      </div>
    </div>

    <div v-if="alertEndTrip" class="modal">
      <div class="modal-content">
        <p>Você tem certeza que deseja finalizar a viagem?</p>
        <div class="modal-buttons">
          <button @click="finalizeTrip('keep')">Continuar com a viagem!</button>
          <button @click="finalizeTrip('end')">Sim, finalizar!</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!useManualAddress">
      <p class='infos'>Utilizando localização atual</p>
    </template>
    
    <template v-else class="infos">
      <p class="infos">Utilizando endereço manual</p>
      <label class="infos">Origem:
        <input type="text" v-model="originAddress" placeholder="Endereço de origem" />
      </label>
    </template>
    
    <label class="infos">Destino:
      <input type="text" v-model="destinationAddress" placeholder="Endereço de destino" />
    </label>
    
    <div v-for="(waypoint, index) in waypoints" :key="index" class="infos">
      <label class="infos">Parada {{ index + 1 }}:
        <input type="text" v-model="waypoint.address" placeholder="Endereço de parada" />
      </label>
      <button @click="removeWaypoint(index)">Remover</button>
    </div>
    
    <button @click="addWaypoint">Adicionar Parada</button>
    <button @click="updateRoute">Calcular Rota</button>

    <!-- Exibir a mensagem de erro -->
    <div v-if="errorMessage" class="divError" style="margin-top: 20px;">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Exibir o tempo total previsto -->
    <div v-if="totalDuration !== null" class='infos' style="margin-top: 20px;">
      <p>Tempo total previsto: {{ totalDuration }} minutos</p>
      <p>Distância total: {{ totalDistance }} km</p>
    </div>

    <div ref="mapContainer" style="width: 400px; height:550px; margin-top: 20px;"></div>
    <div class="modal-buttons">
      <button :disabled="!routeCalculated | tripStarted" @click="startTrip">Iniciar Viagem</button>
    <button :disabled="!tripStarted" @click="finalizeTrip">Finalizar Viagem</button>
    </div>
     <!-- Turn-By-Turn -->
     <div id="turnByTurn" class = 'infos' style="padding: 10px; max-width: 400px;">
      <h3>Instruções de Navegação</h3>
      <ul v-if="turnInstructions.length">
        <li v-for="(step, index) in turnInstructions" :key="index">
          <div><strong>{{ step.instruction }}</strong></div>
          <div>Tempo: {{ (step.duration / 60).toFixed(2) }} min</div>
        </li>
      </ul>
      <p v-else>Sem instruções disponíveis.</p>
    </div>
  </div>
</template>

<script>
import maps from "../composables/routes/codes.js"
import { loadHereMaps } from "../composables/here-maps.js"

const { initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute, reverseGeocode, getCurrentLocation} = maps()

export default {
  name: 'MyRouters',
  mixins: [ initMapPlatform ],

  data() {
    return {
      originAddress: "Jacareí, São Paulo",
      destinationAddress: "São José dos Campos, São Paulo",
      waypoints: [],
      platform: null,
      map: null,
      ui: null,
      searchService: null,
      showGeolocationDenyModal: false,
      useManualAddress: false,
      showTurnSelectionModal: true, // Mostrar o modal de seleção de turno ao carregar a página
      selectedTurn: null,
      totalDuration: null,
      totalDistance: null,
      tripStarted: false, // Indica se a viagem foi iniciada
      routeCalculated: false, // Indica se a rota foi calculada   
      errorMessage: null,
      alertEndTrip: false,
      isAutoZoom: false,
      turnInstructions: [],
      locationCheckInterval: null, // Add this to track the interval
    };
  },
  async mounted() {
    await loadHereMaps();
    this.initMapPlatform();
  },
  methods: {
    initMapPlatform,
    geocodeAddress,
    addWaypoint,
    removeWaypoint,
    updateRoute,
    calculateSegmentRoute,
    reverseGeocode,
    
    async checkGeolocationPermission() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocalização não suportada'));
        }
        
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            resolve();
          } else if (result.state === 'denied') {
            const error = new Error('Permissão de Geolocalização negada');
            error.name = 'PermissionDeniedError';
            reject(error);
          } else {
            // For 'prompt' state, let the browser's native dialog handle it
            navigator.geolocation.getCurrentPosition(
              () => resolve(),
              (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                  error.name = 'PermissionDeniedError';
                }
                reject(error)
              }
            );
          }
        });
      });
    },
    
    handleGeolocationDeny(action) {
      if (action === 'retry') {
        alert('Por favor, limpe as preferências de localização nas configurações do seu navegador e recarregue a página.');
      } else if (action === 'continue') {
        this.useManualAddress = true;
        this.showGeolocationDenyModal = false;
      }
    },

    async selectTurn(turn) {
      this.selectedTurn = turn;
      this.showTurnSelectionModal = false;
      console.log(`Turno selecionado: ${turn}`);
      
      // Após a seleção do turno, verificar a permissão de geolocalização
      try {
        await this.checkGeolocationPermission();
      } catch (error) {
        // Only show modal if explicitly denied
        if (error.name === 'PermissionDeniedError') {
          this.showGeolocationDenyModal = true;
        }
      }
    },
    startTrip() {
  // Validate that the route has been calculated
  if (!this.routeCalculated) {
    this.errorMessage = "Calcule a rota antes de iniciar a viagem.";
    return;
  }

  // Reset any previous tracking
  if (this.watchPositionId) {
    navigator.geolocation.clearWatch(this.watchPositionId);
  }

  // Mark trip as started
  this.tripStarted = true;

 
  this.map.addObject(this.van);
  this.map.setZoom(20); // Adjust zoom level as needed
  

  // Begin geolocation tracking with more verbose logging
  this.watchPositionId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const currentLocation = { lat: latitude, lng: longitude };

      console.group('Geolocation Update');
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Accuracy:', accuracy + 'm');
      
      // Explicitly update marker position
      if (this.van) {
        console.log('Updating van marker position');
        this.van.setGeometry(new H.geo.Point(latitude, longitude));
        
        // Center and zoom the map on current location
        this.map.setCenter({ lat: latitude, lng: longitude });
        this.map.setZoom(20); // Adjust zoom level as needed
      } else {
        console.error('Van marker is undefined');
      }
      
      console.groupEnd();
    },
    (error) => {
      console.error('Geolocation Error:', {
        code: error.code,
        message: error.message
      });
      
      // Map error codes to human-readable messages
      switch(error.code) {
        case error.PERMISSION_DENIED:
          this.errorMessage = "Permissão de localização negada.";
          break;
        case error.POSITION_UNAVAILABLE:
          this.errorMessage = "Informação de localização não disponível.";
          break;
        case error.TIMEOUT:
          this.errorMessage = "Tempo limite para obter localização excedido.";
          break;
        default:
          this.errorMessage = "Erro desconhecido ao obter localização.";
      }
      
      this.tripStarted = false;
    },
    {
      enableHighAccuracy: true, // Most precise location
      maximumAge: 0,            // Don't use cached positions
      timeout: 10000            // 10 seconds timeout
    }
  );

      this.locationCheckInterval = setInterval(() => {
      // Check and log current van location
      if (this.van) {
        const currentPosition = this.van.getGeometry();
        console.log('Van Location Check:', {
          latitude: currentPosition.lat,
          longitude: currentPosition.lng,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 1000); 
  },

// async handlePositionUpdate(position) {
//   const { latitude, longitude } = position.coords;
//   const currentLocation = { lat: latitude, lng: longitude };

//   // Update van marker position
//   if (this.van) {
//     this.van.setGeometry(currentLocation);
//     this.map.setCenter(currentLocation);
//   }
//   try {
//     // Check if we've deviated from the route
//     if (await this.hasDeviatedFromRoute(currentLocation)) {
//       await this.recalculateRouteWithCurrentLocation(currentLocation);
//     }

//     // Check if destination is reached
//     if (this.isDestinationReached(currentLocation)) {
//       this.finalizeTrip();
//     }
//   } catch (error) {
//     console.error('Erro durante atualização de posição:', error);
//   }
// },

// handlePositionError(error) {
//   console.error('Erro de geolocalização:', error);
//   this.errorMessage = "Não foi possível obter a localização atual.";
//   this.tripStarted = false;
// },

// hasDeviatedFromRoute(currentLocation, toleranceInKm = 0.5) {
//   // Basic deviation check - you'll want to implement a more sophisticated method
//   if (!this.routeLineString) return false;

//   // Calculate distance from the current route
//   // This is a placeholder - you'll need to implement actual route deviation detection
//   const routePoints = this.routeLineString.getGeometry().getLatLngAltArray();
  
//   // Find the closest point on the route to the current location
//   let minDistance = Infinity;
//   for (let i = 0; i < routePoints.length; i += 3) {
//     const routePoint = {
//       lat: routePoints[i],
//       lng: routePoints[i + 1]
//     };
    
//     const distance = this.calculateDistance(currentLocation, routePoint);
//     minDistance = Math.min(minDistance, distance);
//   }

//   return minDistance > toleranceInKm;
// },

// isDestinationReached(currentLocation, toleranceInKm = 0.1) {
//   // Get the last waypoint (destination)
//   if (this.waypoints && this.waypoints.length > 0) {
//     const destination = this.waypoints[this.waypoints.length - 1];
    
//     if (destination) {
//       const distance = this.calculateDistance(
//         currentLocation, 
//         { lat: destination.lat, lng: destination.lng }
//       );
      
//       return distance <= toleranceInKm;
//     }
//   }
  
//   return false;
// },

// async recalculateRouteWithCurrentLocation(currentLocation) {
//   try {
//     // Find the closest point in the current route
//     const closestWaypoint = this.findClosestWaypoint(currentLocation);

//     // Update the route starting from the current location
//     const updatedRoute = await this.updateRoute({
//       startingPoint: currentLocation,
//       skipWaypoints: closestWaypoint.skippedWaypoints
//     });

//     // Update map with the new route
//     this.updateMapWithNewRoute(updatedRoute);
//   } catch (error) {
//     console.error('Erro ao recalcular rota:', error);
//   }
// },

// findClosestWaypoint(currentLocation) {
//   // Find the closest waypoint to the current location
//   const distances = this.waypoints.map(wp => 
//     this.calculateDistance(currentLocation, wp)
//   );
  
//   const closestIndex = distances.indexOf(Math.min(...distances));
  
//   return {
//     closestIndex,
//     skippedWaypoints: this.waypoints.slice(0, closestIndex)
//   };
// },

    finalizeTrip(action) {
      //alerta: tem certeza que deseja finalizar a corrida?
      this.alertEndTrip = true;
      if (action === 'keep') {
        this.alertEndTrip = false;
        return;
      } else if (action === 'end') {
        this.alertEndTrip = false;
        this.tripStarted = false;
        this.map.removeObjects(this.map.getObjects());
        this.routeCalculated = false;
        this.routeLineString = null;
        this.totalDuration = null; // Limpar a duração total
        this.totalDistance = null; // Limpar a distância total
        this.originAddress = ""; // Limpar o endereço de origem
        this.destinationAddress = ""; // Limpar o endereço de destino
        this.waypoints = [];
        this.turnInstructions = [];
      }
      //alerta: voce chegou ao seu destino
      if (this.locationCheckInterval) {
      clearInterval(this.locationCheckInterval);
      this.locationCheckInterval = null;
      }
      // Parar de acompanhar a posição do marcador
      navigator.geolocation.clearWatch(this.watchPositionId);
      
    },
  
    
    calculateDistance(coord1, coord2) {
      const R = 6371; // Raio da Terra em km
      const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
      const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    },  
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #BAE6FD;
}

#app input {
  margin: 5px;
  padding: 5px;
  color: #000000;
}

#app button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #3498DB;
  color: #FFFFFF;
}

#app button:disabled {
  background-color: darkgray;
  color: white;
  cursor: not-allowed;
}

#app div[ref="mapContainer"] {
  margin-top: 20px;
}

#app ::placeholder {
  color: #000000;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #333;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  max-width: 300px;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.modal-buttons button {
  margin: 0 10px;
  padding: 20px;
  border: 8px;
  border-radius: 20px;
  cursor: pointer;
  background-color: #3498DB;
  color: white;
}

.divError {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #B77575;
    padding: 5px;
    width: 30%;
    height: 100%;

    border: 0.15em solid #FFFCFC;
    border-radius: 5%;
}

.infos{
  text-align: center; /* Alinhar o texto ao centro */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adicionar sombreamento ao texto */
  margin-top: 10px; /* Adicionar margem superior */
  margin-bottom: 10px; /* Adicionar margem inferior */
  padding: 2px; /* Adicionar padding */
}

</style>  