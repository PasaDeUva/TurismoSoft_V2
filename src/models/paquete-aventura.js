const ExperienciaTuristica = require('./experiencia-turistica');

class PaqueteAventura extends ExperienciaTuristica {
  constructor(nombre, descripcion, duracion, precio, minimoCupoDescuento, porcentajeDescuento, actividades = null) {
    super(nombre, descripcion, duracion, precio, minimoCupoDescuento, porcentajeDescuento);
    this._actividades = actividades;
  }

  validarDisponibilidad(cantidadPersonasGrupo) {
    if (cantidadPersonasGrupo > this.getCupoMaximo()) {
      throw new Error('Excede el cupo máximo.');
    }

    return this.getCuposDisponibles() > cantidadPersonasGrupo;
  }

  requiereGuiaTuristico() {
    return false;
  }

  getActividades() {
    return this._actividades;
  }

  addActividad(actividad) {
    if (this.getActividades().includes(actividad)) {
      throw new Error('La Actividad se encuentra duplicada.');
    }
    this.getActividades().push(actividad);
  }

  removeActividad(actividad) {
    const index = this.getActividades().findIndex((a) => a === actividad);
    if (index === -1) {
      throw new Error('La Actividad no existe.');
    }
    this.getActividades().splice(index, 1);
  }

  getDuracion() {
    if (!this.getActividades()) {
      throw new Error('No hay actividades asignadas al paquete.');
    }
    return this.getActividades().reduce((total, act) => total + act.getDuracion(), 0);
  }

  getCupoMaximo() {
    if (!this.getActividades()) {
      throw new Error('No hay actividades asignadas al paquete.');
    }
    return Math.min(...this.getActividades().map((act) => act.getCupoMaximo()));
  }
}

module.exports = PaqueteAventura;
