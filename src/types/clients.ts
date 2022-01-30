export interface ClientsAtTimeType {
  [time: string]: ClientData;
}

export interface ClientsAtDayType {
  [day: string]: ClientsAtTimeType;
}

export interface ClientsAtMonthType {
  [month: string]: ClientsAtDayType;
}

export interface ClientsAtYearsType {
  [year: string]: Array<ClientsAtMonthType>;
}

export interface ClientData {
  name: string;
  phone: string;
  enrolDate: Date;
}

export interface UpdateClientData {
  [key: string]: ClientData;
}
