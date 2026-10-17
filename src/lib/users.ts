import type { Tone } from "@/lib/theme";

export type UserRole = "Admin" | "Editor" | "Viewer";
export type UserStatus = "Active" | "Inactive";

/** Full record from https://fakestoreapi.noksha.dev/api/users/:id. */
export type UserDetail = {
  _id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  role: UserRole;
  status: UserStatus;
  address: { street: string; suite: string; city: string; zipcode: string };
  company: { name: string; catchPhrase: string; bs: string };
};

export type UsersResponse = { data: UserDetail[]; totalUsers: number };

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  company: string;
};

export const toUser = (u: UserDetail): User => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  status: u.status,
  company: u.company.name,
});

export const roleTone: Record<UserRole, Tone> = {
  Admin: "primary",
  Editor: "info",
  Viewer: "neutral",
};

export const statusTone: Record<UserStatus, Tone> = {
  Active: "success",
  Inactive: "neutral",
};
