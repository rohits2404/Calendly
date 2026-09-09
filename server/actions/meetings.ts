"use server";

import { db } from "@/drizzle/db";
import { meetingActionSchema } from "@/schema/meetings";
import { fromZonedTime } from "date-fns-tz";
import { z } from "zod";
import { getValidTimesFromSchedule } from "./schedule";
import { createCalendarEvent } from "../google/googleCalendar";
import { EventTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createMeeting(
    unsafeData: z.infer<typeof meetingActionSchema>,
) {
    try {
        const { success, data } = meetingActionSchema.safeParse(unsafeData);

        if (!success) {
            throw new Error("Invalid Data.");
        }

        const [event] = await db
            .select()
            .from(EventTable)
            .where(
                and(
                    eq(EventTable.isActive, true),
                    eq(EventTable.clerkUserId, data.clerkUserId),
                    eq(EventTable.id, data.eventId),
                ),
            )
            .limit(1);

        if (!event) {
            throw new Error("Event Not Found.");
        }

        const startInTimezone = fromZonedTime(data.startTime, data.timezone);

        const validTimes = await getValidTimesFromSchedule(
            [startInTimezone],
            event,
        );

        if (validTimes.length === 0) {
            throw new Error("Selected Time Is Not Valid.");
        }

        await createCalendarEvent({
            ...data,
            startTime: startInTimezone,
            durationInMinutes: event.durationInMinutes,
            eventName: event.name,
        });

        return {
            clerkUserId: data.clerkUserId,
            eventId: data.eventId,
            startTime: data.startTime,
        };
    } catch (error: any) {
        console.error(`Error Creating Meeting: ${error.message || error}`);
        throw new Error(`Failed To Create Meeting: ${error.message || error}`);
    }
}
