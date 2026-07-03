<template>
  <div class="page-head">
    <h2>Solicitudes de acceso</h2>
    <p class="muted">Aprueba o rechaza las cuentas nuevas antes de que puedan ingresar al sistema.</p>
  </div>

  <div class="card">
    <table class="table">
      <thead>
        <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Placa</th><th>Fecha</th><th>Acción</th></tr>
      </thead>
      <tbody>
        <tr v-for="u in usersStore.pendientes" :key="u.id">
          <td>{{ u.nombres }}</td>
          <td>{{ u.correo }}</td>
          <td>{{ u.rol }}</td>
          <td>{{ u.placa }}</td>
          <td>{{ new Date(u.fechaRegistro).toLocaleDateString("es-EC") }}</td>
          <td>
            <button class="btn btn-small btn-approve" @click="usersStore.aprobar(u.id)">Aprobar</button>
            <button class="btn btn-small btn-reject" @click="usersStore.rechazar(u.id)">Rechazar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="usersStore.pendientes.length === 0" class="muted empty-msg">No hay solicitudes pendientes.</p>
  </div>
</template>

<script setup>
import { useUsersStore } from "../../stores/usersStore";
const usersStore = useUsersStore();
</script>
