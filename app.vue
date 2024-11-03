<template>
  <div id="app">
    <!-- Barra de endereços de origem, destino e waypoints dinâmicos -->
    <label>Origem:
      <input type="text" v-model="originAddress" placeholder="Endereço de origem" />
    </label>
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
  </div>
</template>

<script>
import maps from "./codes.js"

const { initMapPlatform, geocodeAddress, addWaypoint, removeWaypoint, updateRoute, calculateSegmentRoute } = maps()

export default {
  
  mixins: [ initMapPlatform ],

  data() {
    return {
      originAddress: "Jacareí, São Paulo",
      destinationAddress: "São José dos Campos, São Paulo",
      waypoints: [],
      platform: null,
      map: null,
      ui: null,
      searchService: null
    };
  },
  async mounted() {
    await this.$loadHereMaps();
    
    this.initMapPlatform();
  },
  methods: {
    initMapPlatform,
    geocodeAddress,
    addWaypoint,
    removeWaypoint,
    updateRoute,
    calculateSegmentRoute
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
}

#app button {
  margin-top: 10px;
  padding: 5px 10px;
}

#app div[ref="mapContainer"] {
  margin-top: 20px;
}
</style>
