let palabras = [];
let actual = null;
let categoriaActual = "todas";
let aprendidas = JSON.parse(localStorage.getItem("aprendidas")) || [];
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

function palabrasDisponibles() {
  // Solo las de la categoría actual y que no estén aprendidas
  return palabras.filter(p => 
    (categoriaActual === "todas" || p.category === categoriaActual) &&
    !aprendidas.includes(p.english)
  );
}

// =============================
// MOSTRAR NUEVA PALABRA
// =============================

function nuevaPalabra() {
  const disponibles = palabrasDisponibles();

  if (disponibles.length === 0) {
    document.getElementById("word").innerText = "¡Has aprendido todas las palabras!";
    document.getElementById("meaning").innerText = "";
    actual = null;
    return;
  }

  // Elegir aleatoria
  const index = Math.floor(Math.random() * disponibles.length);
  actual = disponibles[index];

  document.getElementById("word").innerText = actual.english;
  document.getElementById("meaning").innerText = "";
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
  nuevaPalabra();
  actualizarContador();
}

function resetearProgreso() {
  if (confirm("¿Seguro que quieres reiniciar todo tu progreso?")) {
    localStorage.removeItem("aprendidas");
    aprendidas = [];
    nuevaPalabra();
    actualizarContador();
  }
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
    if (!actual) return;

      // Marcar como aprendida
      aprendidas.push(actual.english);
      localStorage.setItem("aprendidas", JSON.stringify(aprendidas));

      nuevaPalabra();
    actualizarContador();
}

function noLaSe() {
  nuevaPalabra();
}

function actualizarContador() {
  const total = palabras.filter(p => categoriaActual === "todas" || p.category === categoriaActual).length;
  const aprendidasCat = aprendidas.filter(p => palabras.some(word => word.english === p && (categoriaActual === "todas" || word.category === categoriaActual))).length;

  document.getElementById("progress").innerText = `Palabras aprendidas: ${aprendidasCat} / ${total}`;
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
