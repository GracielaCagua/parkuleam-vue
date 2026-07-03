import { defineStore } from "pinia";
import { seedConfig } from "../data/seed";

const LS_KEY = "parkuleam_config";

function cargarDeLocalStorage() {
  const data = localStorage.getItem(LS_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(LS_KEY, JSON.stringify(seedConfig));
  return seedConfig;
}

export const useConfigStore = defineStore("config", {
  state: () => ({
    config: cargarDeLocalStorage()
  }),

  actions: {
    guardar(nuevaConfig) {
      this.config = { ...this.config, ...nuevaConfig };
      localStorage.setItem(LS_KEY, JSON.stringify(this.config));
    }
  }
});
