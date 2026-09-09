import { PublicProfile } from "@/components/PublicProfile";
import { clerkClient } from "@clerk/nextjs/server";
import React from "react";

const PublicProfilePage = async ({
    params,
}: {
    params: Promise<{ clerkUserId: string }>;
}) => {
    const { clerkUserId } = await params;
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    const { fullName } = user;

    return <PublicProfile userId={clerkUserId} fullName={fullName} />;
};

export default PublicProfilePage;
