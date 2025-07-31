import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MallEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  category: string;
  image: string;
}

export default function MallEvents() {
  const { data: events, isLoading } = useQuery<MallEvent[]>({
    queryKey: ["/api/mall-events"],
    queryFn: async () => {
      const response = await fetch("/api/mall-events");
      if (!response.ok) throw new Error("Failed to fetch mall events");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to sample data if API fails
  const mallEvents = events || [
    {
      id: 1,
      title: "Holiday Market & Craft Fair",
      date: "2025-02-15",
      time: "10:00 AM - 6:00 PM",
      location: "Main Street Mall",
      description: "Local artisans showcasing handmade crafts, food vendors, and live music",
      attendees: 125,
      category: "Shopping",
      image: "/api/placeholder/300/150"
    },
    {
      id: 2,
      title: "Local Business Showcase",
      date: "2025-02-20",
      time: "2:00 PM - 8:00 PM",
      location: "Heritage Square",
      description: "Meet local business owners and discover new stores in your community",
      attendees: 89,
      category: "Business",
      image: "/api/placeholder/300/150"
    },
    {
      id: 3,
      title: "Community Food Festival",
      date: "2025-02-25",
      time: "11:00 AM - 7:00 PM",
      location: "Downtown Plaza",
      description: "Taste local cuisine from neighborhood restaurants and food trucks",
      attendees: 203,
      category: "Food",
      image: "/api/placeholder/300/150"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Upcoming Events</h3>
        <Link href="/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Events
        </Link>
      </div>
      <div className="space-y-4">
        {mallEvents.slice(0, 3).map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {event.category}
                </span>
              </div>
              
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <Clock className="w-3 h-3 ml-3 mr-1" />
                <span>{event.time}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{event.location}</span>
                <Users className="w-3 h-3 ml-3 mr-1" />
                <span>{event.attendees} attending</span>
              </div>
              
              <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}