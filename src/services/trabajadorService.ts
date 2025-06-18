import axios from 'axios';
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
  try {
    // 1. Petición HTTP
    const { data: trabajador } = await api.post<Trabajador>('/trabajadores', data);

    console.log('[crearTrabajador] Trabajador creado:', trabajador);

    return trabajador;
  } catch (err) {
    /** ------------------------------------------------------------------
     * 2. Normalizamos el error:
     *    - AxiosError: contiene response/status/message útiles.
     *    - Error genérico: caemos en un mensaje por defecto.
     * ------------------------------------------------------------------*/
    if (axios.isAxiosError(err)) {
      // a) El backend respondió con código ≠ 2xx
      const status  = err.response?.status;           // ej. 400, 401, 500…
      const mensaje = err.response?.data?.message     // tu API devuelve { message }
                   ?? err.message                     // o el mensaje por defecto
                   ?? 'Error al crear el trabajador';

      console.error('[crearTrabajador] AxiosError', { status, mensaje });

      /* b) Re-lanzamos un error más limpio para que la capa superior
       *    (hooks, vistas, etc.) decida cómo notificar al usuario.     */
      throw new Error(mensaje);
    }

    // 3. Error inesperado que NO proviene de Axios
    console.error('[crearTrabajador] Error inesperado', err);
    throw err; // Re-lanzamos para no silenciar problemas de lógica/código
  }
};
