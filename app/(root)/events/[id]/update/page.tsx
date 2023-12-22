import EventForm from "@/components/shared/EventForm";
import { useLoggedInUserId } from "@/hooks/useLoggedInUser";
import { getEventById } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const UpdateEvent = async ({ params: { id } }: SearchParamProps) => {
  const event = await getEventById(id);
  // const { sessionClaims } = auth();
  // const userId = sessionClaims?.userId as string;
  const loggedInUserId = await useLoggedInUserId();
  console.log("update event", loggedInUserId);
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={loggedInUserId} type="Update" event={event} />
      </div>
    </>
  );
};

export default UpdateEvent;
