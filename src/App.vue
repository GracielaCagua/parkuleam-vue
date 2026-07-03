<template>
  <TopBar v-if="auth.estaLogueado" />
  <main class="container">
    <router-view />
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import TopBar from "./components/layout/TopBar.vue";

const auth = useAuthStore();

// Al abrir la app, revisamos que la sesión guardada siga siendo válida
// (por ejemplo, si el administrador desactivó la cuenta mientras tanto)
onMounted(() => {
  auth.revalidar();
});
</script>
