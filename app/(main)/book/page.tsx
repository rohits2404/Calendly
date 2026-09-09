import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const BookPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/login");
    }

    return redirect(`/book/${userId}`);
};

export default BookPage;
