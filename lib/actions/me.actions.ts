import { IUser } from "@/types";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";

export async function getMe(clerkId: string): Promise<IUser> {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
