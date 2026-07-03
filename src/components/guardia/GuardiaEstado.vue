<template>
  <div class="page-head">
    <h2>Estado del Parqueadero</h2>
    <p class="muted">Vista del controlador · solo lectura.</p>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="num">{{ stats.total }}</div><div class="label">Espacios totales</div></div>
    <div class="stat-card"><div class="num">{{ stats.libres }}</div><div class="label">Libres</div><span class="tag tag-green">Disponibles</span></div>
    <div class="stat-card"><div class="num">{{ stats.reservados }}</div><div class="label">Reservados</div><span class="tag tag-yellow">En espera</span></div>
    <div class="stat-card"><div class="num">{{ stats.ocupados }}</div><div class="label">Ocupados</div><span class="tag tag-red">En el lugar</span></div>
  </div>

  <MapaParqueadero :clickable="false" />
</template>

<script setup>
import { computed } from "vue";
import { useSpotsStore } from "../../stores/spotsStore";
import MapaParqueadero from "../mapa/MapaParqueadero.vue";

const spotsStore = useSpotsStore();
const stats = computed(() => spotsStore.stats);
</script>
