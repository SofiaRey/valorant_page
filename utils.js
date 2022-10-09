function filtrarPorNombre(nombre, agentes) {
  let nuevoArray = [];
  if(nombre == '') {
    return nuevoArray;
  }
  for (let i = 0; i < agentes.length; i++) {
    if (agentes[i].displayName.toLowerCase().startsWith(nombre.toLowerCase())) {
      nuevoArray.push(agentes[i]);
    }
  }
  return nuevoArray;
}

export { filtrarPorNombre };
