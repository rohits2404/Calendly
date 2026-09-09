"use client";

import * as React from "react";
import { cn } from "cn";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import {
    DayPicker,
    getDefaultClassNames,
    type DayButton,
    type Locale,
} from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
    locale,
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            captionLayout={captionLayout}
            locale={locale}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString(locale?.code, { month: "short" }),
                ...formatters,
            }}
            classNames={{
                root: cn("w-fit", defaultClassNames.root),

                months: cn(
                    "flex flex-col sm:flex-row gap-2",
                    defaultClassNames.months,
                ),

                month: cn("flex flex-col gap-4", defaultClassNames.month),

                month_caption: cn(
                    "flex justify-center pt-1 relative items-center w-full",
                    defaultClassNames.month_caption,
                ),

                caption_label: cn(
                    "text-sm font-medium",
                    defaultClassNames.caption_label,
                ),

                nav: cn("flex items-center gap-1", defaultClassNames.nav),

                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
                    defaultClassNames.button_previous,
                ),

                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
                    defaultClassNames.button_next,
                ),

                dropdowns: cn(
                    "flex items-center justify-center gap-1.5 text-sm font-medium",
                    defaultClassNames.dropdowns,
                ),

                dropdown_root: cn(
                    "relative rounded-md",
                    defaultClassNames.dropdown_root,
                ),

                dropdown: cn(
                    "absolute inset-0 bg-popover opacity-0",
                    defaultClassNames.dropdown,
                ),

                month_grid: cn(
                    "w-full border-collapse space-x-1",
                    defaultClassNames.month_grid,
                ),

                weekdays: cn("flex", defaultClassNames.weekdays),

                weekday: cn(
                    "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                    defaultClassNames.weekday,
                ),

                week: cn("flex w-full mt-2", defaultClassNames.week),

                week_number_header: cn(
                    "w-8 select-none",
                    defaultClassNames.week_number_header,
                ),

                week_number: cn(
                    "text-[0.8rem] text-muted-foreground select-none",
                    defaultClassNames.week_number,
                ),

                day: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    "[&:has([aria-selected])]:bg-accent",
                    "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                    defaultClassNames.day,
                ),

                range_start: cn(
                    "day-range-start",
                    defaultClassNames.range_start,
                ),

                range_end: cn("day-range-end", defaultClassNames.range_end),

                range_middle: cn(
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    defaultClassNames.range_middle,
                ),

                today: cn(
                    "bg-accent text-accent-foreground",
                    defaultClassNames.today,
                ),

                outside: cn(
                    "day-outside text-muted-foreground aria-selected:text-muted-foreground",
                    defaultClassNames.outside,
                ),

                disabled: cn(
                    "text-muted-foreground opacity-50",
                    defaultClassNames.disabled,
                ),

                hidden: cn("invisible", defaultClassNames.hidden),

                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    );
                },

                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === "left") {
                        return (
                            <ChevronLeftIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        );
                    }

                    if (orientation === "right") {
                        return (
                            <ChevronRightIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        );
                    }

                    return (
                        <ChevronDownIcon
                            className={cn("size-4", className)}
                            {...props}
                        />
                    );
                },

                DayButton: ({ ...props }) => (
                    <CalendarDayButton locale={locale} {...props} />
                ),

                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div className="flex size-8 items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    );
                },

                ...components,
            }}
            {...props}
        />
    );
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    locale,
    ...props
}: React.ComponentProps<typeof DayButton> & {
    locale?: Partial<Locale>;
}) {
    const defaultClassNames = getDefaultClassNames();

    const ref = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (modifiers.focused) {
            ref.current?.focus();
        }
    }, [modifiers.focused]);

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            data-day={day.date.toLocaleDateString(locale?.code)}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "size-8 p-0 font-normal aria-selected:opacity-100",

                // Range styling from the original calendar
                "data-[range-start=true]:rounded-l-md",
                "data-[range-end=true]:rounded-r-md",

                "data-[range-start=true]:bg-primary",
                "data-[range-start=true]:text-primary-foreground",

                "data-[range-end=true]:bg-primary",
                "data-[range-end=true]:text-primary-foreground",

                "data-[range-middle=true]:bg-accent",
                "data-[range-middle=true]:text-accent-foreground",

                // Selected day
                "data-[selected-single=true]:bg-primary",
                "data-[selected-single=true]:text-primary-foreground",
                "data-[selected-single=true]:hover:bg-primary",
                "data-[selected-single=true]:hover:text-primary-foreground",
                "data-[selected-single=true]:focus:bg-primary",
                "data-[selected-single=true]:focus:text-primary-foreground",

                // Focus
                "focus-within:relative focus-within:z-20",

                // Text
                "[&>span]:text-xs [&>span]:opacity-70",

                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton };
