<template>
  <div class="page-head">
    <h2>Panel del Administrador</h2>
    <p class="muted">Bienvenida/o, {{ auth.usuario?.nombres }} — {{ fechaHoy }}</p>
  </div>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="num">{{ stats.total }}</div>
      <div class="label">Espacios totales</div>
      <span class="tag tag-blue">Parqueadero principal</span>
    </div>
    <div class="stat-card">
      <div class="num">{{ stats.libres }}</div>
      <div class="label">Disponibles ahora</div>
      <span class="tag tag-green">{{ pctLibres }}% libre</span>
    </div>
    <div class="stat-card">
      <div class="num">{{ stats.reservados }}</div>
      <div class="label">Reservados</div>
      <span class="tag tag-yellow">En espera</span>
    </div>
    <div class="stat-card">
      <div class="num">{{ stats.ocupados }}</div>
      <div class="label">Ocupados ahora</div>
      <span class="tag tag-red">{{ pctOcupados }}% ocupado</span>
    </div>
  </div>

  <div class="card">
    <h3>Actividad reciente</h3>
    <ul class="activity-list">
      <li v-if="actividad.length === 0" class="muted">Todavía no hay actividad registrada.</li>
      <li v-for="r in actividad" :key="r.id">
        {{ nombreUsuario(r.userId) }} — puesto {{ r.puesto }}
        <span class="act-time">{{ formatearFechaHora(r.creadoEn) }} · {{ r.estado }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useSpotsStore } from "../../stores/spotsStore";
import { useReservasStore } from "../../stores/reservasStore";
import { useUsersStore } from "../../stores/usersStore";
import { formatearFechaHora } from "../../utils/validaciones";

const auth = useAuthStore();
const spotsStore = useSpotsStore();
const reservasStore = useReservasStore();
const usersStore = useUsersStore();

const stats = computed(() => spotsStore.stats);
const pctLibres = computed(() => (stats.value.total ? Math.round((stats.value.libres / stats.value.total) * 100) : 0));
const pctOcupados = computed(() => (stats.value.total ? Math.round((stats.value.ocupados / stats.value.total) * 100) : 0));

const actividad = computed(() => reservasStore.reservas.slice(-4).reverse());

const fechaHoy = new Date().toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

function nombreUsuario(id) {
  const u = usersStore.buscarPorId(id);
  return u ? u.nombres : "Usuario";
}
</script>
