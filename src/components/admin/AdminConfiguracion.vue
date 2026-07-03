<template>
  <div class="page-head">
    <h2>Configuración del Sistema</h2>
    <p class="muted">Horarios y parámetros generales.</p>
  </div>

  <div class="card card-form">
    <form novalidate @submit.prevent="onSubmit">
      <div class="grid-2">
        <div>
          <label for="cfgApertura">Apertura</label>
          <input type="time" id="cfgApertura" v-model="form.apertura">
        </div>
        <div>
          <label for="cfgCierre">Cierre</label>
          <input type="time" id="cfgCierre" v-model="form.cierre">
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label for="cfgMaxHoras">Tiempo máximo de reserva (horas)</label>
          <input type="number" id="cfgMaxHoras" v-model.number="form.maxHoras" min="1" max="12">
          <span class="error-msg">{{ errores.maxHoras }}</span>
        </div>
        <div>
          <label for="cfgTolerancia">Tolerancia sin ingresar (minutos)</label>
          <input type="number" id="cfgTolerancia" v-model.number="form.tolerancia" min="0" max="120">
          <span class="error-msg">{{ errores.tolerancia }}</span>
        </div>
      </div>

      <div class="form-msg" :class="mensajeTipo">{{ mensaje }}</div>
      <button type="submit" class="btn btn-primary">Guardar horarios</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useConfigStore } from "../../stores/configStore";

const configStore = useConfigStore();

// Copia editable de la configuración; solo se guarda en el store al enviar el formulario
const form = reactive({ ...configStore.config });
const errores = reactive({ maxHoras: "", tolerancia: "" });
const mensaje = ref("");
const mensajeTipo = ref("");

function onSubmit() {
  errores.maxHoras = "";
  errores.tolerancia = "";
  mensaje.value = "";

  let valido = true;
  if (!(form.maxHoras >= 1 && form.maxHoras <= 12)) { errores.maxHoras = "Debe estar entre 1 y 12."; valido = false; }
  if (!(form.tolerancia >= 0 && form.tolerancia <= 120)) { errores.tolerancia = "Debe estar entre 0 y 120."; valido = false; }
  if (form.cierre <= form.apertura) { mensaje.value = "La hora de cierre debe ser mayor a la de apertura."; mensajeTipo.value = "error"; valido = false; }
  if (!valido) return;

  configStore.guardar({ ...form });
  mensaje.value = "Horarios guardados correctamente.";
  mensajeTipo.value = "ok";
}
</script>
