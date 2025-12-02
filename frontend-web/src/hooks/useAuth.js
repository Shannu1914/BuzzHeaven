import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const me = localStorage.getItem("me");
    if (me) setUser(JSON.parse(me));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    window.location.href = "/login";
  }

  return { user, logout };
}
