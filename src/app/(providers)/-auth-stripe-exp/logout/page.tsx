"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function Page() {
  const { logout } = useAuth0();
  useEffect(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, []);
  return <div>page</div>;
}
