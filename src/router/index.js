import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import LoginView from "../views/LoginView.vue";
import RegistroView from "../views/RegistroView.vue";
import AdminView from "../views/AdminView.vue";
import UsuarioView from "../views/UsuarioView.vue";
import GuardiaView from "../views/GuardiaView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: LoginView },
  { path: "/registro", name: "registro", component: RegistroView },
  { path: "/admin/:tab?", name: "admin", component: AdminView, meta: { rol: "administrador" } },
  { path: "/usuario/:tab?", name: "usuario", component: UsuarioView, meta: { rol: "usuario" } },
  { path: "/guardia/:tab?", name: "guardia", component: GuardiaView, meta: { rol: "guardia" } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardia de navegación: revisa la sesión antes de entrar a cada ruta
router.beforeEach((to) => {
  const auth = useAuthStore();

  // Ruta que exige un rol y no hay sesión -> al login
  if (to.meta.rol && !auth.estaLogueado) {
    return { name: "login" };
  }

  // Ruta que exige un rol distinto al de la sesión activa -> al login
  if (to.meta.rol === "administrador" && auth.rol !== "administrador") return { name: "login" };
  if (to.meta.rol === "guardia" && auth.rol !== "guardia") return { name: "login" };
  if (to.meta.rol === "usuario" && !auth.esUsuarioComun) return { name: "login" };

  // Si ya hay sesión activa y trata de entrar a login/registro -> a su panel
  if ((to.name === "login" || to.name === "registro") && auth.estaLogueado) {
    if (auth.rol === "administrador") return { name: "admin" };
    if (auth.rol === "guardia") return { name: "guardia" };
    return { name: "usuario" };
  }
});

export default router;
