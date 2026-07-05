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

  <GuardiaEstado v-if="tabActivo === 'estado'" />
  <GuardiaValidacion v-else-if="tabActivo === 'validacion'" />
</template>

<script setup>
import { ref } from "vue";
import GuardiaEstado from "../components/guardia/GuardiaEstado.vue";
import GuardiaValidacion from "../components/guardia/GuardiaValidacion.vue";

const tabActivo = ref("estado");

const tabs = [
  { id: "estado", label: "Estado del Parqueadero" },
  { id: "validacion", label: "Validación de Acceso" }
];
</script>