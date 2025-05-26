const ExcursionGuiada = require('../src/models/excursion-guiada');
const EstadoReserva = require('../src/util/estado-reserva');

describe('ExcursionGuiada', () => {
  let guiaMock;
  let excursion;

  beforeEach(() => {
    guiaMock = { nombre: 'Guía Experto' };
    excursion = new ExcursionGuiada('Excursión Selva', 'Recorrido guiado por la selva', 10, 450, 150, 5, 20, '2025-05-10', guiaMock);
  });

  test('Debe crear una instancia de ExcursionGuiada correctamente', () => {
    expect(excursion.getNombre()).toBe('Excursión Selva');
    expect(excursion.getDescripcion()).toBe('Recorrido guiado por la selva');
    expect(excursion.getCupoMaximo()).toBe(10);
    expect(excursion.getPrecio()).toBe(150);
    expect(excursion.getMinimoCupoDescuento()).toBe(5);
    expect(excursion.getPorcentajeDescuento()).toBe(20);
    expect(excursion.getFecha()).toBe('2025-05-10');
    expect(excursion.getGuia()).toBe(guiaMock);
  });

  test('Debe poder crear excursión sin guia', () => {
    const excursionSinGuia = new ExcursionGuiada('Excursión Selva', 'Recorrido guiado por la selva', 10, 450, 150, 5, 20);
    expect(excursionSinGuia.getGuia()).toBeUndefined();
  });

  test('Debe validar la disponibilidad correctamente', () => {
    const disponible = excursion.validarDisponibilidad(4);
    expect(disponible).toBe(true);
  });

  test('Debe calcular el costo total sin descuento', () => {
    const costo = excursion.calcularCostoTotal(3);
    expect(costo).toBe(450);
  });

  test('Debe calcular el costo total con descuento', () => {
    const costo = excursion.calcularCostoTotal(5);
    expect(costo).toBe(600);
  });

  test('Debe indicar que requiere guía turístico', () => {
    expect(excursion.requiereGuiaTuristico()).toBe(true);
  });

  test('Debe asignar un guía turístico correctamente', () => {
    const nuevoGuiaMock = { nombre: 'Guía Principiante' };
    excursion.asignarGuia(nuevoGuiaMock);
    expect(excursion.getGuia()).toBe(nuevoGuiaMock);
    expect(excursion.getGuia()).not.toBe(guiaMock);
  });

  test('Debe lanzar error si se intenta reservar sin guía asignado', () => {
    const excursion2 = new ExcursionGuiada('Excursión Selva', 'Recorrido guiado por la selva', 10, 450, 150, 5, 20);
    expect(() => excursion2.validarDisponibilidad(3)).toThrow(Error);
  });

  test('Debe remover un guía turístico correctamente', () => {
    excursion.removerGuia();
    expect(excursion.getGuia()).toBeUndefined();
  });

  test('Debe lanzar error si se intenta reservar excediendo el cupo maximo', () => {
    expect(() => excursion.validarDisponibilidad(30)).toThrow(Error);
  });

  test('Debe validar la disponibilidad correctamente si las reservas alcanzaron el cupo maximo', () => {
    const reserva1 = {
      id: 1,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(8),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
      getCliente: jest.fn().mockReturnValue(null),
    };
    const reserva2 = {
      id: 2,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(2),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
      getCliente: jest.fn().mockReturnValue(null),
    };
    excursion.agregarReserva(reserva1);
    excursion.agregarReserva(reserva2);
    const disponibilidad = excursion.validarDisponibilidad(4);
    expect(disponibilidad).toBe(false);
  });

  test('Debe validar la disponibilidad correctamente si las reservas no alcanzaron el cupo maximo', () => {
    const reserva = {
      id: 2,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(2),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
    };
    excursion.agregarReserva(reserva);
    const disponible = excursion.validarDisponibilidad(4);
    expect(disponible).toBe(true);
  });
});
