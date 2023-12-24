"use client";
import { IEvent } from "@/types";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/button";
import Checkout from "./Checkout";
import Spinner from "./Spinner";

interface Props {
  event: IEvent;
}

const CheckoutButton: React.FC<Props> = ({ event }) => {
  const { user } = useUser();

  useEffect(() => {
    setTimeout(async () => {
      user?.reload();
    }, 2000);
  }, [user]);

  const loggedInUserId = user?.publicMetadata.userId as string;

  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {loggedInUserId ? (
              <Checkout event={event} loggedInUserId={loggedInUserId} />
            ) : (
              <Spinner />
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
