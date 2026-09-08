"use client";

import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/ui/themes";
import Image from "next/image";

export const LandingPage = () => {
    return (
        <main className="flex items-center p-10 gap-24 animate-fade-in max-md:flex-col">
            <section className="flex flex-col items-center">
                <Image
                    src="/assets/logo.svg"
                    width={300}
                    height={300}
                    alt="Logo"
                />

                <h1 className="text-2xl font-black lg:text-3xl">
                    Your Time, Perfectly Planned
                </h1>

                <p className="font-extralight">
                    Join Millions Of Professionals Who Easily Book Meetings With
                    The #1 Scheduling Tool
                </p>

                <Image
                    src="/assets/planning.svg"
                    width={500}
                    height={500}
                    alt="Logo"
                />
            </section>

            <div className="mt-3">
                <SignIn
                    routing="hash"
                    appearance={{
                        theme: neobrutalism,
                    }}
                />
            </div>
        </main>
    );
};
