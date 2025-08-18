"use client";

import { Navbar } from "@/components/Navbar";
import { useEventsStore } from "@/store/useEventsStore";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const EventsList = () => {
    const { events, deleteEvent, toggleDone, deleteAll } = useEventsStore();

    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            toast.error(`Please sign in your account first`, {
                position: "top-center",
                autoClose: 3000,
            });
            router.push("/");
        }
    }, [isSignedIn, router]);

    const filteredEvents = events.filter((event) => {
        const matchesName = event.name
            .toLowerCase()
            .includes(searchName.toLowerCase());

        const matchesDate = searchDate ? event.date === searchDate : true;

        return matchesName && matchesDate;
    });


    return (
        <div className="p-6">
            <Navbar />
            <h2 className="text-2xl text-center mt-4 font-bold mb-6 text-gray-800">
                All Events
            </h2>

            <div className="max-w-xl mx-auto mb-6 flex flex-col md:flex-row gap-4">

                <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by event name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            {
                events.length > 0 && (
                    <div className="flex justify-end ">
                        <button
                            onClick={deleteAll}
                            className="bg-red-500 text-white p-2 rounded text-sm cursor-pointer"
                        >
                            Delete All Events
                        </button>
                    </div>
                )
            }


            <div className="space-y-4 max-w-xl mx-auto">
                {filteredEvents.length === 0 ? (
                    <>
                        <p className="text-center">No events found</p>
                        <div className="flex justify-center">
                            <Link href="/events">
                                <button className="w-40 cursor-pointer transform rounded-lg bg-black p-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                    Add Event Now
                                </button>
                            </Link>
                        </div>
                    </>
                ) : (
                    filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <h4
                                    className={`font-semibold text-gray-800 ${event.isDone && "line-through"
                                        }`}
                                >
                                    {event.name}
                                </h4>
                                <p
                                    className={`text-sm text-gray-600 ${event.isDone && "line-through"
                                        }`}
                                >
                                    {formatDate(event.date)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { deleteEvent(event.id); }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete event"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={() => toggleDone(event.id)}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                    title="Mark as done"
                                >
                                    ✅
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventsList;
