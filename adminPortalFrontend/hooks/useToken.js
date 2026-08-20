import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useState, useMemo, useEffect } from "react";

const useToken = () => {
  const [userId, setUserId] = useState(null);

  const fetchToken = async () => {
    const response = await axios.get(`/api/accessToken`);
    const accessToken = response?.data?.accessToken;
    if (!accessToken) {
      throw new Error("No access token found");
    }

    let decoded;
    try {
      decoded = jwtDecode(accessToken);
      setUserId(decoded.sub);
    } catch (error) {
      throw new Error("Failed to decode token");
    }

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    return { accessToken, decoded };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["userToken", userId],
    queryFn: fetchToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes after it's stale
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      if (typeof window !== "undefined") {
        window.location.href = `${process.env.NEXT_PUBLIC_CLIENT_CONNECT_URL || "http://localhost:4200"}/api/auth/login`;
      }
    }
  }, [error]);

  return useMemo(() => {
    if (data) {
      return { ...data, isLoading };
    }
    return { isLoading };
  }, [data, isLoading]);
};

export default useToken;
