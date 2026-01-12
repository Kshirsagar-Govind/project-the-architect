import api from "../api/axios";

interface TokenPayload {
  id: string;
  email: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<User | null> {
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

export async function getCurrentClient(): Promise<User | null> {
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
    const res = await api.get(`/client/${userId}`);
    const user = res.data.data;    
    return user || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export function getUserRole(): string | null {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}
