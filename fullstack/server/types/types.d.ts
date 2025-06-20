export interface Workshop {
  // This is the type stored in the database or sent to the client
  id: string;
  town: string;
  location: string | null;
  time: string | Date; // ISO 8601 format including time within day
  participants: Array<string>; // emails of participants linking to User
  open: boolean;
  teachers: Array<string>;
  invites?: Array<string>;
}
export interface SecureSessionData {
  apiToken: string;
}
export interface SessionData {
  name: string;
}
export interface Teacher {
  // user type for teachers
  email: string;
  name?: string;
  workshops: Array<string>;
  phone?: string;
  password?: string;
}
export interface InviteBasic {
  // This is the type sent back to the client who requested the invite with no auth
  id: string;
  invitor: string;
  date: string | Date; // ISO 8601 format not including time within day
}
export interface InviteDetails {
  // This is the type sent back to the client who verified their email
  id: string;
  teacher: Teacher;
  workshop: Workshop;
  email: string;
}
export interface InviteStored{
  // This is the type stored in the database
  id: string;
  invitor: string;
  workshopId: string;
}
export interface User {
  // user type for participants
  email: string;
  name?: string;
  workshops: Array<string>;
}