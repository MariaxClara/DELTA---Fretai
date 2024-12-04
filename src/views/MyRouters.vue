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

    <!-- Exibir a mensagem de erro -->
    <div v-if="errorMessage" class="divError" style="margin-top: 20px;">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Exibir o tempo total previsto -->
    <div v-if="totalDuration !== null" style="margin-top: 20px;">
      <p>Tempo total previsto: {{ totalDuration }} minutos</p>
      <p>Distância total: {{ totalDistance }} km</p>
    </div>

    <div ref="mapContainer" style="width: 400px; height:550px; margin-top: 20px;"></div>
    <div class="modal-buttons">
      <button :disabled="!routeCalculated | tripStarted" @click="startTrip">Iniciar Viagem</button>
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
      useManualAddress: false,
      showTurnSelectionModal: true, // Mostrar o modal de seleção de turno ao carregar a página
      selectedTurn: null,
      totalDuration: null,
      totalDistance: null,
      tripStarted: false, // Indica se a viagem foi iniciada
      routeCalculated: false, // Indica se a rota foi calculada   
      errorMessage: null,
      alertEndTrip: false
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
      this.tripStarted = true;
      //dar zoom
      //andar de acordo com a localizacao
      //se passar pelo waypoint, tem que tirar o marker do waypoint
      //se chegar no destino, tem que finalizar a viagem
      
      
      // this.isAutoZoom = true;
      // this.updateMarkerPosition();
    },
    finalizeTrip(action) {
      //alerta: tem certeza que deseja finalizar a corrida?
      this.alertEndTrip = true;
      if (action === 'keep') {
        this.alertEndTrip = false;
      } else if (action === 'end') {
        this.alertEndTrip = false;
        this.tripStarted = false;
        this.map.removeObjects(this.map.getObjects());
        this.routeCalculated = false;
        this.totalDuration = null; // Limpar a duração total
        this.totalDistance = null; // Limpar a distância total
        this.originAddress = ""; // Limpar o endereço de origem
        this.destinationAddress = ""; // Limpar o endereço de destino
        this.waypoints = [];
      }
      //alerta: voce chegou ao seu destino
      
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

</style>  