const endpointAgentes =
  "https://valorant-api.com/v1/agents?language=es-MX&isPlayableCharacter=true";
let agentes;

// --------------- Navbar item activo ---------------
const navItems = document.querySelectorAll(".nav-item");
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", function() {
    var actual = document.getElementsByClassName("nav-activa");
    actual[0].className = actual[0].className.replace(" nav-activa", "");
    this.className += " nav-activa";
  });
}

// --------------- Cambiar entre modos de Exploración ---------------
const selectorModo = document.querySelector("#explorar-modo");

selectorModo.addEventListener("change", () => {
  cambiarModoExploracion();
});

function cambiarModoExploracion() {
  const contenedoresExplorar = document.querySelectorAll(".explorar-contenido");
  contenedoresExplorar.forEach((aspecto) => {
    aspecto.classList.remove("explorar-activo");
  });

  switch (selectorModo.selectedIndex) {
    case 0:
      document
        .getElementById("explorar-aspecto")
        .classList.add("explorar-activo");
      break;
    case 1:
      document.getElementById("explorar-rol").classList.add("explorar-activo");
      break;
    case 2:
      document
        .getElementById("explorar-nombre")
        .classList.add("explorar-activo");
      break;
  }
}
// --------------- Explorar por aspecto ---------------

let contenedorAspecto = document.querySelector(".contenedor-aspecto");
let contenedorAgente = document.querySelector(".contenedor-info-agente");
let contenedorHabilidades = document.querySelector(".contenedor-habilidades");

fetch(endpointAgentes)
  .then((response) => {
    return response.json();
  })
  .then((body) => {
    agentes = body.data;
    mostrarInfoAgenteRoles(roles[0].id);

    agentes.map((e) => {
      contenedorAspecto.innerHTML += `
        <div id="${e.uuid}" class="borde-aspecto">
          <img onclick="mostrarInfoAgente('${e.uuid}')" src="${e.displayIconSmall}" />
        <div/>
        `;
    });
    mostrarInfoAgente(agentes[0].uuid);
  });

function mostrarInfoAgente(id) {
  const aspectos = document.querySelectorAll(".borde-aspecto");
  aspectos.forEach((aspecto) => {
    aspecto.classList.remove("aspecto-activo");
  });

  document.getElementById(id).classList.add("aspecto-activo");

  fetch(
    `https://valorant-api.com/v1/agents/${id}?language=es-MX&isPlayableCharacter=true`
  )
    .then((response) => {
      return response.json();
    })
    .then((body) => {
      const agente = body.data;
      document.querySelector(".contenedor-info-agente > div > img").src =
        agente.fullPortrait;
      document.querySelector(
        ".contenedor-info-agente > article > h3"
      ).innerHTML = agente.displayName;
      document.getElementById("etiqueta-rol").innerText =
        agente.role.displayName;
      document.getElementById("descripcion-agente").innerText =
        agente.description;
      generarHabilidades(agente.abilities);
    })
    .catch((e) => console.log(e));
}

function generarHabilidades(habilidades) {
  contenedorHabilidades.innerHTML = ` 
        ${habilidades
          .map((habilidad) => {
            if (habilidad.displayIcon)
              return `<div onclick="generarInfoHabilidad('${habilidad.displayName}', '${habilidad.description}', '${habilidad.slot}')" class="contenedor-habilidad" id="${habilidad.slot}">
              <img src="${habilidad.displayIcon}" alt="Habilidad ${habilidad.displayName}" />
              </div>
              `;
          })
          .join("")}
    `;
}

function generarInfoHabilidad(nombre, descripcion, numero) {
  const habilidades = document.querySelectorAll(".contenedor-habilidad");
  habilidades.forEach((habilidad) => {
    habilidad.classList.remove("habilidad-activa");
  });

  document.getElementById(numero).classList.add("habilidad-activa");

  document.querySelector(".contenedor-habilidad-info > h6").innerHTML = nombre;
  document.querySelector(".contenedor-habilidad-info > p").innerHTML =
    descripcion;
}

// --------------- Explorar por rol ---------------

const roles = [
  {
    nombre: "Iniciadores",
    id: "1b47567f-8f7b-444b-aae3-b0c634622d10",
  },
  {
    nombre: "Centinelas",
    id: "5fc02f99-4091-4486-a531-98459a3e95e9",
  },
  {
    nombre: "Controladores",
    id: "4ee40330-ecdd-4f2f-98a8-eb1243428373",
  },
  {
    nombre: "Duelistas",
    id: "dbe8757e-9e92-4ed4-b39f-9dfc589691d4",
  },
];
const contenedorRoles = document.querySelector(".contenedor-roles");
const contenedorAgentesRol = document.querySelector(".contenedor-agentes-rol");

roles.map((rol) => {
  contenedorRoles.innerHTML += `<div onclick="mostrarInfoAgenteRoles('${rol.id}')" class="boton-rol" id="${rol.id}"><p>${rol.nombre}</p></div>`;
});

function mostrarInfoAgenteRoles(id) {
  const rolesBotones = document.querySelectorAll(".boton-rol");
  rolesBotones.forEach((rol) => {
    rol.classList.remove("rol-activo");
  });

  document.getElementById(id).classList.add("rol-activo");
  contenedorAgentesRol.innerHTML = "";

  agentes.map((agente) => {
    if (agente.role.uuid == id)
      contenedorAgentesRol.innerHTML += `
            <div class="contenedor-agente-rol" id="${agente.uuid}rol">
              <img src="${agente.fullPortrait}" alt="Imagen de agente completo" />
              <h4>${agente.displayName}</h4>
            </div>`;
  });
}

// --------------- Explorar por Nombre ---------------
// const input = document.querySelector("#buscar-nombre");

// input.addEventListener("input", (e) => {
//   const text = event.target.value.trim();

//   let agentesFiltrados = filtrarPorNombre(text, data);
//   console.log(agentesFiltrados);
// });

// --------------- Generar Aleatorios ---------------

let cantJugadores = 1;
const cantJugadoresSelect = document.querySelector("#cantidad-jugadores");
const generarAleatoriosBoton = document.querySelector(
  "#generar-aleatorios-boton"
);
const contenedorAleatorios = document.querySelector(".contenedor-aleaotorios");
const contenedorAgentesAleatorios = document.querySelector(
  ".contenedor-agentes-aleatorios"
);

cantJugadoresSelect.addEventListener(
  "input",
  () => (cantJugadores = cantJugadoresSelect.value)
);

generarAleatoriosBoton.addEventListener("click", () => {
  let agentesGenerados = [];
  let agentesMezclados = mezclarArray(agentes);
  if (cantJugadores == 1) {
    agentesGenerados = [agentesMezclados[0]];
  } else {
    const agentesPorRol = agentes.reduce((prev, act) => {
      (prev[act["role"]["displayName"]] =
        prev[act["role"]["displayName"]] || []).push(act);
      return prev;
    }, {});

    for (let i = 0; i < cantJugadores; i++) {
      agentesGenerados.push(agentesMezclados[i]);
    }
  }

  mostrarAgentesAleatorios(agentesGenerados);

  console.log(agentesGenerados);
});

const mostrarAgentesAleatorios = (agentesGenerados) => {
  contenedorAgentesAleatorios.innerHTML = "";
  agentesGenerados.map((agente) => {
    contenedorAgentesAleatorios.innerHTML += `
            <div class="contenedor-agente-aleatorio" id="${agente.uuid}rol">
              <img src="${agente.fullPortrait}" alt="Imagen de agente completo" />
              <h4>${agente.displayName}</h4>
              <h6>${agente.role.displayName}</h6>
            </div>`;
  });
};

function mezclarArray(arr) {
  let random;
  for (let actual = 0; actual < arr.length; actual++) {
    random = Math.floor(Math.random() * actual);
    let temp = arr[actual];
    arr[actual] = arr[random];
    arr[random] = temp;
  }
  return arr;
}
