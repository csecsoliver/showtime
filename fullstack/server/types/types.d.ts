export interface Workshop {
  id: number;
  town: string;
  location: string | null;
  time: Date;
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
