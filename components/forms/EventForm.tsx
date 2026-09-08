"use client";

import { eventFormSchema } from "@/schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { createEvent, deleteEvent, updateEvent } from "@/actions/events";

export const EventForm = ({
    event,
}: {
    event?: {
        id: string;
        name: string;
        description?: string;
        durationInMinutes: number;
        isActive: boolean;
    };
}) => {
    const [isDeletePending, startDeleteTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event
            ? {
                  ...event,
              }
            : {
                  isActive: true,
                  durationInMinutes: 30,
                  description: "",
                  name: "",
              },
    });

    // Handle form submission
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action =
            event == null ? createEvent : updateEvent.bind(null, event.id);
        try {
            await action(values);
            router.push("/events");
        } catch (error: any) {
            // Handle any error that occurs during the action (e.g., network error)
            form.setError("root", {
                message: `There was an error saving your event ${error.message}`,
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col"
            >
                {/* Show root error if any */}
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                {/* Event Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                The Name Users Will See When Booking
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Duration Field */}
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>In Minutes</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Optional Description Field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="resize-none h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional Description Of The Event
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Toggle for Active Status */}
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Active</FormLabel>
                            </div>
                            <FormDescription>
                                Inactive Events Will Not Be Visible For Users To
                                Book
                            </FormDescription>
                        </FormItem>
                    )}
                />

                {/* Buttons section: Delete, Cancel, Save */}
                <div className="flex gap-2 justify-end">
                    {/* Delete Button (only shows if editing existing event) */}
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="cursor-pointer hover:scale-105 hover:bg-red-700"
                                    variant="destructive"
                                    disabled={
                                        isDeletePending ||
                                        form.formState.isSubmitting
                                    }
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are You Sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This Action Cannot Be Undone. This Will
                                        Permanently Delete This Event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-700 cursor-pointer"
                                        disabled={
                                            isDeletePending ||
                                            form.formState.isSubmitting
                                        }
                                        onClick={() => {
                                            startDeleteTransition(async () => {
                                                try {
                                                    await deleteEvent(event.id);
                                                    router.push("/events");
                                                } catch (error: any) {
                                                    form.setError("root", {
                                                        message: `There Was An Error Deleting Your Event: ${error.message}`,
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <Button
                        disabled={
                            isDeletePending || form.formState.isSubmitting
                        }
                        type="button"
                        asChild
                        variant="outline"
                    >
                        <Link href="/events">Cancel</Link>
                    </Button>

                    {/* Save Button - submits the form */}
                    <Button
                        className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
                        disabled={
                            isDeletePending || form.formState.isSubmitting
                        }
                        type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};
