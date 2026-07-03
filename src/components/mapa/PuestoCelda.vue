<template>
  <div
    class="puesto"
    :class="[puesto.estado, { clickable: clickable && puesto.estado === 'libre', selected }]"
    @click="onClick"
  >
    {{ puesto.codigo }}
  </div>
</template>

<script setup>
const props = defineProps({
  puesto: { type: Object, required: true },
  clickable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false }
});

const emit = defineEmits(["seleccionar"]);

function onClick() {
  if (props.clickable && props.puesto.estado === "libre") {
    emit("seleccionar", props.puesto.codigo);
  }
}
</script>
