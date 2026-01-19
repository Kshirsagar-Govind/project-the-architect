import api from "../api/axios";
import type { User } from "./interfaces";
interface TokenPayload {
  id: string;
  email: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions:[];
}

export async function getCurrentUser(): Promise<UserData | null> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Decode token to get user ID
    let userId: string | null = null;
    let userEmail: string | null = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
      userId = payload.id || null;
      userEmail = payload.email || null;
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }

    if (!userId && !userEmail) return null;

    // Fetch all users and find the one matching the token ID or email
    const res = await api.get("/user");
    const users = res.data.data || [];
    const user = users.find((u: User) => 
      (userId && u.id === userId) || 
      (userEmail && u.email === userEmail)
    );
    
    return user || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export function getUserRole(): string | "" {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role || "CLIENT";
    } catch (e) {
      return "";
    }
  }
  return null;
}

export function getUser(): User{
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user || {_id:''};
    } catch (e:any) {
      console.log(e);
      return {_id:''};
    }
  }
  return {_id:''};
}

export function getToken():string | null{
  return localStorage.getItem('token')
}

export function isLoggedIn():boolean | false{
  return !!getToken()
}