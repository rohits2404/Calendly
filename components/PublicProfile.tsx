"use client";

import { getPublicEvents, PublicEvent } from "@/server/actions/events";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading } from "./Loading";
import { Copy, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { PublicEventCard } from "./PublicEventCard";

type PublicProfileProps = {
    userId: string;
    fullName: string | null;
};

export function PublicProfile({ userId, fullName }: PublicProfileProps) {
    const [events, setEvents] = useState<PublicEvent[] | null>(null);
    const { user } = useUser();

    const copyProfileUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/book/${userId}`,
            );
            toast("Profile URL Copied To Clipboard!");
        } catch (error) {
            console.error("Failed To Copy URL:", error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getPublicEvents(userId);
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error Fetching Events:", error);
                setEvents([]);
            }
        };

        fetchEvents();
    }, [userId]);

    if (events === null) {
        return (
            <div className="max-w-5xl mx-auto text-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-5">
            {user?.id === userId && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-bold">
                    <Eye className="w-4 h-4" />
                    <p>This Is How People Will See Your Public Profile</p>
                </div>
            )}

            <div className="text-4xl md:text-5xl font-black mb-4 text-center">
                {fullName}
            </div>

            {/* Copy Public Profile URL Button */}
            {user?.id === userId && (
                <div className="flex justify-center mb-6">
                    <Button
                        className="cursor-pointer"
                        variant={"outline"}
                        onClick={copyProfileUrl}
                    >
                        <Copy className="size-4" />
                        Copy Public Profile URL
                    </Button>
                </div>
            )}

            <div className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
                <p className="font-bold text-2xl">Time To Meet!🧑‍🤝‍🧑</p>
                <br /> Pick An Event And Let’s Make It Official By Booking a
                Time.
            </div>

            {events.length === 0 ? (
                <div className="text-center text-muted-foreground">
                    No Events Available At The Moment.
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {events.map((event) => (
                        <PublicEventCard key={event.id} {...event} />
                    ))}
                </div>
            )}
        </div>
    );
}
