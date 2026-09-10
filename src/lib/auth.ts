import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getCurrentUserSession() {
    const session = await getServerSession(authOptions);

    return {
        id: session?.user?.id as string | undefined,
        name: session?.user?.name ?? undefined,
        username: session?.user?.username ?? undefined,
        role: session?.user?.role as string | undefined,
    };
}

export async function getCurrentUserRole() {
    return (await getCurrentUserSession()).role;
}
