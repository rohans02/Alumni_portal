import { getAllEvents } from "@/lib/db/actions/event.actions";
import EventsListPage from "@/components/events/EventsListPage";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function EventsPage() {
  // Fetch all active events
  const events = await getAllEvents(true);
  
  return <EventsListPage events={events} />;
} 