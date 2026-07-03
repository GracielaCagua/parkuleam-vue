<template>
  <div class="page-head">
    <h2>Mis Reservas</h2>
    <p class="muted">Reservas activas e historial de tu cuenta.</p>
  </div>

  <div class="grid-2-cards">
    <div class="card">
      <h3>Reserva activa</h3>
      <div v-if="!activa" class="muted">No tienes una reserva activa.</div>
      <div v-else class="reserva-activa-card">
        <h3 style="margin-top:0">{{ activa.puesto }}</h3>
        <p class="muted">Sección {{ activa.seccion }} · {{ activa.fecha }} · {{ activa.horaIngreso }} - {{ activa.horaSalida }}</p>
        <div class="codigo-box">Código de reserva<br>{{ activa.codigo }}</div>
        <span class="status-pill" :class="activa.estado === 'reservado' ? 'status-pendiente' : 'status-activo'">
          {{ activa.estado === "reservado" ? "Reservado" : "En el parqueadero" }}
        </span>
        <div v-if="activa.estado === 'reservado'" style="margin-top:10px">
          <button class="btn btn-small btn-reject" @click="reservasStore.cancelar(activa.id)">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Historial de reservas</h3>
      <ul class="historial-list">
        <li v-if="historial.length === 0" class="muted">Aún no tienes historial.</li>
        <li v-for="r in historial" :key="r.id">
          <span><b>{{ r.puesto }}</b><br><span class="muted">{{ r.fecha }} · {{ r.horaIngreso }}-{{ r.horaSalida }}</span></span>
          <span class="status-pill" :class="r.estado === 'completada' ? 'status-activo' : 'status-rechazado'">
            {{ r.estado === "completada" ? "Completada" : "Cancelada" }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useReservasStore } from "../../stores/reservasStore";

const auth = useAuthStore();
const reservasStore = useReservasStore();

const activa = computed(() => reservasStore.reservaActivaDe(auth.usuario.id));
const historial = computed(() => reservasStore.historialDe(auth.usuario.id));
</script>
