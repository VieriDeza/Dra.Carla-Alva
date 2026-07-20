// ===== CONFIG =====
const WHATSAPP_NUMBER = "51900000000"; // Reemplazar con el número real de la clínica
const STORAGE_KEY = "controlDentalCarlaAlva";

// ===== MENÚ MÓVIL =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== FORMULARIO: AGENDAR CITA =====
document.getElementById("formCita").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const ciudad = document.getElementById("ciudad").value;
  const tratamiento = document.getElementById("tratamiento").value;
  const fecha = document.getElementById("fecha").value;
  const turno = document.getElementById("turno").value;

  const mensaje =
`Hola, quisiera agendar una cita:
Nombre: ${nombre}
Teléfono: ${telefono}
Ciudad: ${ciudad}
Tratamiento: ${tratamiento}
Fecha deseada: ${fecha}
Turno: ${turno}

Quedo atento(a) a la confirmación de disponibilidad y horario.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

// ===== SECCIÓN "YA FUI ATENDIDO" =====

// Calcula y muestra el control a partir de una fecha de atención (string yyyy-mm-dd)
function calcularYMostrarControl(fechaAtencionStr) {
  const fechaAtencion = new Date(fechaAtencionStr + "T00:00:00");
  const proximoControl = new Date(fechaAtencion);
  proximoControl.setDate(proximoControl.getDate() + 30);

  mostrarResultado(proximoControl);

  // Guardar en localStorage para persistencia
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    fechaAtencion: fechaAtencionStr,
    proximoControl: proximoControl.toISOString().split("T")[0]
  }));
}

// Pinta la tarjeta de resultado (fecha, anillo de días, link a Google Calendar)
function mostrarResultado(proximoControl) {
  const fechaTexto = proximoControl.toLocaleDateString("es-PE", {
    year: "numeric", month: "long", day: "numeric"
  });
  document.getElementById("fechaProximoControl").textContent = fechaTexto;

  // Días restantes desde hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diffMs = proximoControl - hoy;
  const diasFaltan = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  document.getElementById("diasFaltantes").textContent = diasFaltan >= 0 ? diasFaltan : 0;

  // Anillo de progreso (30 días es el total del ciclo)
  const porcentaje = Math.max(0, Math.min(100, (diasFaltan / 30) * 100));
  const grados = (porcentaje / 100) * 360;
  document.getElementById("controlRing").style.background =
    `conic-gradient(var(--morado) ${grados}deg, var(--fondo-rosa) ${grados}deg)`;

  // Link a Google Calendar con el evento pre-completado
  document.getElementById("btnGoogleCalendar").href = generarLinkGoogleCalendar(proximoControl);

  document.getElementById("resultadoControl").classList.remove("hidden");
}

// Genera la URL de Google Calendar con el evento ya completado
function generarLinkGoogleCalendar(fecha) {
  // Evento de todo el día: formato YYYYMMDD/YYYYMMDD (día siguiente)
  const inicio = new Date(fecha);
  const fin = new Date(fecha);
  fin.setDate(fin.getDate() + 1);

  const formatFecha = (d) => d.toISOString().split("T")[0].replace(/-/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Control de ortodoncia – Dra. Carla Alva",
    dates: `${formatFecha(inicio)}/${formatFecha(fin)}`,
    details: "Control recomendado cada 30 días.",
    location: "Consultorio Dra. Carla Alva"
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Envío del formulario de control
document.getElementById("formControl").addEventListener("submit", function (e) {
  e.preventDefault();
  const fechaAtencion = document.getElementById("fechaAtencion").value;
  calcularYMostrarControl(fechaAtencion);
});

// Eliminar recordatorio guardado
document.getElementById("btnEliminarRecordatorio").addEventListener("click", function () {
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("resultadoControl").classList.add("hidden");
  document.getElementById("formControl").reset();
});

// ===== CARGA AUTOMÁTICA AL ABRIR LA PÁGINA =====
// Si el paciente ya registró un control antes, se muestra automáticamente
window.addEventListener("DOMContentLoaded", () => {
  const datosGuardados = localStorage.getItem(STORAGE_KEY);
  if (datosGuardados) {
    const { fechaAtencion, proximoControl } = JSON.parse(datosGuardados);
    document.getElementById("fechaAtencion").value = fechaAtencion;
    mostrarResultado(new Date(proximoControl + "T00:00:00"));
  }
});
