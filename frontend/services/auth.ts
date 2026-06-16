// Service d'authentification : login / logout + persistance du token et du profil.
import { api, TOKEN_KEY, USER_KEY } from "./api";
import { storage } from "./storage";

export type Role = "teacher" | "director";

export type AppUser = {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  school_id: number;
};

export async function login(email: string, password: string): Promise<AppUser> {
  const { data } = await api.post("/auth/login", { email, password });
  await storage.set(TOKEN_KEY, data.access_token);
  await storage.set(USER_KEY, JSON.stringify(data.user));
  return data.user as AppUser;
}

export async function logout(): Promise<void> {
  await storage.remove(TOKEN_KEY);
  await storage.remove(USER_KEY);
}

export async function getStoredUser(): Promise<AppUser | null> {
  const raw = await storage.get(USER_KEY);
  return raw ? (JSON.parse(raw) as AppUser) : null;
}

export async function getToken(): Promise<string | null> {
  return storage.get(TOKEN_KEY);
}
