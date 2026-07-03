/* =========================================================================
   Funciones puras de validación y formato, usadas por varias vistas.
   ========================================================================= */

export function validarCorreoInstitucional(correo) {
  return /^[a-zA-Z0-9._%+-]+@uleam\.edu\.ec$/i.test(correo.trim());
}

export function validarPlaca(placa) {
  return /^[A-Za-z]{3}-?\d{3,4}$/.test(placa.trim());
}

export function validarTelefono(tel) {
  const soloDigitos = tel.replace(/\D/g, "");
  return soloDigitos.length >= 7 && soloDigitos.length <= 10;
}

export function generarId(prefijo) {
  return prefijo + "-" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

export function generarCodigoReserva() {
  const año = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RES-${año}-${random}`;
}

export function formatearFechaHora(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC") + " " + d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
}

export function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export function toMinutos(horaStr) {
  const [h, m] = horaStr.split(":").map(Number);
  return h * 60 + m;
}

export function nombreSeccion(sec) {
  return { A: "Docentes", B: "Estudiantes", C: "Administrativos" }[sec] || sec;
}
