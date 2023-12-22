import EventForm from "@/components/shared/EventForm";
import { useLoggedInUserId } from "@/hooks/useLoggedInUser";
import { auth } from "@clerk/nextjs";
import React from "react";

const CreateEvent = async () => {
  const loggedInUserId = await useLoggedInUserId();
  console.log("create event", loggedInUserId);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={loggedInUserId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
