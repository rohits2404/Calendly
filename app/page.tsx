import { LandingPage } from "@/components/LandingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
    const user = await currentUser();

    // If no user is logged in, render the public landing page
    if (!user) return <LandingPage />;

    // If user is logged in, redirect them to the events page
    return redirect("/events");
};

export default Home;
