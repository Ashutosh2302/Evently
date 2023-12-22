import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { useLoggedInUserId } from "@/hooks/useLoggedInUser";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  // const { sessionClaims } = auth();
  // const loggendInUserId = sessionClaims?.userId as string;
  const loggedInUserId = await useLoggedInUserId();
  console.log("profile", loggedInUserId);
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const organizedEvents = await getEventsByUser({
    userId: loggedInUserId,
    limit: 6,
    page: eventsPage,
  });

  const orders = await getOrdersByUser({
    userId: loggedInUserId,
    page: ordersPage,
  });

  const myTickets = orders?.data.map((order: IOrder) => order.event) || [];

  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex flex-col gap-3 items-center justify-center sm:justify-between sm:flex-row">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={myTickets}
          emptyTitle="No event tickets purchased yet?"
          emptyStateSubtext="No worries—plenty of exciting experiences await!"
          collectionType="My_Tickets"
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>
      {/* Events Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex flex-col gap-3 items-center justify-center sm:justify-between sm:flex-row">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now!"
          collectionType="Events_Organized"
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
