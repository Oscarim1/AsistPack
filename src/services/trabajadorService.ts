import api from './api';

export interface Trabajador {
  id: number;
  nombre: string;
}

export const getTrabajadorPorPulsera = async (
  uuid: string
): Promise<Trabajador> => {
  try {
    const { data } = await api.get<Trabajador>(
      `/trabajadores/pulsera/${uuid}`
    );
    console.log('Trabajador encontrado:', data);
    return data;
  } catch (err: any) {
    throw new Error('No se encontró el trabajador');
  }
};
