"use client"
import Link from 'next/link';
import { useState } from 'react';
import { motion } from "framer-motion";

interface Event {
    id: string;
    name: string;
    date: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [showAllEvents, setShowAllEvents] = useState(false);

    // Get today's date in YYYY-MM-DD format for min date validation
    const today = new Date().toISOString().split('T')[0];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setEventDate(selectedDate);

        // Clear previous error
        setDateError('');

        // Check if selected date is in the past
        if (selectedDate && selectedDate < today) {
            setDateError('Please select today or a future date');
        }
    };
    const handleSubmit = () => {
        if (!eventName.trim() || !eventDate) return;

        // Additional validation: prevent adding past dates
        if (eventDate < today) {
            setDateError('Please select today or a future date');
            return;
        }

        const newEvent: Event = {
            id: crypto.randomUUID(),
            name: eventName.trim(),
            date: eventDate
        };

        setEvents(prev => [newEvent, ...prev]);
        setEventName('');
        setEventDate('');
        setDateError('');
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Determine which events to show
    const eventsToShow = showAllEvents ? events : events.slice(0, 3);
    const hasMoreThan3Events = events.length > 3;

    const isFormValid = eventName.trim() && eventDate && eventDate >= today && !dateError;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <Link href={'/'}>Back</Link>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
                        {"Events Manager"
                            .split(" ")
                            .map((word, index) => (
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

                {/* Event Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Event</h2>

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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${dateError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {dateError && (
                                <p className="mt-1 text-sm text-red-600">{dateError}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleSubmit}
                            disabled={!isFormValid} className={`w-60 transform rounded-lg  ${isFormValid ? "bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" : "bg-gray-300 text-gray-500 px-6 py-2 cursor-not-allowed"}`}>
                            Add Event Now
                        </button>
                    </div>
                </div>

                {/* Events List */}
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
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                {showAllEvents ? 'Show Less' : 'See All Events'}
                            </button>
                        )}
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-gray-600 mb-2">No events yet</h4>
                            <p className="text-gray-500">Create your first event to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {eventsToShow.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{event.name}</h4>
                                        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                                    </div>

                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Delete event"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {hasMoreThan3Events && !showAllEvents && (
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-3">
                                        {events.length - 3} more events hidden
                                    </p>

                                    <button onClick={() => setShowAllEvents(true)}
                                        className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                        Add Event Now
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}