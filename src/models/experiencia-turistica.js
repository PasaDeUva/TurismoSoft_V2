const EstadoReserva = require('../util/estado-reserva.js');
const Reserva = require('./reserva.js');
const Solicitud = require('./solicitud.js');

class ExperienciaTuristica {
  constructor(nombre, descripcion, duracion, precio, minimoCupoDescuento, porcentajeDescuento, fecha, cupoMaximo = undefined) {
    if (this.constructor === ExperienciaTuristica) {
      throw new Error('No puedes instanciar ExperienciaTuristica directamente.');
    }
    this._nombre = nombre;
    this._descripcion = descripcion;
    this._cupoMaximo = cupoMaximo;
    this._duracion = duracion;
    this._minimoCupoDescuento = minimoCupoDescuento;
    this._porcentajeDescuento = porcentajeDescuento;
    this._precio = precio;
    this._fecha = fecha;
    this._reservas = [];
    this._solicitudes = [];
  }

  getNombre() {
    return this._nombre;
  }

  getDescripcion() {
    return this._descripcion;
  }

  getCupoMaximo() {
    return this._cupoMaximo;
  }

  getPrecio() {
    return this._precio;
  }

  getMinimoCupoDescuento() {
    return this._minimoCupoDescuento;
  }

  getPorcentajeDescuento() {
    return this._porcentajeDescuento;
  }

  getFecha() {
    return this._fecha;
  }

  getSolicitudes() {
    return this._solicitudes;
  }

  validarDisponibilidad(cantidadPersonasGrupo, fecha) {
    throw new Error('Método validarDisponibilidad no implementado en la clase base.');
  }

  requiereGuiaTuristico() {
    throw new Error('Método requiereGuiaTuristico no implementado en la clase base.');
  }

  getDuracion() {
    return this._duracion;
  }

  agregarReserva(reserva) {
    if (this.getReservas().includes(reserva)) {
      throw new Error('La reserva se encuentra duplicada.');
    }
    this._reservas.push(reserva);
  }

  removerReserva(reserva) {
    const index = this.getReservas().findIndex((r) => r === reserva);
    if (index === -1) {
      throw new Error('La reserva no existe.');
    }
    this._reservas.splice(index, 1);
  }

  getReservas() {
    return this._reservas;
  }

  getCuposDisponibles() {
    if (!this.getReservas() || !this.getReservas().length > 0) {
      return this.getCupoMaximo();
    }

    return (
      this.getCupoMaximo() -
      this.getReservas()
        .filter((r) => r.getEstado() == EstadoReserva.PENDIENTE || r.getEstado() == EstadoReserva.CONFIRMADA)
        .reduce((cuposOcupados, reserva) => cuposOcupados + reserva.getCantidadPersonas(), 0)
    );
  }

  calcularCostoTotal(cantidadPersonasGrupo) {
    let costoTotal = this.getPrecio() * cantidadPersonasGrupo;
    if (cantidadPersonasGrupo >= this.getMinimoCupoDescuento()) {
      costoTotal -= (costoTotal * this.getPorcentajeDescuento()) / 100;
    }
    return costoTotal;
  }

  calcularSaldoAdeudado() {
    const reservasPendientes = this._getReservasPendientes();
    return reservasPendientes.reduce((total, reserva) => total + reserva.getMontoTotal(), 0);
  }

  _getReservasPendientes() {
    this.getReservas().forEach((reserva) => reserva.verificarVencimientoReserva());
    return this.getReservas().filter((reserva) => reserva.getEstado() == EstadoReserva.PENDIENTE);
  }

  liberarCupos(reserva) {
    const solicitud = this._obtenerProximaSolicitud(reserva.getCantidadPersonas());

    if (!solicitud) {
      return;
    }

    this._removerSolicitud(solicitud);
    this.removerReserva(reserva);

    const nuevaReserva = new Reserva(this, solicitud.getCliente(), solicitud.getCantidadPersonas());
    this.agregarReserva(nuevaReserva);
  }

  _obtenerProximaSolicitud(cantidadPersonas) {
    const solicitudesFiltradas = this.getSolicitudes()
      .filter((s) => s.getCantidadPersonas() <= cantidadPersonas)
      .sort((a, b) => a.getCantidadPersonas() - b.getCantidadPersonas())
      .sort((a, b) => a.getFechaIngresoLista() - b.getFechaIngresoLista());

    return solicitudesFiltradas.length > 0 ? solicitudesFiltradas[0] : null;
  }

  agregarSolicitud(solicitud) {
    if (this.getSolicitudes().includes(solicitud)) {
      throw new Error('La solicitud se encuentra duplicada.');
    }
    this._solicitudes.push(solicitud);
  }

  _removerSolicitud(solicitud) {
    const index = this.getSolicitudes().findIndex((s) => s === solicitud);    
    this._solicitudes.splice(index, 1);
  }
}

module.exports = ExperienciaTuristica;
