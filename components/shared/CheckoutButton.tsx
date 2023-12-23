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
  if (!user) return null;

  useEffect(() => {
    setTimeout(async () => {
      user?.reload();
    }, 2000);
  }, [user]);

  const loggedInUserId = user?.publicMetadata.userId as string;
  console.log("in checkout", loggedInUserId);

  const hasEventFinished = new Date(event.endDateTime) < new Date();

  const renderContent = () => {
    if (!user?.publicMetadata.userId) return <Spinner />;
    return (
      <>
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
      </>
    );
  };
  return renderContent();
};

export default CheckoutButton;
