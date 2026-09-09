import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import { getEvent } from "@/server/actions/events";
import { clerkClient } from "@clerk/nextjs/server";
import { AlertTriangle } from "lucide-react";
import React from "react";

const SuccessPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ clerkUserId: string; eventId: string }>;
    searchParams: Promise<{ startTime: string }>;
}) => {
    const { clerkUserId, eventId } = await params;
    const { startTime } = await searchParams;

    const event = await getEvent(clerkUserId, eventId);

    if (!event)
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2 text-sm max-w-md mx-auto mt-6">
                <AlertTriangle className="w-5 h-5" />
                <span>This Event Doesn't Exist Anymore.</span>
            </div>
        );

    const client = await clerkClient();
    const calendarUser = await client.users.getUser(clerkUserId);

    const startTimeDate = new Date(startTime);

    return (
        <Card className="max-w-xl mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
            <CardHeader>
                <CardTitle>
                    ✅Successfully Booked {event.name} With{" "}
                    {calendarUser.fullName}
                </CardTitle>

                <CardDescription>
                    {formatDateTime(startTimeDate)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                You Should Receive An Email Confirmation Shortly. You Can Safely
                Close This Page Now.
            </CardContent>
        </Card>
    );
};

export default SuccessPage;
