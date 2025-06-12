export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Transicion: {
    trabajador: any;  // o Trabajador si lo tienes tipado
    accion: string;
  };
  DetalleTrabajador: {
    trabajador: any;  // o Trabajador
  };
  TimeEntry: {
    trabajador: any;  // recibe el objeto trabajador con al menos { pulsera_uuid, nombre }
  };
};

export type TabsParamList = {
  Inicio: undefined;
  MisRegistros: undefined;  // sin espacio
  Menu: undefined;          // sin acento
};

export type HomeStackParamList = {
  NfcScanner: undefined;
  Transicion: { trabajador: any; accion: string };
  DetalleTrabajador: { trabajador: any };
  TimeEntry: { trabajador: any };
};