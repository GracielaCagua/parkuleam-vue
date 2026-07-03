import { defineStore } from "pinia";
import { useUsersStore } from "./usersStore";

const LS_SESION = "parkuleam_sesion";

function cargarSesion() {
  const data = localStorage.getItem(LS_SESION);
  return data ? JSON.parse(data) : null;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    usuario: cargarSesion()
  }),

  getters: {
    estaLogueado: (state) => !!state.usuario,
    rol: (state) => state.usuario?.rol || null,
    esUsuarioComun: (state) => ["estudiante", "docente", "administrativo"].includes(state.usuario?.rol)
  },

  actions: {
    login(correo, password) {
      const usersStore = useUsersStore();
      const encontrado = usersStore.usuarios.find(
        u => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password
      );

      if (!encontrado) return { ok: false, mensaje: "Correo o contraseña incorrectos." };
      if (encontrado.estado === "pendiente") return { ok: false, mensaje: "Tu solicitud todavía está pendiente de aprobación por el administrador." };
      if (encontrado.estado === "rechazado") return { ok: false, mensaje: "Tu solicitud fue rechazada. Contacta al administrador." };
      if (encontrado.estado === "inactivo") return { ok: false, mensaje: "Tu cuenta está desactivada. Contacta al administrador." };

      this.usuario = encontrado;
      localStorage.setItem(LS_SESION, JSON.stringify(encontrado));
      return { ok: true };
    },

    logout() {
      this.usuario = null;
      localStorage.removeItem(LS_SESION);
    },

    // Se llama cuando el usuario edita su perfil, para que la sesión refleje los cambios
    actualizarSesion(datos) {
      this.usuario = { ...this.usuario, ...datos };
      localStorage.setItem(LS_SESION, JSON.stringify(this.usuario));
    },

    // Revisa que la sesión guardada siga siendo válida (por si el admin la desactivó)
    revalidar() {
      if (!this.usuario) return;
      const usersStore = useUsersStore();
      const actual = usersStore.buscarPorId(this.usuario.id);
      if (!actual || actual.estado !== "activo") {
        this.logout();
      } else {
        this.usuario = actual;
      }
    }
  }
});
