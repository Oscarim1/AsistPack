import axios from 'axios';
import { httpClient } from './httpClient';
import type { AsistenciaRecord, TipoAsistencia } from './tymeEntryService';

// Endpoints específicos de asistencias
const RESOURCE = '/asistencias';

export type ReporteMensual = {
  mes: string;
  trabajador: {
    nombres: string;
    rol: string;
    contacto: string;
    direccion: string;
    pulsera_uuid: string;
  };
  resumen: {
    dias_trabajados: number;
    horas_brutas: string;
    horas_colacion: string;
    horas_trabajadas: string;
  };
  detalles: Array<{
    fecha: string;
    entrada: string;
    salida_colacion: string;
    entrada_colacion: string;
    salida: string;
    horas_brutas: string;
    horas_colacion: string;
    horas_trabajadas: string;
  }>;
};

/**
 * GET /asistencias/actual/:pulsera_uuid
 */
export async function getAsistenciaActual(
  pulsera_uuid: string
): Promise<AsistenciaRecord> {
  try {
    const resp = await httpClient.get<AsistenciaRecord>(`${RESOURCE}/actual/${pulsera_uuid}`);
    return resp.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return {
        id: 0,
        pulsera_uuid,
        horario_entrada: null,
        horario_salida: null,
        horario_entrada_colacion: null,
        horario_salida_colacion: null,
      };
    }
    throw err;
  }
}

/**
 * POST /asistencias
 */
export async function postAsistencia(
  pulsera_uuid: string,
  tipo: TipoAsistencia
): Promise<void> {
  await httpClient.post(RESOURCE, { pulsera_uuid, tipo });
}

/**
 * GET /asistencias/reporte-mensual/:pulsera_uuid?anio=YYYY&mes=MM
 */
export async function getReporteMensual(
  pulsera_uuid: string,
  anio: number,
  mes: string
): Promise<ReporteMensual> {
  console.log("Fetching monthly report for", pulsera_uuid, anio, mes); // Debugging line to check parameters
  const resp = await httpClient.get<ReporteMensual>(
    `${RESOURCE}/reporte-mensual/${encodeURIComponent(pulsera_uuid)}`,
    { params: { anio, mes } }
  );
  return resp.data;
}