<template>
  <div class="page-head">
    <h2>Reportes y Estadísticas</h2>
    <p class="muted">Historial de uso del parqueadero.</p>
  </div>

  <div class="stat-grid">
    <div class="stat-card"><div class="num">{{ reservasStore.reservas.length }}</div><div class="label">Reservas totales</div></div>
    <div class="stat-card"><div class="num">{{ pctOcupacion }}%</div><div class="label">Tasa de ocupación</div></div>
    <div class="stat-card"><div class="num">{{ enParqueaderoAhora }}</div><div class="label">En el parqueadero ahora</div></div>
    <div class="stat-card"><div class="num">{{ usuariosActivos }}</div><div class="label">Usuarios activos</div></div>
  </div>

  <div class="card">
    <h3>Historial de reservas</h3>
    <table class="table">
      <thead><tr><th>Fecha</th><th>Usuario</th><th>Puesto</th><th>Sección</th><th>Placa</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-if="historial.length === 0"><td colspan="6" class="muted">Todavía no hay reservas registradas.</td></tr>
        <tr v-for="r in historial" :key="r.id">
          <td>{{ formatearFechaHora(r.creadoEn) }}</td>
          <td>{{ nombreUsuario(r.userId) }}</td>
          <td>{{ r.puesto }}</td>
          <td>{{ r.seccion }}</td>
          <td>{{ r.placa }}</td>
          <td><span class="status-pill status-activo">{{ r.estado }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useReservasStore } from "../../stores/reservasStore";
import { useSpotsStore } from "../../stores/spotsStore";
import { useUsersStore } from "../../stores/usersStore";
import { formatearFechaHora } from "../../utils/validaciones";

const reservasStore = useReservasStore();
const spotsStore = useSpotsStore();
const usersStore = useUsersStore();

const historial = computed(() => reservasStore.reservas.slice().reverse());

const pctOcupacion = computed(() => {
  const s = spotsStore.stats;
  return s.total ? Math.round((s.ocupados / s.total) * 100) : 0;
});

const enParqueaderoAhora = computed(() => reservasStore.reservas.filter(r => r.estado === "ocupado").length);
const usuariosActivos = computed(() => usersStore.usuarios.filter(u => u.estado === "activo").length);

function nombreUsuario(id) {
  const u = usersStore.buscarPorId(id);
  return u ? u.nombres : "—";
}
</script>
