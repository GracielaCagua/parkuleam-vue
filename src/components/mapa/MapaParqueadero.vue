<!--
  Mapa del parqueadero por secciones. Es reactivo: como lee directo de
  spotsStore, apenas un puesto cambia de estado (por una reserva o una
  validación del guardia) este componente se repinta solo, sin recargar
  la página ni volver a llamarlo manualmente.
-->
<template>
  <div class="mapa-secciones">
    <div v-for="sec in secciones" :key="sec" class="seccion-card">
      <h4>
        Sección {{ sec }} — {{ nombreSeccion(sec) }}
        <span class="muted">{{ spotsStore.porSeccion(sec).length }} puestos</span>
      </h4>

      <div :class="mini ? 'puestos-mini-grid' : 'puestos-grid'">
        <PuestoCelda
          v-for="p in spotsStore.porSeccion(sec)"
          :key="p.codigo"
          :puesto="p"
          :clickable="clickable"
          :selected="p.codigo === seleccionado"
          @seleccionar="emit('seleccionar', $event)"
        />
      </div>

      <div class="leyenda">
        <span><i style="background:var(--green)"></i>Libre</span>
        <span><i style="background:var(--yellow)"></i>Reservado</span>
        <span><i style="background:var(--red)"></i>Ocupado</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSpotsStore } from "../../stores/spotsStore";
import { nombreSeccion } from "../../utils/validaciones";
import PuestoCelda from "./PuestoCelda.vue";

const props = defineProps({
  clickable: { type: Boolean, default: false },   // si se puede tocar un puesto libre
  seccionFiltro: { type: String, default: null },  // mostrar solo una sección (A, B o C)
  seleccionado: { type: String, default: null },   // código del puesto marcado como elegido
  mini: { type: Boolean, default: false }          // grilla compacta (usada en el formulario de reservar)
});

const emit = defineEmits(["seleccionar"]);

const spotsStore = useSpotsStore();

const secciones = computed(() => {
  const todas = ["A", "B", "C"];
  return props.seccionFiltro ? todas.filter(s => s === props.seccionFiltro) : todas;
});
</script>
