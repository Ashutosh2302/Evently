import { getMe } from "@/lib/actions/me.actions";
import { auth } from "@clerk/nextjs";

export const useLoggedInUserId = async (): Promise<string> => {
  const user = auth();

  if (!user.sessionClaims?.userId) return user.sessionClaims?.userId as string;
  const me = await getMe(user.userId!);

  return me._id;
};
