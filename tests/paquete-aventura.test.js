const PaqueteAventura = require('../src/models/paquete-aventura');
const EstadoReserva = require('../src/util/estado-reserva');

describe('PaqueteAventura', () => {
  let actividades;
  let paquete;
  let actividad;

  beforeEach(() => {
    actividades = [
      { nombre: 'Rafting', getCupoMaximo: jest.fn().mockReturnValue(10), getDuracion: jest.fn().mockReturnValue(60) },
      { nombre: 'Escalada', getCupoMaximo: jest.fn().mockReturnValue(5), getDuracion: jest.fn().mockReturnValue(100) },
    ];
    actividad = { nombre: 'Caminata', cupoMaximo: 8, getcupoMaximo: jest.fn().mockReturnValue(8) };
    paquete = new PaqueteAventura('Aventura Extrema', 'Diversión asegurada', 60, 100, 5, 10, actividades);
  });

  test('Debe crear una instancia de PaqueteAventura correctamente', () => {
    expect(paquete.getNombre()).toBe('Aventura Extrema');
    expect(paquete.getDescripcion()).toBe('Diversión asegurada');
    expect(paquete.getCupoMaximo()).toBe(5);
    expect(paquete.getPrecio()).toBe(100);
    expect(paquete.getMinimoCupoDescuento()).toBe(5);
    expect(paquete.getPorcentajeDescuento()).toBe(10);
  });

  test('Debe calcular el cupo máximo correctamente cuando todas las actividades tienen el mismo cupo', () => {
    const actividadesIguales = [
      { nombre: 'Rafting', getCupoMaximo: jest.fn().mockReturnValue(10) },
      { nombre: 'Escalada', getCupoMaximo: jest.fn().mockReturnValue(10) },
    ];

    const paqueteIguales = new PaqueteAventura('Aventura Homogénea', 'Mismas actividades', 3, 100, 5, 10, actividadesIguales);
    expect(paqueteIguales.getCupoMaximo()).toBe(10);
  });

  test('Debe calcular el cupo máximo correctamente con un único valor', () => {
    const actividadesUnica = [{ nombre: 'Rafting', getCupoMaximo: jest.fn().mockReturnValue(12) }];

    const paqueteUnico = new PaqueteAventura('Aventura Única', 'Solo una actividad', 3, 100, 5, 10, actividadesUnica);
    expect(paqueteUnico.getCupoMaximo()).toBe(12);
  });

  test('Debe lanzar error en el cupo si no hay actividades asignadas', () => {
    const paqueteSinActividades = new PaqueteAventura('Aventura Sin Actividades', 'Sin actividades', 3, 100, 5, 10);
    expect(() => paqueteSinActividades.getCupoMaximo()).toThrow('No hay actividades asignadas al paquete.');
  });

  test('Debe calcular la duración correctamente', () => {
    expect(paquete.getDuracion()).toBe(160);
  });

  test('Debe agregar una actividad correctamente', () => {
    paquete.addActividad(actividad);
    expect(paquete.getActividades()).toContain(actividad);
  });

  test('Debe remover una actividad correctamente', () => {
    paquete.getActividades().push(actividad);
    paquete.removeActividad(actividad);
    expect(paquete.getActividades()).not.toContain(actividad);
  });

  test('Debe lanzar error al agregar actividad duplicada', () => {
    paquete.addActividad(actividad);
    expect(() => paquete.addActividad(actividad)).toThrow('La Actividad se encuentra duplicada.');
  });

  test('Debe lanzar error al remover actividad que no existe', () => {
    expect(() => paquete.removeActividad(actividad)).toThrow('La Actividad no existe.');
  });

  test('Debe lanzar error al obtener la duración si no hay actividades asignadas', () => {
    const paqueteSinActividades = new PaqueteAventura('Aventura Sin Actividades', 'Sin actividades', 3, 100, 5, 10);
    expect(() => paqueteSinActividades.getDuracion()).toThrow(Error);
  });

  test('Debe calcular el costo total sin descuento', () => {
    const costo = paquete.calcularCostoTotal(3);
    expect(costo).toBe(300);
  });

  test('Debe calcular el costo total con descuento', () => {
    const costo = paquete.calcularCostoTotal(5);
    expect(costo).toBe(450);
  });

  test('Debe validar la disponibilidad correctamente', () => {
    const disponible = paquete.validarDisponibilidad(3);
    expect(disponible).toBe(true);
  });

  test('Debe indicar que no requiere guía turístico', () => {
    expect(paquete.requiereGuiaTuristico()).toBe(false);
  });

  test('Debe retornar las actividades correctamente', () => {
    expect(paquete.getActividades()).toEqual(actividades);
  });

  test('Debe validar disponibilidad cuando el cupo es excedido', () => {
    expect(() => paquete.validarDisponibilidad(6)).toThrow('Excede el cupo máximo');
  });

  test('Debe validar la disponibilidad correctamente si las reservas alcanzaron el cupo maximo', () => {
    const reserva1 = {
      id: 1,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(1),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
    };
    const reserva2 = {
      id: 2,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(2),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
    };
    paquete.agregarReserva(reserva1);
    paquete.agregarReserva(reserva2);
    const disponibilidad = paquete.validarDisponibilidad(4);
    expect(disponibilidad).toBe(false);
  });

  test('Debe validar la disponibilidad correctamente si las reservas no alcanzaron el cupo maximo', () => {
    const reserva = {
      id: 2,
      getFecha: jest.fn().mockReturnValue('2025-05-10'),
      getCantidadPersonas: jest.fn().mockReturnValue(2),
      getEstado: jest.fn().mockReturnValue(EstadoReserva.CONFIRMADA),
    };
    paquete.agregarReserva(reserva);
    const disponible = paquete.validarDisponibilidad(1);
    expect(disponible).toBe(true);
  });
});
