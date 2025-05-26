class Solicitud {
  
  constructor(fechaIngresoLista, cliente, cantidadPersonas) {
    this._fechaIngresoLista = fechaIngresoLista;
    this._cliente = cliente;
    this._cantidadPersonas = cantidadPersonas;
  }

  getFechaIngresoLista() {
    return this._fechaIngresoLista;
  }

  getCliente() {
    return this._cliente;
  }

  getCantidadPersonas() {
    return this._cantidadPersonas;
  }
}

module.exports = Solicitud;
