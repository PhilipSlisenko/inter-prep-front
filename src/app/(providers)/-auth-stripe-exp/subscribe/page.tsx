"use client";

import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function Page() {
  // redirect to auth 0 if not logged in
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  useEffect(() => {
    // redirect to log in if not logged in
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        authorizationParams: { redirect_uri: window.location.href },
        // authorizationParams: { redirect_uri: "http://localhost:3000" },
      });
    }
  }, [isLoading, isAuthenticated]);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsReady(true);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return "Auth loading";
  }
  if (isReady) {
    return (
      <div>
        <div>Private page</div>
        <form
          // @ts-ignore
          action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/create_checkout_session?product=p1&auth0_sub=${user.sub}`}
          method="POST"
        >
          <Button type="submit">Plan 1</Button>
        </form>
        <form
          // @ts-ignore
          action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/create_checkout_session?product=p2&auth0_sub=${user.sub}`}
          method="POST"
        >
          <Button type="submit">Plan 2</Button>
        </form>
        {/* if/when i have plan - display current plan: <Plan> */}
      </div>
    );
  }
}
