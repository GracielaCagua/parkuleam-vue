<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="logo-circle">P</div>
      <h1>ParkULEAM</h1>
      <p class="muted">Sistema de Control de Parqueaderos · ULEAM</p>

      <form novalidate @submit.prevent="onSubmit">
        <label for="loginCorreo">Correo institucional</label>
        <input type="email" id="loginCorreo" v-model="correo" placeholder="correo@uleam.edu.ec">
        <span class="error-msg">{{ errores.correo }}</span>

        <label for="loginPassword">Contraseña</label>
        <input type="password" id="loginPassword" v-model="password" placeholder="********">
        <span class="error-msg">{{ errores.password }}</span>

        <div class="form-msg" :class="mensajeTipo">{{ mensaje }}</div>

        <button type="submit" class="btn btn-primary btn-block">Ingresar al sistema →</button>
      </form>

      <p class="foot-link">¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
      <p class="foot-hint muted">Admin de prueba: admin@uleam.edu.ec / admin123 · Guardia de prueba: guardia@uleam.edu.ec / guardia123</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const correo = ref("");
const password = ref("");
const mensaje = ref("");
const mensajeTipo = ref("");
const errores = reactive({ correo: "", password: "" });

function onSubmit() {
  errores.correo = "";
  errores.password = "";
  mensaje.value = "";

  let valido = true;
  if (!correo.value.trim()) { errores.correo = "Ingresa tu correo."; valido = false; }
  if (!password.value) { errores.password = "Ingresa tu contraseña."; valido = false; }
  if (!valido) return;

  const resultado = auth.login(correo.value.trim(), password.value);
  if (!resultado.ok) {
    mensaje.value = resultado.mensaje;
    mensajeTipo.value = "error";
    return;
  }

  if (auth.rol === "administrador") router.push({ name: "admin" });
  else if (auth.rol === "guardia") router.push({ name: "guardia" });
  else router.push({ name: "usuario" });
}
</script>
