import axios from 'axios';
import api from './api';

export type PulseraEstado = 'activa' | 'inactiva';

export interface EstadoResponse {
  pulsera_uuid: string;
  estado: PulseraEstado;
}

export async function verificarPulsera(uuid: string): Promise<EstadoResponse | null> {
  try {
    const { data } = await api.get<EstadoResponse>(`/pulsera/estado/${uuid}`);
    return data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
      return null;
    }
    throw err;
  }
}

export async function actualizarEstadoPulsera(uuid: string, estado: PulseraEstado): Promise<void> {
  await api.put(`/pulsera/estado/${uuid}`, { estado });
}
