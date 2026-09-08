import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/ui/themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Chrona",
    description:
        "Chrona Is A Simple And Efficient Calendar App That Helps You Manage Your Events, Meetings, And Schedules With Ease. Stay Organized And Never Miss An Important Date Again!",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased animate-fade-in`}
            >
                <ClerkProvider appearance={{ theme: neobrutalism }}>
                    {children}
                </ClerkProvider>
                <Toaster />
            </body>
        </html>
    );
}
