<template>
  <div class="page-head">
    <h2>Crear cuenta</h2>
    <p class="muted">Completa tus datos. Un administrador revisará y aprobará tu solicitud antes de que puedas ingresar.</p>
  </div>

  <div class="card card-form">
    <form novalidate @submit.prevent="onSubmit">
      <div class="grid-2">
        <div>
          <label for="regNombres">Nombres completos</label>
          <input type="text" id="regNombres" v-model="form.nombres" placeholder="Ej: Graciela Cagua Campozano">
          <span class="error-msg">{{ errores.nombres }}</span>
        </div>
        <div>
          <label for="regCorreo">Correo institucional</label>
          <input type="email" id="regCorreo" v-model="form.correo" placeholder="correo@uleam.edu.ec">
          <span class="error-msg">{{ errores.correo }}</span>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label for="regRol">Rol</label>
          <select id="regRol" v-model="form.rol">
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>
        <div>
          <label for="regCarrera">Carrera / Departamento</label>
          <input type="text" id="regCarrera" v-model="form.carrera" placeholder="Ing. en Sistemas">
          <span class="error-msg">{{ errores.carrera }}</span>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label for="regPlaca">Placa del vehículo</label>
          <input type="text" id="regPlaca" v-model="form.placa" placeholder="ABC-1234">
          <span class="error-msg">{{ errores.placa }}</span>
        </div>
        <div>
          <label for="regTelefono">Teléfono</label>
          <input type="text" id="regTelefono" v-model="form.telefono" placeholder="09XX-XXX-XXX">
          <span class="error-msg">{{ errores.telefono }}</span>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label for="regPassword">Contraseña</label>
          <input type="password" id="regPassword" v-model="form.password" placeholder="Mínimo 6 caracteres">
          <span class="error-msg">{{ errores.password }}</span>
        </div>
        <div>
          <label for="regPassword2">Confirmar contraseña</label>
          <input type="password" id="regPassword2" v-model="form.password2" placeholder="Repite la contraseña">
          <span class="error-msg">{{ errores.password2 }}</span>
        </div>
      </div>

      <div class="form-msg" :class="mensajeTipo">{{ mensaje }}</div>

      <div class="form-actions">
        <button type="button" class="btn btn-ghost" @click="router.push({ name: 'login' })">Cancelar</button>
        <button type="submit" class="btn btn-primary">Enviar solicitud</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "../stores/usersStore";
import { validarCorreoInstitucional, validarPlaca, validarTelefono, generarId } from "../utils/validaciones";

const router = useRouter();
const usersStore = useUsersStore();

const form = reactive({
  nombres: "", correo: "", rol: "estudiante", carrera: "",
  placa: "", telefono: "", password: "", password2: ""
});

const errores = reactive({
  nombres: "", correo: "", carrera: "", placa: "", telefono: "", password: "", password2: ""
});

const mensaje = ref("");
const mensajeTipo = ref("");

function limpiarErrores() {
  Object.keys(errores).forEach(k => errores[k] = "");
  mensaje.value = "";
}

function onSubmit() {
  limpiarErrores();
  let valido = true;

  if (form.nombres.trim().length < 3) { errores.nombres = "Ingresa tu nombre completo."; valido = false; }

  if (!validarCorreoInstitucional(form.correo)) {
    errores.correo = "Debe ser un correo institucional (@uleam.edu.ec).";
    valido = false;
  } else if (usersStore.correoYaRegistrado(form.correo)) {
    errores.correo = "Ese correo ya está registrado.";
    valido = false;
  }

  if (form.carrera.trim().length < 2) { errores.carrera = "Ingresa tu carrera o departamento."; valido = false; }

  const placa = form.placa.trim().toUpperCase();
  if (!validarPlaca(placa)) { errores.placa = "Formato de placa inválido (Ej: ABC-1234)."; valido = false; }

  if (!validarTelefono(form.telefono)) { errores.telefono = "Ingresa un teléfono válido (7 a 10 dígitos)."; valido = false; }

  if (form.password.length < 6) { errores.password = "La contraseña debe tener al menos 6 caracteres."; valido = false; }
  if (form.password2 !== form.password) { errores.password2 = "Las contraseñas no coinciden."; valido = false; }

  if (!valido) return;

  usersStore.registrarSolicitud({
    id: generarId("u"),
    nombres: form.nombres.trim(),
    correo: form.correo.trim(),
    password: form.password,
    rol: form.rol,
    carrera: form.carrera.trim(),
    placa,
    marca: "",
    color: "",
    telefono: form.telefono.trim()
  });

  mensaje.value = "Tu solicitud fue enviada. Espera la aprobación del administrador para poder ingresar.";
  mensajeTipo.value = "ok";
  setTimeout(() => router.push({ name: "login" }), 2200);
}
</script>
