<template>
  <div class="subtabs">
    <button
      v-for="t in tabs" :key="t.id"
      class="subtab" :class="{ active: tabActivo === t.id }"
      @click="tabActivo = t.id"
    >
      {{ t.label }}
      <span v-if="t.id === 'solicitudes' && usersStore.totalPendientes > 0" class="badge">{{ usersStore.totalPendientes }}</span>
    </button>
  </div>

  <AdminDashboard v-if="tabActivo === 'dashboard'" />
  <AdminSolicitudes v-else-if="tabActivo === 'solicitudes'" />
  <AdminUsuarios v-else-if="tabActivo === 'usuarios'" />
  <div v-else-if="tabActivo === 'mapa'">
    <div class="page-head">
      <h2>Mapa del Parqueadero</h2>
      <p class="muted">Disponibilidad en tiempo real (vista del administrador).</p>
    </div>
    <MapaParqueadero :clickable="false" />
  </div>
  <AdminReportes v-else-if="tabActivo === 'reportes'" />
  <AdminConfiguracion v-else-if="tabActivo === 'configuracion'" />
</template>

<script setup>
import { ref } from "vue";
import { useUsersStore } from "../stores/usersStore";
import MapaParqueadero from "../components/mapa/MapaParqueadero.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import AdminSolicitudes from "../components/admin/AdminSolicitudes.vue";
import AdminUsuarios from "../components/admin/AdminUsuarios.vue";
import AdminReportes from "../components/admin/AdminReportes.vue";
import AdminConfiguracion from "../components/admin/AdminConfiguracion.vue";

const usersStore = useUsersStore();
const tabActivo = ref("dashboard");

const tabs = [
  { id: "dashboard", label: "Panel" },
  { id: "solicitudes", label: "Solicitudes" },
  { id: "usuarios", label: "Usuarios" },
  { id: "mapa", label: "Mapa" },
  { id: "reportes", label: "Reportes" },
  { id: "configuracion", label: "Configuración" }
];
</script>