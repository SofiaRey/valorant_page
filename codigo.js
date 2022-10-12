const endpointAgentes =
  "https://valorant-api.com/v1/agents?language=es-MX&isPlayableCharacter=true";
let agentes;
const selectAgente = document.querySelector("#agentes-select");
// --------------- Navbar item activo ---------------
const navItems = document.querySelectorAll(".nav-item");
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", function () {
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
      selectAgente.innerHTML += `
      <option value='${e.displayName}'>${e.displayName}</option>
      `;
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

// --------------- Generar equipamiento ---------------

const selectMapa = document.querySelector("#mapa-select");
const generarEquipBoton = document.querySelector("#generar-equip-boton");
const inputDinero = document.querySelector("#input-dinero");
const contenedorEquipamiento = document.querySelector(
  ".contenedor-equip-borde"
);
const contenedorEquipamientoGenerado = document.querySelector(
  ".contenedor-equipamiento-generado"
);
let mapas;

generarEquipBoton.addEventListener("click", () => {
  if (validarDinero()) {
    contenedorEquipamiento.classList.add("contenedor-equip-visible");
    contenedorEquipamientoGenerado.innerHTML = "";

    equipamientoGen = generarEquipamiento(
      parseInt(inputDinero.value),
      agentes.find((agente) => agente.displayName == selectAgente.value),
      "mapa"
    );

    if (equipamientoGen["armaPrincipal"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["armaPrincipal"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["armaPrincipal"].nombre}</h5>
        </div>
        <h3>+</h3>
      `;
    }
    if (equipamientoGen["armaSecundaria"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["armaSecundaria"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["armaSecundaria"].nombre}</h5>
        </div>
        <h3>+</h3>
    `;
    }
    if (equipamientoGen["escudo"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["escudo"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["escudo"].nombre}</h5>
        </div>
        <h3>+</h3>
    `;
    }
    contenedorEquipamientoGenerado.innerHTML += `
      <div>
        <h2>${equipamientoGen["habilidades"]}<h2/>
        <h6>Habilidades</h6>
      <div/>
    `;
  }
});

fetch("https://valorant-api.com/v1/maps?language=es-MX")
  .then((response) => {
    return response.json();
  })
  .then((body) => {
    mapas = body.data;

    mapas.map(
      (e) =>
        (selectMapa.innerHTML += `
      <option value='${e.displayName}'>${e.displayName}</option>
      `)
    );
  });

function validarDinero() {
  const error = document.querySelector(".input-error");
  let esValido = false;

  error.innerHTML = "";
  if (inputDinero.value.length == 0) {
    error.innerHTML = "Complete el campo";
  } else if (isNaN(inputDinero.value)) {
    error.innerHTML = "Ingrese un número";
  } else if (inputDinero.value > 9000) {
    error.innerHTML = "Máximo 9000";
  } else if (inputDinero.value < 0) {
    error.innerHTML = "Mínimo 0";
  } else {
    esValido = true;
  }

  if (esValido) {
    error.classList.remove("input-error-visible");
  } else {
    error.classList.add("input-error-visible");
  }
  return esValido;
}

// Obtener escudos
let escudos;
fetch("https://valorant-api.com/v1/gear?language=es-MX")
  .then((res) => {
    return res.json();
  })
  .then((body) => {
    escudos = body.data;
  });

// Obtener armas
let armas;
fetch("https://valorant-api.com/v1/weapons?language=es-MX")
  .then((res) => {
    return res.json();
  })
  .then((body) => {
    armas = body.data;
  });

// Prioridad: agente > mapa > rol

function generarEquipamiento(dinero, agente, mapa) {
  const armaDefecto = armas.find((arma) => arma.displayName == "Classic");
  let equipamiento = {
    armaPrincipal: null,
    armaSecundaria: {
      imagen: armaDefecto.displayIcon,
      nombre: armaDefecto.displayName,
      precio: armaDefecto.shopData.cost,
    },
    escudo: null,
    habilidades: null, // Las habilidades consisten en el dinero restante
  };

  function comprar(tipoArticulo, articulo) {
    console.log("Articulo a comprar:");
    console.log(articulo);
    let dineroDisp = dinero;

    // En caso de que este sobreescribiendo y alcance el dinero con el reembolso para comprar
    if (
      equipamiento[tipoArticulo] != null &&
      dinero + equipamiento[tipoArticulo].precio >= articulo.shopData.cost
    ) {
      dineroDisp = dinero + equipamiento[tipoArticulo].precio;
    }
    if (dineroDisp < articulo.shopData.cost) return;

    dinero = dineroDisp;

    equipamiento[tipoArticulo] = {
      imagen: articulo.displayIcon,
      nombre: articulo.displayName,
      precio: articulo.shopData.cost,
    };

    // Se descuenta del dinero total el articulo que se sumo al equipamiento
    dinero -= parseInt(equipamiento[tipoArticulo].precio);
  }

  // Existen cuatro grados de equipamiento en función del dinero
  if (dinero <= 800) {
    switch (agente.role.displayName) {
      case "Iniciador":
        comprar("escudo", escudos[1]);
        break;
      case "Centinela":
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Ghost")
        );
        break;
      case "Duelista":
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Frenzy")
        );
        break;
      case "Controlador":
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Shorty")
        );
        break;
    }

    if (agente.displayName == "Chamber") {
      comprar(
        "armaSecundaria",
        armas.find((arma) => arma.displayName == "Sheriff")
      );
    }
  } else if (dinero > 800 && dinero < 3000) {
    console.log('entre 800 y 3000')
  } else if (3000 < dinero && dinero < 6000) {
    console.log('entre 3000 y 6000')
  } else if (dinero >= 6000) {
    console.log('mas de 6000')
    comprar("escudo", escudos[0]);

    comprar(
      "armaPrincipal",
      armas.find((arma) => arma.displayName == "Vandal")
    );

    if (agente.displayName == "Chamber" || agente.displayName == "Jett") {
      comprar(
        "armaPrincipal",
        armas.find((arma) => arma.displayName == "Operator")
      );
    }
  }

  console.log("Equipamiento final:");
  equipamiento["habilidades"] = dinero;
  console.log(equipamiento);
  return equipamiento;
}

// plata < 800

// Chamber sherif
// Controladores shorty
// Duelistas frenzy
// Iniciadores escudo ligero + classic
// Centinelas ghost + escudo
// Icebox classic

// 800 < plata < 3000

// Escudo pesado
// Chamber Marshal
// Brimstone judge
// Duelistas y Controladores sherif
// Centinelas Guardian
// Iniciadores Bulldog y escudo ligero
// Heaven, Bind escudo ligero

// 3000 < plata > 5000

// Raze Phantom
// Menos por Raze, todos Vandal
// Breach Ascent Odin
// Todos escudo pesado
// Pearl y Fracture todos Phantom

// plata > 5000

// Chamber sherif y operator
// Todos escudo pesado
// Jett Icebox operator
// Viper shorty
// Bind todos frenzy
