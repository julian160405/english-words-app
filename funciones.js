let palabras = [];
let actual = null;
let categoriaActual = "todas";

// =============================
// CARGAR PALABRAS
// =============================
if (localStorage.getItem("aprendidas") && !localStorage.getItem("aprendidas").includes("[")) {
  localStorage.removeItem("aprendidas");
}

fetch("words.json")
  .then(res => res.json())
  .then(data => {

    palabras = data;

    // recuperar categoría guardada
    categoriaActual = localStorage.getItem("categoria") || "todas";

    cambiarCategoria(categoriaActual);
    nuevaPalabra();
    actualizarContador();
});

// =============================
// MOSTRAR NUEVA PALABRA
// =============================

function nuevaPalabra() {

  let aprendidas = JSON.parse(localStorage.getItem("aprendidas") || "[]");

  let filtradas = palabras;

  if (categoriaActual !== "todas") {
    filtradas = palabras.filter(p => p.category === categoriaActual);
  }

  // quitar las ya aprendidas
  filtradas = filtradas.filter(p => !aprendidas.includes(p.english));

  if (filtradas.length === 0) {
    document.getElementById("word").textContent = "¡Aprendiste todas!";
    document.getElementById("meaning").textContent = "";
    return;
  }

  actual = filtradas[Math.floor(Math.random() * filtradas.length)];

  document.getElementById("word").textContent = actual.english;
  document.getElementById("meaning").textContent = "";
}

// =============================
// MOSTRAR SIGNIFICADO
// =============================

function mostrarSignificado() {
  document.getElementById("meaning").textContent = actual.spanish;
}

// =============================
// CATEGORÍAS CON BOTONES
// =============================

function cambiarCategoria(cat) {

  categoriaActual = cat;
  localStorage.setItem("categoria", cat);

  document.querySelectorAll(".categoria").forEach(btn => {
    btn.classList.remove("bg-[#4ac7b6]", "text-black");
    btn.classList.add("bg-white/10", "text-white");
  });

  const boton = document.getElementById("cat-" + cat);

  if (boton) {
    boton.classList.remove("bg-white/10", "text-white");
    boton.classList.add("bg-[#4ac7b6]", "text-black");
  }

  nuevaPalabra();
}

// =============================
// PRONUNCIACIÓN
// =============================

function pronunciar() {

  if (!actual) return;

  const palabra = new SpeechSynthesisUtterance(actual.english);
  palabra.lang = "en-US";

  speechSynthesis.speak(palabra);
}

// =============================
// CONTADOR
// =============================

function yaLaSe() {

  let aprendidas = JSON.parse(localStorage.getItem("aprendidas")) || [];

  // evitar repetir la misma palabra
  if (!aprendidas.includes(actual.english)) {
    aprendidas.push(actual.english);
  }

  localStorage.setItem("aprendidas", JSON.stringify(aprendidas));

  actualizarContador();
  nuevaPalabra();
}

function noLaSe() {
  nuevaPalabra();
}

function actualizarContador() {

  let aprendidas = JSON.parse(localStorage.getItem("aprendidas") || "[]");

  let total = palabras.length;
  let cantidad = aprendidas.length;

  document.getElementById("progress").textContent =
    "Palabras aprendidas: " + cantidad + " / " + total;

  // porcentaje
  let porcentaje = (cantidad / total) * 100;

  document.getElementById("barraProgreso").style.width = porcentaje + "%";
}

// =============================
// MODO OSCURO / CLARO
// =============================

function cambiarModo() {

  const body = document.body;
  const card = document.getElementById("card");

  if (body.classList.contains("bg-[#040c14]")) {

    body.classList.remove("bg-[#040c14]", "text-white");
    body.classList.add("bg-gray-100", "text-black");

    card.classList.remove("bg-[#0b1723]");
    card.classList.add("bg-white");

    localStorage.setItem("modo", "claro");

  } else {

    body.classList.remove("bg-gray-100", "text-black");
    body.classList.add("bg-[#040c14]", "text-white");

    card.classList.remove("bg-white");
    card.classList.add("bg-[#0b1723]");

    localStorage.setItem("modo", "oscuro");
  }
}

// =============================
// CARGAR MODO AL ENTRAR
// =============================

window.onload = function () {

  const modoGuardado = localStorage.getItem("modo");

  if (modoGuardado === "claro") {
    cambiarModo();
  }
};