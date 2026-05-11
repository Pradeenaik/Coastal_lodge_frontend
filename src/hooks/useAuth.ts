import { useState, useCallback } from "react";
import axios from "axios";
// import api from "../lib/api";
import toast from "react-hot-toast";
import api from "../lib/api";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string }>("/login", {
        username,
        password,
      });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully.");
  }, []);

  return { token, login, logout, loading };
}