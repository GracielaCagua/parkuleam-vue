import { defineStore } from "pinia";
import { seedPuestos } from "../data/seed";

const LS_KEY = "parkuleam_spots";

function cargarDeLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(LS_KEY, JSON.stringify(seedPuestos));
  return seedPuestos;
}

export const useSpotsStore = defineStore("spots", {
  state: () => ({
    puestos: cargarDeLocalStorage()
  }),

  getters: {
    // Estadísticas generales, se recalculan solas cada vez que "puestos" cambia
    stats: (state) => {
      const total = state.puestos.length;
      const libres = state.puestos.filter(p => p.estado === "libre").length;
      const reservados = state.puestos.filter(p => p.estado === "reservado").length;
      const ocupados = state.puestos.filter(p => p.estado === "ocupado").length;
      return { total, libres, reservados, ocupados };
    },
    porSeccion: (state) => (seccion) => state.puestos.filter(p => p.seccion === seccion)
  },

  actions: {
    guardar() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.puestos));
    },

    marcarReservado(codigo, userId) {
      const p = this.puestos.find(x => x.codigo === codigo);
      if (p) { p.estado = "reservado"; p.reservadoPor = userId; this.guardar(); }
    },

    marcarOcupado(codigo) {
      const p = this.puestos.find(x => x.codigo === codigo);
      if (p) { p.estado = "ocupado"; this.guardar(); }
    },

    liberar(codigo) {
      const p = this.puestos.find(x => x.codigo === codigo);
      if (p) { p.estado = "libre"; p.reservadoPor = null; this.guardar(); }
    }
  }
});
