const Solicitud = require('../src/models/solicitud');

describe('Clase Solicitud', () => {
    let solicitud;
    let clienteMock;
    beforeEach(() => {
        clienteMock = { nombre: 'Juan' };
        solicitud = new Solicitud('2025-05-13',clienteMock, 5);
  });

  test('Debe crear correctamente una solicitud con datos básicos', () => {
    expect(solicitud.getFechaIngresoLista()).toBe('2025-05-13');
    expect(solicitud.getCliente()).toBe(clienteMock);
    expect(solicitud.getCantidadPersonas()).toBe(5);
  });

});