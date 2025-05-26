const ExperienciaTuristica = require('./experiencia-turistica');

class ExcursionGuiada extends ExperienciaTuristica {
  constructor(nombre, descripcion, cupoMaximo, duracion, precio, minimoCupoDescuento, porcentajeDescuento, fecha, guia = undefined) {
    super(nombre, descripcion, duracion, precio, minimoCupoDescuento, porcentajeDescuento, fecha, cupoMaximo);
    this._guia = guia;
  }

  validarDisponibilidad(cantidadPersonasGrupo) {
    if (!this._guia) {
      throw new Error('No hay guías disponibles.');
    }

    if (cantidadPersonasGrupo > this.getCupoMaximo()) {
      throw new Error('Excede el cupo máximo.');
    }

    return this.getCuposDisponibles() > cantidadPersonasGrupo;
  }

  requiereGuiaTuristico() {
    return true;
  }

  asignarGuia(guia) {
    this._guia = guia;
  }

  removerGuia() {
    this._guia = undefined;
  }

  getGuia() {
    return this._guia;
  }
}

module.exports = ExcursionGuiada;
