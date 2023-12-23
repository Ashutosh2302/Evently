import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";

import React from "react";

const UpdateEvent = async ({ params: { id } }: SearchParamProps) => {
  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm type="Update" event={event} />
      </div>
    </>
  );
};

export default UpdateEvent;
