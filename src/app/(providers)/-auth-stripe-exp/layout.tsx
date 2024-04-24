"use client";
import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="container">
      <div className="flex justify-center gap-2 my-4 ">
        <Link href="/-auth-stripe-exp/public">Public</Link>
        <Link href="/-auth-stripe-exp/subscribe">Subscribe</Link>
        <Link href="/-auth-stripe-exp/logout">Log out</Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
