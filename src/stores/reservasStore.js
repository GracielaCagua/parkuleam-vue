import { defineStore } from "pinia";
import { useSpotsStore } from "./spotsStore";
import { generarId, generarCodigoReserva, hoyISO } from "../utils/validaciones";

const LS_KEY = "parkuleam_reservas";

function cargarDeLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(LS_KEY, JSON.stringify([]));
  return [];
}

export const useReservasStore = defineStore("reservas", {
  state: () => ({
    reservas: cargarDeLocalStorage()
  }),

  getters: {
    entradasHoy: (state) => state.reservas.filter(r => r.fecha === hoyISO()).slice().reverse(),
    reservaActivaDe: (state) => (userId) =>
      state.reservas.find(r => r.userId === userId && (r.estado === "reservado" || r.estado === "ocupado")),
    historialDe: (state) => (userId) =>
      state.reservas.filter(r => r.userId === userId && (r.estado === "completada" || r.estado === "cancelada")).reverse()
  },

  actions: {
    guardar() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.reservas));
    },

    crear({ userId, puesto, seccion, fecha, horaIngreso, horaSalida, placa }) {
      const spotsStore = useSpotsStore();
      const nueva = {
        id: generarId("r"),
        codigo: generarCodigoReserva(),
        userId, puesto, seccion, fecha, horaIngreso, horaSalida, placa,
        estado: "reservado",
        creadoEn: new Date().toISOString()
      };
      this.reservas.push(nueva);
      this.guardar();
      spotsStore.marcarReservado(puesto, userId);
      return nueva;
    },

    cancelar(id) {
      const spotsStore = useSpotsStore();
      const r = this.reservas.find(x => x.id === id);
      if (!r) return;
      r.estado = "cancelada";
      this.guardar();
      spotsStore.liberar(r.puesto);
    },

    buscarPorCodigo(codigo) {
      return this.reservas.find(r => r.codigo === codigo.trim().toUpperCase());
    },

    // Un mismo botón sirve para marcar ingreso o salida, según el estado actual
    validarAcceso(codigo) {
      const spotsStore = useSpotsStore();
      const r = this.buscarPorCodigo(codigo);
      if (!r) return { ok: false, mensaje: "No se encontró ninguna reserva con ese código." };

      if (r.estado === "reservado") {
        r.estado = "ocupado";
        r.horaIngresoReal = new Date().toISOString();
        spotsStore.marcarOcupado(r.puesto);
        this.guardar();
        return { ok: true, tipo: "ingreso", reserva: r, mensaje: `Ingreso confirmado — puesto ${r.puesto}.` };
      }

      if (r.estado === "ocupado") {
        r.estado = "completada";
        r.horaSalidaReal = new Date().toISOString();
        spotsStore.liberar(r.puesto);
        this.guardar();
        return { ok: true, tipo: "salida", reserva: r, mensaje: `Salida confirmada — puesto ${r.puesto} quedó libre.` };
      }

      return { ok: false, mensaje: `Ese código ya no está activo (estado: ${r.estado}).` };
    }
  }
});
