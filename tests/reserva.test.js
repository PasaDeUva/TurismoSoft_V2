const Reserva = require('../src/models/reserva.js');
const EstadoReserva = require('../src/util/estado-reserva.js');
const ExperienciaTuristica = require('../src/models/experiencia-turistica.js');

class TestExperiencia extends ExperienciaTuristica {
  constructor(nombre, descripcion, cupoMaximo, duracion, precio, minimoCupoDescuento, porcentajeDescuento, fecha) {
    super(nombre, descripcion, duracion, precio, minimoCupoDescuento, porcentajeDescuento, fecha, cupoMaximo);
  }

  validarDisponibilidad() {
    return true;
  }

  calcularCostoTotal(cantidadPersonasGrupo) {
    return this._precio * cantidadPersonasGrupo;
  }

  requiereGuiaTuristico() {
    return false;
  }
}

describe('Clase Reserva', () => {
  let experiencia;
  let clienteMock;
  let reserva;

  beforeEach(() => {
    const fechaMock = new Date();
    fechaMock.setDate(fechaMock.getDate() + 5); // 5 dias en el futuro
    experiencia = new TestExperiencia('Aventura Test', 'Test de experiencia', 10, 2, 100, 5, 10, '2025-05-10');

    clienteMock = { nombre: 'Juan' };
    const fechaExperiencia = new Date();
    fechaExperiencia.setDate(fechaExperiencia.getDate() + 14); // 2 semanas despues

    reserva = new Reserva(experiencia, clienteMock, 2);
  });

  describe('Crear instancia de una clase', () => {
    test('Deberia crear una instancia de Reserva correctamente', () => {
      expect(reserva.getExperiencia()).toBe(experiencia);
      expect(reserva.getCliente()).toBe(clienteMock);
      expect(reserva.getFechaReserva()).toBeInstanceOf(Date);
      expect(reserva.getCantidadPersonas()).toBe(2);
      expect(reserva.getEstado()).toBe(EstadoReserva.PENDIENTE);
      expect(reserva.getMontoTotal()).toBe(200);
      expect(reserva.getFechaLimitePago()).toBeInstanceOf(Date);
    });

    test('Deberia el id ser UUID', () => {
      expect(reserva.getId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('Deberia calcular correctamente la fecha limite 1 dia antes de la fecha de la experiencia', () => {
      const fechaLimiteEsperada = new Date(reserva.getExperiencia().getFecha());
      fechaLimiteEsperada.setDate(fechaLimiteEsperada.getDate() - 1);
      expect(reserva.getFechaLimitePago().getDate()).toBe(fechaLimiteEsperada.getDate());
    });
  });

  describe('Manejo Reserva', () => {
    test('Deberia cambiar el estado a CONFIRMADA', () => {
      reserva.confirmarReserva();
      expect(reserva.getEstado()).toBe(EstadoReserva.CONFIRMADA);
    });

    test('Deberia cambiar el estado a CANCELADA', () => {
      reserva.cancelarReserva();
      expect(reserva.getEstado()).toBe(EstadoReserva.CANCELADA);
    });
  });

  describe('Vencimiento Reserva', () => {
    test('Deberia cambiar a VENCIDA si paso la fecha limite', () => {
      const fechaFutura = new Date(reserva.getFechaLimitePago());
      fechaFutura.setDate(fechaFutura.getDate() + 1);
      jest.useFakeTimers().setSystemTime(fechaFutura);
      let result = reserva.verificarVencimientoReserva();
      expect(result).toBe(true);
      expect(reserva.getEstado()).toBe(EstadoReserva.VENCIDA);
      jest.useRealTimers();
    });

    test('No deberia cambiar el estado si no paso la fecha limite', () => {
      const fechaPasada = new Date(reserva.getFechaLimitePago());
      fechaPasada.setDate(fechaPasada.getDate() - 1);
      jest.useFakeTimers().setSystemTime(fechaPasada);
      let result = reserva.verificarVencimientoReserva();
      expect(result).toBe(false);
      expect(reserva.getEstado()).toBe(EstadoReserva.PENDIENTE);
      jest.useRealTimers();
    });

    test('No deberia cambiar el estado si ya esta CONFIRMADA', () => {
      reserva._estado = EstadoReserva.CONFIRMADA; // Simulando que ya fue confirmada
      const fechaFutura = new Date(reserva.getFechaLimitePago());
      fechaFutura.setDate(fechaFutura.getDate() + 1);
      jest.useFakeTimers().setSystemTime(fechaFutura);
      let result = reserva.verificarVencimientoReserva();
      expect(result).toBe(false);
      expect(reserva.getEstado()).toBe(EstadoReserva.CONFIRMADA);
      jest.useRealTimers();
    });
  });

  describe('Calcular fecha limite de pago cuando la experiencia es en un futuro lejano', () => {
    test('Deberia calcular correctamente la fecha limite 7 dias despues de hoy', () => {
      const fechaMock2 = new Date();
      fechaMock2.setDate(fechaMock2.getDate() + 11); // 15 dias en el futuro
      experiencia = {
        calcularCostoTotal: jest.fn().mockReturnValue(1000),
        getFecha: jest.fn().mockReturnValue(fechaMock2),
      };
      const reserva2 = new Reserva(experiencia, clienteMock, 2);
      const fechaLimiteEsperada = new Date(reserva.getFechaReserva());
      fechaLimiteEsperada.setDate(fechaLimiteEsperada.getDate() + 7);
      expect(reserva2.getFechaLimitePago().getDate()).toBe(fechaLimiteEsperada.getDate());
    });
  });
});
