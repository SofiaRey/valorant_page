const endpointAgentes =
  "https://valorant-api.com/v1/agents?language=es-MX&isPlayableCharacter=true";
const endpointMapas = "https://valorant-api.com/v1/maps?language=es-MX";
const endpointArmas = "https://valorant-api.com/v1/weapons?language=es-MX";
const endpointEscudos = "https://valorant-api.com/v1/gear?language=es-MX";
let agentes;
let mapas;
let armas;
let escudos;
const roles = [
  {
    nombre: "Iniciadores",
    nombreApi: "Iniciador",
    id: "1b47567f-8f7b-444b-aae3-b0c634622d10",
  },
  {
    nombre: "Centinelas",
    nombreApi: "Centinela",
    id: "5fc02f99-4091-4486-a531-98459a3e95e9",
  },
  {
    nombre: "Controladores",
    nombreApi: "Controlador",
    id: "4ee40330-ecdd-4f2f-98a8-eb1243428373",
  },
  {
    nombre: "Duelistas",
    nombreApi: "Duelista",
    id: "dbe8757e-9e92-4ed4-b39f-9dfc589691d4",
  },
];

// --------------- Obtener data inicial ---------------

// --------------- Agentes
fetch(endpointAgentes)
  .then((response) => response.json())
  .then((body) => {
    agentes = body.data;

    generarBotonesAspecto();

    // Rellenar select de Generar equipamiento
    agentes.map(
      (e) =>
        (selectAgente.innerHTML += `
      <option value='${e.displayName}'>${e.displayName}</option>
      `)
    );

    // Mostrar el primer agente de la lista por defecto en todas las pestañas
    mostrarInfoAgenteRoles(roles[0].id);
    mostrarInfoAgente(agentes[0].uuid);
  });

// --------------- Mapas
fetch(endpointMapas)
  .then((response) => response.json())
  .then((body) => {
    mapas = body.data;

    // Rellenar select de Generar equipamiento
    mapas.map(
      (e) =>
        (selectMapa.innerHTML += `
      <option value='${e.displayName}'>${e.displayName}</option>
      `)
    );
  });

// --------------- Armas
fetch(endpointArmas)
  .then((res) => res.json())
  .then((body) => (armas = body.data));

// --------------- Escudos
fetch(endpointEscudos)
  .then((res) => res.json())
  .then((body) => (escudos = body.data));

// --------------- Navbar item activo ---------------
const navItems = document.querySelectorAll(".nav-item");
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", function () {
    var actual = document.getElementsByClassName("nav-activa");
    actual[0].className = actual[0].className.replace(" nav-activa", "");
    this.className += " nav-activa";
  });
}

// --------------- Cambiar entre modos de Exploración de Agentes ---------------
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
  }
}

// --------------- Explorar por aspecto ---------------
let contenedorAspecto = document.querySelector(".contenedor-aspecto");
let contenedorAgente = document.querySelector(".contenedor-info-agente");
let contenedorHabilidades = document.querySelector(".contenedor-habilidades");

function generarBotonesAspecto() {
  agentes.map((e) => {
    contenedorAspecto.innerHTML += `
      <div id="${e.uuid}" class="borde-aspecto">
        <img onclick="mostrarInfoAgente('${e.uuid}')" src="${e.displayIconSmall}" />
      <div/>
      `;
  });
}

function mostrarInfoAgente(id) {
  // Marcar aspecto seleccionado
  const aspectos = document.querySelectorAll(".borde-aspecto");
  aspectos.forEach((aspecto) => aspecto.classList.remove("aspecto-activo"));
  document.getElementById(id).classList.add("aspecto-activo");

  // Traer información de agente seleccionado
  fetch(
    `https://valorant-api.com/v1/agents/${id}?language=es-MX&isPlayableCharacter=true`
  )
    .then((response) => response.json())
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

      // Vaciar información de habilidad seleccionada previamente
      document.querySelector(".contenedor-habilidad-info > h6").innerHTML = "";
      document.querySelector(".contenedor-habilidad-info > p").innerHTML = "";

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
  // Marcar habilidad seleccionada
  const habilidades = document.querySelectorAll(".contenedor-habilidad");
  habilidades.forEach((habilidad) =>
    habilidad.classList.remove("habilidad-activa")
  );
  document.getElementById(numero).classList.add("habilidad-activa");

  // Rellenar información
  document.querySelector(".contenedor-habilidad-info > h6").innerHTML = nombre;
  document.querySelector(".contenedor-habilidad-info > p").innerHTML =
    descripcion;
}

// --------------- Explorar por rol ---------------
const contenedorRoles = document.querySelector(".contenedor-roles");
const contenedorAgentesRol = document.querySelector(".contenedor-agentes-rol");

// Generar botones de roles
roles.map((rol) => {
  contenedorRoles.innerHTML += `<div onclick="mostrarInfoAgenteRoles('${rol.id}')" class="boton-rol" id="${rol.id}"><p>${rol.nombre}</p></div>`;
});

function mostrarInfoAgenteRoles(id) {
  // Marcar rol seleccionado
  const rolesBotones = document.querySelectorAll(".boton-rol");
  rolesBotones.forEach((rol) => rol.classList.remove("rol-activo"));
  document.getElementById(id).classList.add("rol-activo");

  contenedorAgentesRol.innerHTML = "";

  // Mostrar agentes que coincidan con rol seleccionado
  agentes.map((agente) => {
    if (agente.role.uuid == id)
      contenedorAgentesRol.innerHTML += `
            <div class="contenedor-agente-rol" id="${agente.uuid}rol">
              <img src="${agente.fullPortrait}" alt="Imagen de agente completo" />
              <h4>${agente.displayName}</h4>
            </div>`;
  });
}

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

generarAleatoriosBoton.addEventListener("click", () => {
  cantJugadores = cantJugadoresSelect.value;
  let agentesGenerados = [];

  if (cantJugadores == 1) {
    // Usar un agente random cualquiera
    agentesGenerados = [mezclarArray(agentes)[0]];
  } else {
    // Randomizar los nombres de los roles
    let rolesRandom = mezclarArray(roles.map((rol) => rol.nombreApi));

    // Organizar los agentes segun los 4 roles
    const agentesPorRol = agentes.reduce((prev, act) => {
      // A la array ya generada del rol actual (`prev["rolActual"]`), se la iguala a sí misma si existe
      // Si no, iniciar una array nueva
      // A la array resultante pushearle agente actual

      // Simplificación ilustrativa:
      // prev = {} // Valor inicial del `.reduce()`
      // prev["rolActual"] = prev["rolActual"] != null ? prev["rolActual"] : []
      // prev["rolActual"].push(agenteActual)
      (prev[act["role"]["displayName"]] =
        prev[act["role"]["displayName"]] ?? []).push(act);
      return prev;
    }, {});

    // Generar un agente random sin repetir el rol por cada jugador
    for (let i = 0; i < cantJugadores; i++) {
      if (i == 4) {
        // Solo hay 4 roles, pero pueden ser 5 jugadores. El rol duplicado más recomendado es duelista.
        agentesGenerados.push(agentesPorRol["Duelista"][0]);
      } else {
        // Index random dentro de la cantidad de agentes del rol que hay
        let indexRandom = Math.floor(
          Math.random() * agentesPorRol[rolesRandom[i]].length
        );
        agentesGenerados.push(agentesPorRol[rolesRandom[i]][indexRandom]);

        // Remover agente usado para que no se repita
        agentesPorRol[rolesRandom[i]].splice(indexRandom, 1);
      }
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

function mezclarArray(array) {
  let random;
  for (let actual = 0; actual < array.length; actual++) {
    random = Math.floor(Math.random() * actual);
    let temp = array[actual];
    array[actual] = array[random];
    array[random] = temp;
  }
  return array;
}

// --------------- Generar equipamiento ---------------
const selectAgente = document.querySelector("#agentes-select");
const selectMapa = document.querySelector("#mapa-select");
const generarEquipBoton = document.querySelector("#generar-equip-boton");
const inputDinero = document.querySelector("#input-dinero");
const contenedorEquipamiento = document.querySelector(
  ".contenedor-equip-borde"
);
const contenedorEquipamientoGenerado = document.querySelector(
  ".contenedor-equipamiento-generado"
);

generarEquipBoton.addEventListener("click", () => {
  // Validar input de dinero
  if (validarDinero()) {
    contenedorEquipamiento.classList.add("contenedor-equip-visible");
    contenedorEquipamientoGenerado.innerHTML = "";

    // Resumen de parametros: dinero, agente seleccionado, mapa seleccionado
    equipamientoGen = generarEquipamiento(
      parseInt(inputDinero.value),
      agentes.find((agente) => agente.displayName == selectAgente.value),
      mapas.find((mapa) => mapa.displayName == selectMapa.value)
    );

    // --------------- Mostrar equipamiento generado
    // Arma Principal
    if (equipamientoGen["armaPrincipal"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["armaPrincipal"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["armaPrincipal"].nombre}</h5>
        </div>
        <h3>+</h3>
      `;
    }
    // Arma Secundaria
    if (equipamientoGen["armaSecundaria"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["armaSecundaria"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["armaSecundaria"].nombre}</h5>
        </div>
        <h3>+</h3>
    `;
    }
    // Escudo
    if (equipamientoGen["escudo"] != null) {
      contenedorEquipamientoGenerado.innerHTML += `
        <div>
          <img src="${equipamientoGen["escudo"].imagen}" alt="Arma principal">
          <h5>${equipamientoGen["escudo"].nombre}</h5>
        </div>
        <h3>+</h3>
    `;
    }
    // Habilidades (va siempre, porque es el dinero restante)
    contenedorEquipamientoGenerado.innerHTML += `
      <div>
        <h2>${equipamientoGen["habilidades"]}<h2/>
        <h6>Habilidades</h6>
      <div/>
    `;
  }
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
    habilidades: null, // Lo destinado para habilidades consiste en el dinero restante
  };

  function comprar(tipoArticulo, articulo) {
    // tipoArticulo: armaPrimaria, armaSecundaria, escudo

    let dineroDisp = dinero;

    // En caso de que este sobreescribiendo y alcance el dinero con el reembolso para comprar
    if (
      equipamiento[tipoArticulo] != null &&
      dinero + equipamiento[tipoArticulo].precio >= articulo.shopData.cost
    ) {
      // Efectuar reembolso
      dineroDisp = dinero + equipamiento[tipoArticulo].precio;
    }

    if (dineroDisp < articulo.shopData.cost) return;

    dinero = dineroDisp;

    // Rellenar o sobreescribir el tipo de equipamiento
    equipamiento[tipoArticulo] = {
      imagen: articulo.displayIcon,
      nombre: articulo.displayName,
      precio: articulo.shopData.cost,
    };

    // Se descuenta del dinero total el articulo que se sumo al equipamiento
    dinero -= parseInt(equipamiento[tipoArticulo].precio);
  }

  // Existen cuatro grados de equipamiento en función del dinero

  // Dado a que las franjas son amplias, muchas veces se llama a comprar con el mismo tipo mas de una vez,
  // ya que si no puede pagar cierto arma, quizá otro si, por lo que se van sobreesribiendo y 
  // mejorando hasta es posible

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
    comprar("escudo", escudos[1]);
    if (mapa.displayName != "Heaven" || mapa.displayName != "Bind")
      comprar("escudo", escudos[0]);
    switch (agente.role.displayName) {
      case "Iniciador":
        comprar("escudo", escudos[1]);
        if (agente.displayName == "Fade") {
          comprar(
            "armaPrincipal",
            armas.find((arma) => arma.displayName == "Bucky")
          );
        } else {
          comprar(
            "armaPrincipal",
            armas.find((arma) => arma.displayName == "Bulldog")
          );
        }
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Frenzy")
        );
        break;
      case "Centinela":
        if (agente.displayName == "Chamber") {
          comprar(
            "armaPrincipal",
            armas.find((arma) => arma.displayName == "Marshal")
          );
        }
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Frenzy")
        );
        comprar("escudo", escudos[1]);
        break;
      case "Duelista":
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Frenzy")
        );
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Sheriff")
        );
        break;
      case "Controlador":
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Frenzy")
        );
        comprar(
          "armaSecundaria",
          armas.find((arma) => arma.displayName == "Sheriff")
        );
        break;
    }

  } else if (3000 < dinero && dinero < 6000) {
    comprar("escudo", escudos[0]);
    if (agente.displayName == "Breach" && mapa.displayName == "Odin") {
      comprar(
        "armaPrincipal",
        armas.find((arma) => arma.displayName == "Odin")
      );
    }
    if (
      agente.displayName == "Raze" ||
      mapa.displayName == "Pearl" ||
      mapa.displayName == "Fracture"
    ) {
      comprar(
        "armaPrincipal",
        armas.find((arma) => arma.displayName == "Phanton")
      );
    } else {
      comprar(
        "armaPrincipal",
        armas.find((arma) => arma.displayName == "Vandal")
      );
    }

    comprar(
      "armaPrincipal",
      armas.find((arma) => arma.displayName == "Spectre")
    );
  } else if (dinero >= 6000) {
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

  equipamiento["habilidades"] = dinero;
  return equipamiento;
}