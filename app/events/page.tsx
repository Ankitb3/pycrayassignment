
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import { useEventsStore } from "@/store/useEventsStore";

interface Event {
  id: string;
  name: string;
  date: string;
  isDone: boolean;
}

 export default function EventsPage() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { isLoaded, isSignedIn } = useUser();
  const { events, addEvent, deleteEvent, toggleDone } = useEventsStore();

  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("Please sign in your account first", {
        position: "top-center",
        autoClose: 3000,
      });
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setEventDate(selectedDate);
    setDateError("");

    if (selectedDate && selectedDate < today) {
      setDateError("Please select today or a future date");
    }
  };

  const handleSubmit = () => {
    if (!eventName.trim() || !eventDate) return;

    if (eventDate < today) {
      setDateError("Please select today or a future date");
      return;
    }

    const newEvent: Event = {
      id: crypto.randomUUID(),
      name: eventName.trim(),
      date: eventDate,
      isDone: false,
    };

    // ✅ Add event to Zustand store
    addEvent(newEvent);

    // Clear form
    setEventName("");
    setEventDate("");
    setDateError("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const eventsToShow = showAllEvents ? events : events.slice(0, 3);
  const hasMoreThan3Events = events.length > 3;

  const isFormValid =
    eventName.trim() && eventDate && eventDate >= today && !dateError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Navbar />
      <Link href={"/"}>Back</Link>
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
            {"Events Manager".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <p className="text-gray-600">Create and manage your events</p>
        </div>

        {/* Add event form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Add New Event
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={handleDateChange}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                  dateError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {dateError && (
                <p className="mt-1 text-sm text-red-600">{dateError}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-60 transform rounded-lg  ${
                isFormValid
                  ? "bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  : "bg-gray-300 text-gray-500 px-6 py-2 cursor-not-allowed"
              }`}
            >
              Add Event Now
            </button>
          </div>
        </div>

        {/* Events list */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Your Events ({events.length})
            </h3>

            {hasMoreThan3Events && (
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showAllEvents ? "Show Less" : "See All Events"}
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                No events yet
              </h4>
              <p className="text-gray-500">
                Create your first event to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventsToShow.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4
                      className={`font-semibold text-gray-800 ${
                        event.isDone && "line-through"
                      }`}
                    >
                      {event.name}
                    </h4>
                    <p
                      className={`text-sm text-gray-600 ${
                        event.isDone && "line-through"
                      }`}
                    >
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteEvent(event.id)}
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
              ))}
               {hasMoreThan3Events && !showAllEvents && (
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-3">
                                        {events.length - 3} more events hidden
                                    </p>
                                    <Link href={'/events/list'}> <button
                                        className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                        See All Events
                                    </button></Link>

                                </div>
                            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
