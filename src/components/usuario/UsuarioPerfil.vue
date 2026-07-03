<template>
  <div class="page-head">
    <h2>Mi Perfil</h2>
    <p class="muted">Datos personales y de tu vehículo.</p>
  </div>

  <div class="grid-2-cards">
    <div class="card card-form">
      <h3>Datos personales</h3>
      <form novalidate @submit.prevent="onSubmitDatos">
        <label for="perfNombres">Nombres completos</label>
        <input type="text" id="perfNombres" v-model="datos.nombres">
        <span class="error-msg">{{ erroresDatos.nombres }}</span>

        <label for="perfTelefono">Teléfono</label>
        <input type="text" id="perfTelefono" v-model="datos.telefono">
        <span class="error-msg">{{ erroresDatos.telefono }}</span>

        <label for="perfCarrera">Carrera / Departamento</label>
        <input type="text" id="perfCarrera" v-model="datos.carrera">

        <div class="form-msg" :class="mensajeDatosTipo">{{ mensajeDatos }}</div>
        <button type="submit" class="btn btn-primary">Guardar cambios</button>
      </form>
    </div>

    <div class="card card-form">
      <h3>Datos del vehículo</h3>
      <form novalidate @submit.prevent="onSubmitVehiculo">
        <label for="perfPlaca">Placa</label>
        <input type="text" id="perfPlaca" v-model="vehiculo.placa">
        <span class="error-msg">{{ erroresVehiculo.placa }}</span>

        <label for="perfMarca">Marca</label>
        <input type="text" id="perfMarca" v-model="vehiculo.marca" placeholder="Ej: Chevrolet">
        <span class="error-msg">{{ erroresVehiculo.marca }}</span>

        <label for="perfColor">Color</label>
        <input type="text" id="perfColor" v-model="vehiculo.color" placeholder="Ej: Rojo">
        <span class="error-msg">{{ erroresVehiculo.color }}</span>

        <div class="form-msg" :class="mensajeVehiculoTipo">{{ mensajeVehiculo }}</div>
        <button type="submit" class="btn btn-primary">Actualizar vehículo</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useUsersStore } from "../../stores/usersStore";
import { validarTelefono, validarPlaca } from "../../utils/validaciones";

const auth = useAuthStore();
const usersStore = useUsersStore();

const datos = reactive({
  nombres: auth.usuario.nombres,
  telefono: auth.usuario.telefono,
  carrera: auth.usuario.carrera
});
const erroresDatos = reactive({ nombres: "", telefono: "" });
const mensajeDatos = ref("");
const mensajeDatosTipo = ref("");

const vehiculo = reactive({
  placa: auth.usuario.placa || "",
  marca: auth.usuario.marca || "",
  color: auth.usuario.color || ""
});
const erroresVehiculo = reactive({ placa: "", marca: "", color: "" });
const mensajeVehiculo = ref("");
const mensajeVehiculoTipo = ref("");

function onSubmitDatos() {
  erroresDatos.nombres = ""; erroresDatos.telefono = ""; mensajeDatos.value = "";
  let valido = true;
  if (datos.nombres.trim().length < 3) { erroresDatos.nombres = "Ingresa tu nombre completo."; valido = false; }
  if (!validarTelefono(datos.telefono)) { erroresDatos.telefono = "Teléfono inválido."; valido = false; }
  if (!valido) return;

  const cambios = { nombres: datos.nombres.trim(), telefono: datos.telefono.trim(), carrera: datos.carrera.trim() };
  usersStore.actualizarDatos(auth.usuario.id, cambios);
  auth.actualizarSesion(cambios);

  mensajeDatos.value = "Datos actualizados.";
  mensajeDatosTipo.value = "ok";
}

function onSubmitVehiculo() {
  erroresVehiculo.placa = ""; erroresVehiculo.marca = ""; erroresVehiculo.color = ""; mensajeVehiculo.value = "";
  let valido = true;

  const placaMayus = vehiculo.placa.trim().toUpperCase();
  if (!validarPlaca(placaMayus)) { erroresVehiculo.placa = "Formato de placa inválido (Ej: ABC-1234)."; valido = false; }
  if (vehiculo.marca.trim().length < 2) { erroresVehiculo.marca = "Ingresa la marca del vehículo."; valido = false; }
  if (vehiculo.color.trim().length < 3) { erroresVehiculo.color = "Ingresa el color del vehículo."; valido = false; }
  if (!valido) return;

  const cambios = { placa: placaMayus, marca: vehiculo.marca.trim(), color: vehiculo.color.trim() };
  usersStore.actualizarDatos(auth.usuario.id, cambios);
  auth.actualizarSesion(cambios);

  mensajeVehiculo.value = "Vehículo actualizado.";
  mensajeVehiculoTipo.value = "ok";
}
</script>
