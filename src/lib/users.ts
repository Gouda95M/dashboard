import type { Tone } from "@/lib/theme";

export type ApiUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "moderator" | "user";
  company: { name: string };
};

/** Full record from https://dummyjson.com/users/:id (fields we display). */
export type UserDetail = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  birthDate: string;
  bloodGroup: string;
  university: string;
  role: ApiUser["role"];
  address: { address: string; city: string; state: string; stateCode: string; postalCode: string; country: string };
  company: { name: string; department: string; title: string };
};

export type UsersResponse = { users: ApiUser[]; total: number };

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: ApiUser["role"];
  company: string;
};

export const toUser = (u: ApiUser): User => ({
  id: String(u.id),
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  role: u.role,
  company: u.company.name,
});

export const roleTone: Record<User["role"], Tone> = {
  admin: "primary",
  moderator: "info",
  user: "neutral",
};
