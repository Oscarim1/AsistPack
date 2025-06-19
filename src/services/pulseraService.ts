import api from './api';

export interface EstadoPulsera {
  pulsera_uuid: string;
  estado: 'activa' | 'inactiva';
}

export async function consultarEstado(
  uuid: string
): Promise<EstadoPulsera> {
  const { data } = await api.get<EstadoPulsera>(`/pulsera/estado/${uuid}`);
  return data;
}

export async function actualizarEstado(
  uuid: string,
  estado: 'activa' | 'inactiva'
): Promise<void> {
  await api.put(`/pulsera/estado/${uuid}`, { estado });
}

