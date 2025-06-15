import api from './api';

export interface Trabajador {
  id: number;
  nombres: string;
  rol: string;
  contacto: string;
  direccion: string;
  pulsera_uuid: string;
  estado_pulsera?: string;
}

export const getTrabajadorPorPulsera = async (
  uuid: string
): Promise<Trabajador> => {
  try {
    const { data } = await api.get<Trabajador>(
      `/trabajadores/pulsera/${uuid}`
    );
    return data;
  } catch (err: any) {
    throw new Error('No se encontró el trabajador');
  }
};

export interface CrearTrabajadorData {
  nombres: string;
  direccion: string;
  contacto: string;
  rol: string;
  pulsera_uuid: string;
}

export const crearTrabajador = async (
  data: CrearTrabajadorData
): Promise<Trabajador> => {
  const resp = await api.post<Trabajador>('/trabajadores', data);
  return resp.data;
};
