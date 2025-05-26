const ExperienciaTuristica = require('../src/models/experiencia-turistica');

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

describe('ExperienciaTuristica', () => {
  let experiencia;

  beforeEach(() => {
    experiencia = new TestExperiencia('Aventura Test', 'Test de experiencia', 10, 2, 100, 5, 10, '2025-05-10');
  });

  test('No debe permitir instanciar la clase base directamente', () => {
    expect(() => new ExperienciaTuristica('Test', 'Test', 10, 2, 100, 5, 10, '2025-05-10')).toThrow(
      'No puedes instanciar ExperienciaTuristica directamente.'
    );
  });

  test('Debe inicializar todos los atributos correctamente', () => {
    expect(experiencia.getNombre()).toBe('Aventura Test');
    expect(experiencia.getDescripcion()).toBe('Test de experiencia');
    expect(experiencia.getCupoMaximo()).toBe(10);
    expect(experiencia.getDuracion()).toBe(2);
    expect(experiencia.getPrecio()).toBe(100);
    expect(experiencia.getMinimoCupoDescuento()).toBe(5);
    expect(experiencia.getPorcentajeDescuento()).toBe(10);
    expect(experiencia.getFecha()).toBe('2025-05-10');
  });

  test('Debe lanzar error al intentar usar métodos abstractos', () => {
    const experienciaBase = Object.create(ExperienciaTuristica.prototype);
    expect(() => experienciaBase.validarDisponibilidad()).toThrow(Error);
    expect(() => experienciaBase.requiereGuiaTuristico()).toThrow(Error);
  });

  test('Debe agregar una reserva correctamente', () => {
    const reservaMock = { id: 1, cantidadPersonas: 3, getCantidadPersonas: jest.fn().mockReturnValue(3) };
    experiencia.agregarReserva(reservaMock);
    expect(experiencia.getReservas()).toContain(reservaMock);
  });

  test('Debe lanzar error al intentar agregar una reserva duplicada', () => {
    const reservaMock = { id: 1, cantidadPersonas: 3, getCantidadPersonas: jest.fn().mockReturnValue(3) };
    experiencia.agregarReserva(reservaMock);
    expect(() => experiencia.agregarReserva(reservaMock)).toThrow('La reserva se encuentra duplicada.');
  });

  test('Debe eliminar una reserva correctamente', () => {
    const reservaMock = { id: 1, cantidadPersonas: 3, getCantidadPersonas: jest.fn().mockReturnValue(3) };
    experiencia.agregarReserva(reservaMock);
    experiencia.removerReserva(reservaMock);
    expect(experiencia.getReservas()).not.toContain(reservaMock);
  });

  test('Debe lanzar error al intentar eliminar una reserva inexistente', () => {
    const reservaMock = { id: 1, cantidadPersonas: 3, getCantidadPersonas: jest.fn().mockReturnValue(3) };
    expect(() => experiencia.removerReserva(reservaMock)).toThrow('La reserva no existe.');
  });
  
  test('Debe calcular el saldo adeudado correctamente', () => {
    const reservaMock1 = {
      getMontoTotal: jest.fn().mockReturnValue(200),
      verificarVencimientoReserva: jest.fn(),
      getEstado: jest.fn().mockReturnValue('pendiente'),
      getCantidadPersonas: jest.fn().mockReturnValue(3),
    };
    const reservaMock2 = {
      getMontoTotal: jest.fn().mockReturnValue(300),
      verificarVencimientoReserva: jest.fn(),
      getEstado: jest.fn().mockReturnValue('pendiente'),
      getCantidadPersonas: jest.fn().mockReturnValue(3),
    };
    const reservaMock3 = {
      getMontoTotal: jest.fn().mockReturnValue(100),
      verificarVencimientoReserva: jest.fn(),
      getEstado: jest.fn().mockReturnValue('canelada'),
      getCantidadPersonas: jest.fn().mockReturnValue(3),
    };

    experiencia.agregarReserva(reservaMock1);
    experiencia.agregarReserva(reservaMock2);
    experiencia.agregarReserva(reservaMock3);
    expect(experiencia.calcularSaldoAdeudado()).toBe(500);
  });
});
