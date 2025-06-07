export interface Workshop {
  id: string;
  town: string;
  location: string | null;
  time: string | Date;
  participants: Array<Participant>;
  open: boolean;
  teachers: Array<string>;
}

export interface Participant {
  name: string;
  email: string;
  workshopIds: Array<string>;
}
export interface SecureSessionData {
  apiToken: string;
}
export interface SessionData {
  name: string;
}
export interface Teacher {
  email: string;
  name?: string;
  workshops: Array<string>;
  phone?: string;
}
