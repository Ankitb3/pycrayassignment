import { create } from "zustand";

export type Event = {
  id: string;
  name: string;
  date: string;
  isDone: boolean;
};

type EventsStore = {
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  toggleDone: (id: string) => void;
  deleteAll: () => void
};

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  deleteAll: () => set({ events: [] }), 
  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
  toggleDone: (id) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, isDone: !e.isDone } : e
      ),
    })),
}));
