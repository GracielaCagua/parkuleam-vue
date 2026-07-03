<template>
  <header class="topbar">
    <div class="topbar-brand"><span class="dot"></span> Park <b>ULEAM</b></div>
    <nav class="topbar-nav">
      <button class="active">{{ etiquetaPanel }}</button>
    </nav>
    <div class="topbar-user">
      <span>{{ auth.usuario?.nombres }} · {{ auth.usuario?.rol }}</span>
      <button class="btn btn-ghost" @click="salir">Salir</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const auth = useAuthStore();
const router = useRouter();

const etiquetaPanel = computed(() => {
  if (auth.rol === "administrador") return "Panel Admin";
  if (auth.rol === "guardia") return "Panel Guardia";
  return "Mi Cuenta";
});

function salir() {
  auth.logout();
  router.push({ name: "login" });
}
</script>
