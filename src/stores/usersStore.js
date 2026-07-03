import { defineStore } from "pinia";
import { seedUsuarios } from "../data/seed";

const LS_KEY = "parkuleam_users";

function cargarDeLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(LS_KEY, JSON.stringify(seedUsuarios));
  return seedUsuarios;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    usuarios: cargarDeLocalStorage()
  }),

  getters: {
    pendientes: (state) => state.usuarios.filter(u => u.estado === "pendiente"),
    // Usuarios registrados que no son administradores (para la tabla del admin)
    registrados: (state) => state.usuarios.filter(u => u.estado !== "pendiente" && u.rol !== "administrador"),
    totalPendientes: (state) => state.usuarios.filter(u => u.estado === "pendiente").length
  },

  actions: {
    guardar() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.usuarios));
    },

    correoYaRegistrado(correo) {
      return this.usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase());
    },

    registrarSolicitud(datos) {
      this.usuarios.push({ ...datos, estado: "pendiente", fechaRegistro: new Date().toISOString() });
      this.guardar();
    },

    aprobar(id) {
      const u = this.usuarios.find(x => x.id === id);
      if (u) { u.estado = "activo"; this.guardar(); }
    },

    rechazar(id) {
      const u = this.usuarios.find(x => x.id === id);
      if (u) { u.estado = "rechazado"; this.guardar(); }
    },

    toggleActivo(id) {
      const u = this.usuarios.find(x => x.id === id);
      if (u) { u.estado = u.estado === "activo" ? "inactivo" : "activo"; this.guardar(); }
    },

    actualizarDatos(id, cambios) {
      const u = this.usuarios.find(x => x.id === id);
      if (u) { Object.assign(u, cambios); this.guardar(); }
      return u;
    },

    buscarPorId(id) {
      return this.usuarios.find(u => u.id === id);
    }
  }
});
