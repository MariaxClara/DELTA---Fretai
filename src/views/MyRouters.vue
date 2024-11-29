<template>
  <div id="app">
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

    <!-- Main Content -->
    <template v-if="!useManualAddress">
      <p>Utilizando localização atual</p>
    </template>
    
    <template v-else>
      <p>Utilizando endereço manual</p>
      <label>Origem:
        <input type="text" v-model="originAddress" placeholder="Endereço de origem" />
      </label>
    </template>
    
    <label>Destino:
      <input type="text" v-model="destinationAddress" placeholder="Endereço de destino" />
    </label>
    
    <div v-for="(waypoint, index) in waypoints" :key="index">
      <label>Parada {{ index + 1 }}:
        <input type="text" v-model="waypoint.address" placeholder="Endereço de parada" />
      </label>
      <button @click="removeWaypoint(index)">Remover</button>
    </div>
    
    <button @click="addWaypoint">Adicionar Parada</button>
    <button @click="updateRoute">Calcular Rota</button>

    <div ref="mapContainer" style="width: 400px; height:550px; margin-top: 20px;"></div>
    <div class="modal-buttons">
      <button :disabled="tripStarted" @click="startTrip">Iniciar Viagem</button>
    <button :disabled="!tripStarted" @click="finalizeTrip">Finalizar Viagem</button>
    </div>
  </div>
</template>

<script>
import maps from "../composables/routes/codes.js"
import { loadHereMaps } from "../composables/here-maps.js"

const { initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute, reverseGeocode} = maps()

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
      useManualAddress: false
    };
  },
  async mounted() {
    await loadHereMaps();
    
    try {
      await this.checkGeolocationPermission();
    } catch (error) {
      // Only show modal if explicitly denied
      if (error.name === 'PermissionDeniedError') {
        this.showGeolocationDenyModal = true;
      }
    }
    
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
    }
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

</style>