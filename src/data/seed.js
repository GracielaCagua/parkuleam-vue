/* =========================================================================
   Datos iniciales del sistema (solo se usan la primera vez que se abre
   la app, cuando localStorage todavía está vacío).
   ========================================================================= */

export const seedUsuarios = [
  {
    id: "u-admin",
    nombres: "Graciela Cagua",
    correo: "admin@uleam.edu.ec",
    password: "admin123",
    rol: "administrador",
    carrera: "Dirección de TI",
    placa: "",
    marca: "",
    color: "",
    telefono: "0999999999",
    estado: "activo",
    fechaRegistro: new Date().toISOString()
  },
  {
    id: "u-guardia",
    nombres: "Carlos Vera",
    correo: "guardia@uleam.edu.ec",
    password: "guardia123",
    rol: "guardia",
    carrera: "Seguridad",
    placa: "",
    marca: "",
    color: "",
    telefono: "0988888888",
    estado: "activo",
    fechaRegistro: new Date().toISOString()
  }
];

function generarPuestos() {
  const secciones = [
    { seccion: "A", cantidad: 8 },
    { seccion: "B", cantidad: 8 },
    { seccion: "C", cantidad: 8 }
  ];
  const puestos = [];
  secciones.forEach(sec => {
    for (let i = 1; i <= sec.cantidad; i++) {
      const num = String(i).padStart(2, "0");
      puestos.push({
        codigo: `${sec.seccion}-${num}`,
        seccion: sec.seccion,
        estado: "libre", // libre | reservado | ocupado
        reservadoPor: null
      });
    }
  });
  return puestos;
}

export const seedPuestos = generarPuestos();

export const seedConfig = {
  apertura: "06:00",
  cierre: "20:00",
  maxHoras: 8,
  tolerancia: 15
};
