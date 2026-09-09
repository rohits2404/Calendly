"use client";

import { BlinkBlur } from "react-loading-indicators";

export const Booking = () => {
    return (
        <div className="flex items-center justify-center">
            <BlinkBlur
                color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                size="large"
                text="Booking Event, Don't Click On Anything⛔⛔..."
                textColor="black"
            />
        </div>
    );
};
