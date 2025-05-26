class Actividad {
  constructor(nombre, descripcion, duracion, cupoMaximo) {
    this._nombre = nombre;
    this._descripcion = descripcion;
    this._duracion = duracion; // Duración en minutos
    this._cupoMaximo = cupoMaximo;
  }

  getNombre() {
    return this._nombre;
  }

  getDescripcion() {
    return this._descripcion;
  }

  getDuracion() {
    return this._duracion;
  }

  getCupoMaximo() {
    return this._cupoMaximo;
  }
}

module.exports = Actividad;
