"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  IEvent,
  UpdateEventParams,
} from "@/types";
import { revalidatePath } from "next/cache";

import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import Event from "../database/models/event.model";
import Order from "../database/models/order.model";
import User from "../database/models/user.model";
import { handleError } from "../utils";

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};
const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDatabase();
    const organizer = await User.findById(userId);
    if (!organizer) throw new Error("Organizer not found");
    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

export const getEventById = async (id: string): Promise<IEvent> => {
  try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(id));
    if (!event) throw new Error("Event not found");
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error(error);
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams): Promise<{ data: IEvent[]; totalPages: number }> => {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    const skipAmount = (Number(page) - 1) * limit;

    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const eventsQuery = Event.find(conditions)
      .sort({
        createdAt: "desc",
      })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventCount / limit),
    };
  } catch (error) {
    console.error(error);
    throw new Error(typeof error === "string" ? error : JSON.stringify(error));
  }
};

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDatabase();
    const eventOrders = await Order.find({ event: eventId });
    if (eventOrders && eventOrders.length)
      return {
        error: true,
        message: "Orders are associated with this event",
      };

    const deletedEvent: any = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) revalidatePath(path);
    return {
      error: false,
      message: `${deletedEvent.title!} Deleted successfully`,
    };
  } catch (error) {
    console.error("in catch", error);
    return {
      error: true,
      message: "Something went wrong, please try again later",
    };
  }
};

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById("75656");

    if (!eventToUpdate) {
      throw new Error("Event not found");
    }
    if (eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong");
  }
}
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getEventsByUser({
  userId,
  limit = 3,
  page,
}: GetEventsByUserParams) {
  try {
    await connectToDatabase();

    const conditions = { organizer: userId };
    const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
