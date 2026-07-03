<template>
  <div class="page-head">
    <h2>Usuarios registrados</h2>
    <p class="muted">Consulta el estado de las cuentas. Puedes activar o desactivar el acceso.</p>
  </div>

  <div class="card">
    <table class="table">
      <thead><tr><th>Nombre</th><th>Rol</th><th>Placa</th><th>Estado</th><th>Acción</th></tr></thead>
      <tbody>
        <tr v-for="u in usersStore.registrados" :key="u.id">
          <td>{{ u.nombres }}<br><span class="muted">{{ u.correo }}</span></td>
          <td>{{ u.rol }}</td>
          <td>{{ u.placa || "—" }}</td>
          <td><span class="status-pill" :class="'status-' + u.estado">{{ u.estado }}</span></td>
          <td>
            <button v-if="u.estado !== 'rechazado'" class="btn btn-small btn-toggle" @click="usersStore.toggleActivo(u.id)">
              {{ u.estado === "activo" ? "Desactivar" : "Activar" }}
            </button>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useUsersStore } from "../../stores/usersStore";
const usersStore = useUsersStore();
</script>
