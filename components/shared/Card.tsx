import { formatDateTime } from "@/lib/utils";
import { IEvent } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface Props {
  event: IEvent;
  hasOrderLink: boolean;
  hidePrice: boolean;
}
const Card = async ({ event, hasOrderLink, hidePrice }: Props) => {
  const { sessionClaims } = auth();
  const loggedInUserId = sessionClaims?.userId as string;
  const isEventCreater = loggedInUserId === event.organizer._id.toString();
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-cover bg-gray-50 bg-center text-gray-500"
      />
      {isEventCreater && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}
      <div className="flex flex-col min-h-[230px] gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <p className="p-semibold-14 w-min rounded-full bg-green-500/10 px-4 py-1 text-green-500">
              {event.isFree ? "Free" : `$${event.price}`}
            </p>
            <p className="p-semibold-14 rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 max-w-[150px] text-ellipsis overflow-hidden whitespace-nowrap">
              {event.category.name}
            </p>
          </div>
        )}
        <p className="p-medium-16 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>

        <div className="flex-between w-full mt-auto">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {event.organizer.firstName} {event.organizer.lastName}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
