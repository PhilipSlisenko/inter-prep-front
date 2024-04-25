import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";

export function useLoginHook() {
  // redirect to auth 0 if not logged in
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
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
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsReady(true);
      getAccessTokenSilently({
        authorizationParams: {
          audience: "inter-prep-api",
        },
      }).then((token) => {
        setAccessToken(token);
        axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/handle_log_in`,
          {},
          {
            params: { user_id: user?.sub },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
    }
  }, [isLoading, isAuthenticated]);

  return { isReady, user, getAccessTokenSilently, accessToken };
}

// const [isLoadingAuth, isReadyAuth] = useLoginHook();
//
// if (isLoading) {
//   return "Auth loading";
// }
// if (isReady) {
//   return (
//     <div>
//     ...
