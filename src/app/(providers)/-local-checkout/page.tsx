"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function LocalCheckoutModal({}: {
  isOpen: boolean;
  setIsOpen: Function;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>Open</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get more questions</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[1, 2, 3].map((variant) => (
              // @ts-ignore
              <PurchaseOptionCard variant={variant} />
            ))}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PurchaseOptionCard({ variant }: { variant: 1 | 2 | 3 }) {
  if (variant === 1) {
    return (
      <Card className="w-[350px]">
        {/* <div className="w-full rounded-t-lg rounded-b bg-primary relative">
          <div className="w-full uppercase text-xs font-semibold text-primary-foreground p-2 text-center">
            Most popular
          </div>
          <div className="h-full flex items-stretch absolute top-0 right-0 py-1 ">
            <div className=" bg-red-400 float-right px-2 mx-4 items-center flex rounded">
              -20%
            </div>
          </div>
        </div> */}
        {/* <CardHeader>
      <CardTitle></CardTitle>
      <CardDescription></CardDescription>
    </CardHeader> */}
        <CardContent>
          <div className="text-center mt-8">
            <span className="text-4xl font-semibold">9$</span>
            <span className="ml-2">
              for <span className="font-semibold">69</span> questions
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant={"outline"}>Get questions</Button>
        </CardFooter>
      </Card>
    );
  }
  if (variant === 2) {
    return (
      <Card className="w-[350px]">
        <div className="w-full rounded-t-lg rounded-b bg-primary relative">
          <div className="w-full uppercase text-xs font-semibold text-primary-foreground p-2 text-center">
            Most popular
          </div>
          <div className="h-full flex items-stretch absolute top-0 right-0 py-1 ">
            {/* <div className="h-full flex flex-col justify-center absolute top-0 right-0"> */}
            <div className=" bg-red-400 float-right px-2 mx-4 items-center flex rounded">
              -20%
            </div>
          </div>
        </div>
        {/* <CardHeader>
      <CardTitle></CardTitle>
      <CardDescription></CardDescription>
    </CardHeader> */}
        <CardContent>
          <div className="text-center mt-8">
            <span className="text-4xl font-semibold">19$</span>
            <span className="ml-2">
              for <span className="font-semibold">182</span> questions
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Get questions</Button>
        </CardFooter>
      </Card>
    );
  }
  if (variant === 3) {
    return (
      <Card className="w-[350px]">
        <div className="w-full rounded-t-lg rounded-b bg-secondary relative">
          <div className="w-full uppercase text-xs font-semibold text-secondary-foreground p-2 text-center">
            Best value
          </div>
          <div className="h-full flex items-stretch absolute top-0 right-0 py-1 ">
            {/* <div className="h-full flex flex-col justify-center absolute top-0 right-0"> */}
            <div className="outline float-right px-2 mx-4 items-center flex rounded text-secondary-foreground">
              -40%
            </div>
          </div>
        </div>
        {/* <CardHeader>
      <CardTitle></CardTitle>
      <CardDescription></CardDescription>
    </CardHeader> */}
        <CardContent>
          <div className="text-center mt-8">
            <span className="text-4xl font-semibold">49$</span>
            <span className="ml-2">
              for <span className="font-semibold">626</span> questions
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant={"secondary"}>Get questions</Button>
        </CardFooter>
      </Card>
    );
  }
}
