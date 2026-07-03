<template>
  <div class="page-head">
    <h2>Validación de Acceso</h2>
    <p class="muted">Confirma el código de reserva en la entrada.</p>
  </div>

  <div class="grid-2-cards">
    <div class="card card-form">
      <h3>Verificar reserva</h3>
      <form novalidate @submit.prevent="onSubmit">
        <label for="codigoReserva">Código de reserva</label>
        <input type="text" id="codigoReserva" v-model="codigo" placeholder="Ej: RES-2026-0847">
        <span class="error-msg">{{ error }}</span>
        <div class="form-msg" :class="mensajeTipo">{{ mensaje }}</div>
        <button type="submit" class="btn btn-primary btn-block">Verificar acceso →</button>
      </form>

      <!-- Aparte del puesto, aquí sale la opción para ver los datos del usuario -->
      <div v-if="ultimoResultado" class="resumen-box" style="margin-top:12px">
        <div class="campo"><span>Puesto</span><b>{{ ultimoResultado.reserva.puesto }}</b></div>
        <div class="campo"><span>Placa</span><b>{{ ultimoResultado.reserva.placa }}</b></div>
        <button type="button" class="btn btn-small btn-toggle" style="margin-top:10px" @click="mostrandoDatos = true">
          Ver datos del usuario
        </button>
      </div>

      <div v-if="mostrandoDatos && usuarioSeleccionado" class="card" style="margin-top:14px; background:#f8f3f4">
        <h3>Datos del usuario</h3>
        <div class="campo"><span>Nombres</span><b>{{ usuarioSeleccionado.nombres }}</b></div>
        <div class="campo"><span>Correo</span><b>{{ usuarioSeleccionado.correo }}</b></div>
        <div class="campo"><span>Rol</span><b>{{ usuarioSeleccionado.rol }}</b></div>
        <div class="campo"><span>Carrera / Departamento</span><b>{{ usuarioSeleccionado.carrera || "—" }}</b></div>
        <div class="campo"><span>Teléfono</span><b>{{ usuarioSeleccionado.telefono || "—" }}</b></div>
        <div class="campo"><span>Placa</span><b>{{ usuarioSeleccionado.placa || "—" }}</b></div>
        <div class="campo"><span>Marca del vehículo</span><b>{{ usuarioSeleccionado.marca || "—" }}</b></div>
        <div class="campo"><span>Color del vehículo</span><b>{{ usuarioSeleccionado.color || "—" }}</b></div>
        <button type="button" class="btn btn-ghost btn-small" style="margin-top:10px" @click="mostrandoDatos = false">Cerrar</button>
      </div>
    </div>

    <div class="card">
      <h3>Registro de entradas de hoy</h3>
      <table class="table">
        <thead><tr><th>Hora</th><th>Usuario</th><th>Puesto</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>
          <tr v-if="reservasStore.entradasHoy.length === 0"><td colspan="5" class="muted">Sin registros para hoy.</td></tr>
          <tr v-for="r in reservasStore.entradasHoy" :key="r.id">
            <td>{{ horaMostrar(r) }}</td>
            <td>{{ nombreUsuario(r.userId) }}</td>
            <td>{{ r.puesto }}</td>
            <td><span class="status-pill" :class="claseEstado(r.estado)">{{ r.estado }}</span></td>
            <td><button type="button" class="btn btn-small btn-toggle" @click="verDatosDe(r.userId)">Ver datos</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useReservasStore } from "../../stores/reservasStore";
import { useUsersStore } from "../../stores/usersStore";

const reservasStore = useReservasStore();
const usersStore = useUsersStore();

const codigo = ref("");
const error = ref("");
const mensaje = ref("");
const mensajeTipo = ref("");
const ultimoResultado = ref(null);
const mostrandoDatos = ref(false);
const usuarioSeleccionado = ref(null);

// Apenas se valida un código con éxito, se precarga el usuario dueño de esa reserva
watch(ultimoResultado, (val) => {
  if (val) usuarioSeleccionado.value = usersStore.buscarPorId(val.reserva.userId);
});

function onSubmit() {
  error.value = ""; mensaje.value = ""; ultimoResultado.value = null; mostrandoDatos.value = false;

  if (!codigo.value.trim()) { error.value = "Ingresa un código."; return; }

  const resultado = reservasStore.validarAcceso(codigo.value.trim().toUpperCase());
  mensaje.value = resultado.mensaje;
  mensajeTipo.value = resultado.ok ? "ok" : "error";

  if (resultado.ok) {
    ultimoResultado.value = resultado;
    codigo.value = "";
  }
}

function verDatosDe(userId) {
  usuarioSeleccionado.value = usersStore.buscarPorId(userId);
  mostrandoDatos.value = true;
}

function nombreUsuario(id) {
  const u = usersStore.buscarPorId(id);
  return u ? u.nombres : "—";
}

function horaMostrar(r) {
  return r.horaIngresoReal
    ? new Date(r.horaIngresoReal).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    : r.horaIngreso;
}

function claseEstado(estado) {
  if (estado === "ocupado") return "status-activo";
  if (estado === "reservado") return "status-pendiente";
  return "status-inactivo";
}
</script>
