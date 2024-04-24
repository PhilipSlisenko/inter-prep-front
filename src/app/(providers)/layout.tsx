"use client";

import { Toaster } from "@/components/ui/toaster";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
const queryClient = new QueryClient();
export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Auth0Provider
      domain="inter-prep.us.auth0.com"
      clientId="v5nUFjWK3sfEu8sCWAE3XvPXLTfF9O6O"
      // authorizationParams={{
      //   audience: "inter-prep-api",
      // }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </Auth0Provider>
  );
}
