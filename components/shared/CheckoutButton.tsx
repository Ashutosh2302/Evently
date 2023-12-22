"use client";
import { IEvent } from "@/types";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import Checkout from "./Checkout";

interface Props {
  event: IEvent;
  loggedInUserId: string;
}

const CheckoutButton: React.FC<Props> = ({ event, loggedInUserId }) => {
  console.log("in chekcout", { loggedInUserId });
  const hasEventFinished = new Date(event.endDateTime) < new Date();
  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-500">
          Sorry, tickets are not longer available
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild size="lg" className="button rounded-full">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Checkout event={event} loggedInUserId={loggedInUserId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
