import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Personalised interview preparation
            {/* Interview preparation that is tailored to you */}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Get interview questions that are specifically tailored to you
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild={true} size={"lg"}>
              <Link href="/app">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
