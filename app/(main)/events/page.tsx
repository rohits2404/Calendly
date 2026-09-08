import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const EventsPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/login");
    }

    return <div>EventsPage</div>;
};

export default EventsPage;
