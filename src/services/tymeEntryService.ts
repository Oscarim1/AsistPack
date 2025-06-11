
import api from './api';
import axios, { AxiosError } from 'axios';

export type TipoAsistencia =
  | 'entrada'
  | 'salida_colacion'
  | 'entrada_colacion'
  | 'salida';

export interface AsistenciaRecord {
  id: number;
  pulsera_uuid: string;
  horario_entrada: string | null;
  horario_salida: string | null;
  horario_entrada_colacion: string | null;
  horario_salida_colacion: string | null;
}

// Crea un AsistenciaRecord “vacío” cuando no hay registros previos
const emptyRecord = (uuid: string): AsistenciaRecord => ({
  id: 0,
  pulsera_uuid: uuid,
  horario_entrada: null,
  horario_salida: null,
  horario_entrada_colacion: null,
  horario_salida_colacion: null,
});

const RESOURCE = '/asistencias';

/**
 * GET /asistencias/actual/:pulsera_uuid
 *
 * - Si la respuesta es 404 o es { message: "No se encontró asistencia..." },
 *   devolvemos un registro vacío (todos los horarios null).
 * - Si viene un objeto con los campos de horario, lo devolvemos tal cual.
 */
export async function getAsistenciaActual(
  pulsera_uuid: string
): Promise<AsistenciaRecord> {
  // Intentamos la petición
  let resp;
  try {
    resp = await api.get<any>(`${RESOURCE}/actual/${pulsera_uuid}`);
  } catch (err: any) {
    // Si el backend responde 404, lo interpretamos como “sin marcas”
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return emptyRecord(pulsera_uuid);
    }
    // Para cualquier otro error, lo re-lanzamos
    throw err;
  }

  // Protección extra: resp o resp.data podrían llegar undefined
  const data = resp?.data;
  // Si la API devolvió solo { message: "..."} o no hay data → vacío
  if (
    !data ||
    typeof data !== 'object' ||
    'message' in data
  ) {
    return emptyRecord(pulsera_uuid);
  }

  // Aquí asumimos que data tiene los cuatro campos de horario
  return {
    id: data.id,
    pulsera_uuid: data.pulsera_uuid,
    horario_entrada: data.horario_entrada ?? null,
    horario_salida: data.horario_salida ?? null,
    horario_entrada_colacion: data.horario_entrada_colacion ?? null,
    horario_salida_colacion: data.horario_salida_colacion ?? null,
  };
}

/**
 * POST /asistencias
 * Envía { pulsera_uuid, tipo } para registrar una nueva marca.
 */
export async function postAsistencia(
  pulsera_uuid: string,
  tipo: TipoAsistencia
): Promise<void> {
  await api.post(RESOURCE, { pulsera_uuid, tipo });
}
