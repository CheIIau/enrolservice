export interface ClientsType {
  [time: string]: ClientData;
}

export interface ClientData {
  name: string | null;
  phone: string | null;
  enrolDate: Date | null;
}

export interface UpdateClientData {
  [key: string]: ClientData;
}
