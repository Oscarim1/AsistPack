export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Transicion: { trabajador: any; accion: string };
  DetalleTrabajador: { trabajador: any };
  TimeEntry: { trabajador: any };
  MisRegistros: { trabajador: any };  // Recibe el objeto trabajador
};

// Tabs navigator parameters
export type TabsParamList = {
  Inicio: undefined;
  MisRegistros: { trabajador: any };  // Recibe el objeto trabajador
  Menu: undefined;
};

// Stack dentro de la pestaña "Inicio"
export type HomeStackParamList = {
  NfcScanner: undefined;
  Transicion: { trabajador: any; accion: string };
  DetalleTrabajador: { trabajador: any };
  TimeEntry: { trabajador: any };
  MisRegistros: { trabajador: any };    // También aquí recibe params
};