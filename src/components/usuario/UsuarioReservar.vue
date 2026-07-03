<template>
  <div class="page-head">
    <h2>Reservar un puesto</h2>
    <p class="muted">Selecciona sección, horario y espacio disponible.</p>
  </div>

  <div class="grid-2-cards">
    <div class="card card-form">
      <h3>Datos de la reserva</h3>

      <div v-if="reservaActiva" class="form-msg error">
        Ya tienes una reserva activa. Cancélala desde "Mis Reservas" antes de crear otra.
      </div>

      <form novalidate @submit.prevent="onSubmit">
        <label for="resSeccion">Sección</label>
        <select id="resSeccion" v-model="seccion">
          <option value="A">Sección A — Docentes</option>
          <option value="B">Sección B — Estudiantes</option>
          <option value="C">Sección C — Administrativos</option>
        </select>

        <div class="grid-2">
          <div>
            <label for="resFecha">Fecha</label>
            <input type="date" id="resFecha" v-model="fecha" :min="hoyISO()">
            <span class="error-msg">{{ errores.fecha }}</span>
          </div>
          <div>
            <label for="resPlaca">Placa del vehículo</label>
            <input type="text" id="resPlaca" v-model="placa">
            <span class="error-msg">{{ errores.placa }}</span>
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label for="resHoraIngreso">Hora de ingreso</label>
            <input type="time" id="resHoraIngreso" v-model="horaIngreso">
          </div>
          <div>
            <label for="resHoraSalida">Hora estimada de salida</label>
            <input type="time" id="resHoraSalida" v-model="horaSalida">
          </div>
        </div>
        <span class="error-msg">{{ errores.horas }}</span>

        <label>Selecciona tu puesto</label>
        <MapaParqueadero
          :clickable="!reservaActiva"
          :seccion-filtro="seccion"
          :seleccionado="puestoSeleccionado"
          :mini="true"
          @seleccionar="puestoSeleccionado = $event"
        />
        <span class="error-msg">{{ errores.puesto }}</span>

        <div class="form-msg" :class="mensajeTipo">{{ mensaje }}</div>
        <button type="submit" class="btn btn-primary btn-block">Confirmar reserva ✓</button>
      </form>
    </div>

    <div class="card">
      <h3>Resumen de la reserva</h3>

      <div v-if="ultimaReservaCreada" class="resumen-box">
        <div class="campo"><span>Puesto</span><b>{{ ultimaReservaCreada.puesto }}</b></div>
        <div class="campo"><span>Sección</span><b>{{ ultimaReservaCreada.seccion }}</b></div>
        <div class="campo"><span>Fecha</span><b>{{ ultimaReservaCreada.fecha }}</b></div>
        <div class="campo"><span>Horario</span><b>{{ ultimaReservaCreada.horaIngreso }} - {{ ultimaReservaCreada.horaSalida }}</b></div>
        <div class="codigo-box">Código de reserva<br>{{ ultimaReservaCreada.codigo }}</div>
        <p class="muted" style="margin-top:10px">Preséntale este código al guardia en la entrada para validar tu acceso.</p>
      </div>
      <div v-else-if="puestoSeleccionado" class="resumen-box">
        <div class="campo"><span>Usuario</span><b>{{ auth.usuario?.nombres }}</b></div>
        <div class="campo"><span>Puesto</span><b>{{ puestoSeleccionado }}</b></div>
        <div class="campo"><span>Sección</span><b>{{ seccion }}</b></div>
        <div class="campo"><span>Placa</span><b>{{ placa || "—" }}</b></div>
        <p class="muted" style="margin-top:10px">Tu puesto quedará marcado en amarillo mientras dure la reserva.</p>
      </div>
      <span v-else class="muted">Selecciona un puesto para ver el resumen.</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useUsersStore } from "../../stores/usersStore";
import { useReservasStore } from "../../stores/reservasStore";
import { useConfigStore } from "../../stores/configStore";
import { validarPlaca, hoyISO, toMinutos } from "../../utils/validaciones";
import MapaParqueadero from "../mapa/MapaParqueadero.vue";

// Avisa a UsuarioView que debe cambiar a la pestaña "Mis Reservas"
const emit = defineEmits(["ir-a-mis-reservas"]);

const auth = useAuthStore();
const usersStore = useUsersStore();
const reservasStore = useReservasStore();
const configStore = useConfigStore();

const reservaActiva = reservasStore.reservaActivaDe(auth.usuario.id);

const seccion = ref("A");
const fecha = ref("");
const placa = ref(auth.usuario.placa || "");
const horaIngreso = ref("");
const horaSalida = ref("");
const puestoSeleccionado = ref(null);
const ultimaReservaCreada = ref(null);

const errores = reactive({ fecha: "", placa: "", horas: "", puesto: "" });
const mensaje = ref("");
const mensajeTipo = ref("");

// Si cambia la sección, se pierde el puesto elegido de la sección anterior
watch(seccion, () => { puestoSeleccionado.value = null; });

function onSubmit() {
  errores.fecha = ""; errores.placa = ""; errores.horas = ""; errores.puesto = "";
  mensaje.value = "";

  if (reservasStore.reservaActivaDe(auth.usuario.id)) {
    mensaje.value = "Ya tienes una reserva activa. Cancélala primero.";
    mensajeTipo.value = "error";
    return;
  }

  const cfg = configStore.config;
  let valido = true;

  if (!fecha.value || fecha.value < hoyISO()) { errores.fecha = "Elige una fecha válida (hoy o en adelante)."; valido = false; }

  const placaMayus = placa.value.trim().toUpperCase();
  if (!validarPlaca(placaMayus)) { errores.placa = "Formato de placa inválido (Ej: ABC-1234)."; valido = false; }

  if (!horaIngreso.value || !horaSalida.value) {
    errores.horas = "Completa ambas horas.";
    valido = false;
  } else if (horaSalida.value <= horaIngreso.value) {
    errores.horas = "La hora de salida debe ser mayor a la de ingreso.";
    valido = false;
  } else {
    const duracionHoras = (toMinutos(horaSalida.value) - toMinutos(horaIngreso.value)) / 60;
    if (duracionHoras > cfg.maxHoras) { errores.horas = `La reserva no puede durar más de ${cfg.maxHoras} horas.`; valido = false; }
    if (horaIngreso.value < cfg.apertura || horaSalida.value > cfg.cierre) { errores.horas = `El parqueadero abre de ${cfg.apertura} a ${cfg.cierre}.`; valido = false; }
  }

  if (!puestoSeleccionado.value) { errores.puesto = "Selecciona un puesto disponible."; valido = false; }

  if (!valido) return;

  const nueva = reservasStore.crear({
    userId: auth.usuario.id,
    puesto: puestoSeleccionado.value,
    seccion: seccion.value,
    fecha: fecha.value,
    horaIngreso: horaIngreso.value,
    horaSalida: horaSalida.value,
    placa: placaMayus
  });

  // Si el usuario cambió la placa, se actualiza también su perfil
  usersStore.actualizarDatos(auth.usuario.id, { placa: placaMayus });
  auth.actualizarSesion({ placa: placaMayus });

  ultimaReservaCreada.value = nueva;
  mensaje.value = "Reserva confirmada. Guarda tu código para la entrada.";
  mensajeTipo.value = "ok";

  fecha.value = ""; horaIngreso.value = ""; horaSalida.value = ""; puestoSeleccionado.value = null;

  setTimeout(() => emit("ir-a-mis-reservas"), 2500);
}
</script>
