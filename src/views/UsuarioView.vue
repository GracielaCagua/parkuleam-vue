<template>
  <div class="subtabs">
    <button
      v-for="t in tabs" :key="t.id"
      class="subtab" :class="{ active: tabActivo === t.id }"
      @click="tabActivo = t.id"
    >
      {{ t.label }}
    </button>
  </div>

  <div v-if="tabActivo === 'mapa'">
    <div class="page-head">
      <h2>Mapa del Parqueadero</h2>
      <p class="muted">Toca un puesto libre y ve a la pestaña "Reservar" para confirmarlo.</p>
    </div>
    <MapaParqueadero :clickable="false" />
  </div>
  <UsuarioReservar v-else-if="tabActivo === 'reservar'" @ir-a-mis-reservas="tabActivo = 'misreservas'" />
  <UsuarioMisReservas v-else-if="tabActivo === 'misreservas'" />
  <UsuarioPerfil v-else-if="tabActivo === 'perfil'" />
</template>

<script setup>
import { ref } from "vue";
import MapaParqueadero from "../components/mapa/MapaParqueadero.vue";
import UsuarioReservar from "../components/usuario/UsuarioReservar.vue";
import UsuarioMisReservas from "../components/usuario/UsuarioMisReservas.vue";
import UsuarioPerfil from "../components/usuario/UsuarioPerfil.vue";

const tabActivo = ref("mapa");

const tabs = [
  { id: "mapa", label: "Mapa" },
  { id: "reservar", label: "Reservar" },
  { id: "misreservas", label: "Mis Reservas" },
  { id: "perfil", label: "Perfil" }
];
</script>