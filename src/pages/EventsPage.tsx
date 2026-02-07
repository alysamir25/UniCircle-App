import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import emailService from '../services/emailService';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  capacity: number;
  registered: number;
  registeredUsers: number[];
  waitlist: number[];
  status: "open" | "almost_full" | "full";
  isUserRegistered: boolean;
};

const EventsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Mock events data with registration tracking
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Web Dev Workshop: React Basics",
      date: "Fri, Mar 15 • 6:00 PM",
      location: "Turing Building, Room 304",
      description: "Learn React fundamentals with hands-on coding. Pizza provided!",
      capacity: 40,
      registered: 28,
      registeredUsers: [1, 2, 3],
      waitlist: [],
      status: "open",
      isUserRegistered: false
    },
    {
      id: 2,
      title: "Weekend Hackathon 2024",
      date: "Sat-Sun, Mar 23-24 • 9:00 AM",
      location: "Innovation Lab",
      description: "48-hour coding marathon with prizes for best projects.",
      capacity: 50,
      registered: 50,
      registeredUsers: Array.from({length: 50}, (_, i) => i + 1),
      waitlist: [51, 52, 53],
      status: "full",
      isUserRegistered: false
    },
    {
      id: 3,
      title: "Git & GitHub Crash Course",
      date: "Tue, Mar 19 • 5:30 PM",
      location: "Online (Teams)",
      description: "Master version control for your projects.",
      capacity: 100,
      registered: 65,
      registeredUsers: Array.from({length: 65}, (_, i) => i + 10),
      waitlist: [],
      status: "open",
      isUserRegistered: true
    },
    {
      id: 4,
      title: "AI Tools for Developers",
      date: "Wed, Apr 3 • 7:00 PM",
      location: "Tech Hub, Room 208",
      description: "Exploring ChatGPT, Copilot, and other AI assistants.",
      capacity: 35,
      registered: 34,
      registeredUsers: Array.from({length: 34}, (_, i) => i + 20),
      waitlist: [],
      status: "almost_full",
      isUserRegistered: false
    }
  ]);

  // ========== REGISTRATION FUNCTIONS ==========
  
  const handleRegister = (eventId: number) => {
    const userId = user?.id || 999;
    const event = events.find(e => e.id === eventId);
    
    if (!event || !user) return;
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        if (event.registered >= event.capacity) {
          // Add to waitlist if full
          emailService.sendRegistrationConfirmation(
            user.email || 'student@solent.ac.uk',
            event.title,
            event.date,
            event.location,
            true
          );
          
          return {
            ...event,
            waitlist: [...event.waitlist, userId]
          };
        } else {
          // Register for event
          emailService.sendRegistrationConfirmation(
            user.email || 'student@solent.ac.uk',
            event.title,
            event.date,
            event.location,
            false
          );
          
          return {
            ...event,
            registered: event.registered + 1,
            registeredUsers: [...event.registeredUsers, userId],
            isUserRegistered: true,
            status: event.registered + 1 >= event.capacity ? "full" : event.status
          };
        }
      }
      return event;
    }));
  };

  const handleCancelRegistration = (eventId: number) => {
    const userId = user?.id || 999;
    const event = events.find(e => e.id === eventId);
    
    if (!event || !user || !event.isUserRegistered) return;
    
    setEvents(events.map(event => {
      if (event.id === eventId && event.isUserRegistered) {
        const newRegisteredUsers = event.registeredUsers.filter(id => id !== userId);
        const newRegistered = newRegisteredUsers.length;
        
        let newWaitlist = [...event.waitlist];
        let promotedUserId: number | null = null;
        
        if (newRegistered < event.capacity && event.waitlist.length > 0) {
          promotedUserId = newWaitlist.shift() || null;
          if (promotedUserId) {
            newRegisteredUsers.push(promotedUserId);
            console.log(`User ${promotedUserId} promoted from waitlist`);
          }
        }
        
        const newStatus = newRegistered >= event.capacity ? "full" : 
                         newRegistered >= event.capacity * 0.8 ? "almost_full" : "open";
        
        emailService.sendRegistrationCancellation(
          user.email || 'student@solent.ac.uk',
          event.title,
          event.date
        );
        
        return {
          ...event,
          registered: newRegisteredUsers.length,
          registeredUsers: newRegisteredUsers,
          waitlist: newWaitlist,
          isUserRegistered: false,
          status: newStatus
        };
      }
      return event;
    }));
  };

  const handleJoinWaitlist = (eventId: number) => {
    const userId = user?.id || 999;
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        alert(`Joined waitlist for "${event.title}". Position #${event.waitlist.length + 1}`);
        return {
          ...event,
          waitlist: [...event.waitlist, userId]
        };
      }
      return event;
    }));
  };

  const handleViewAttendees = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`Attendees for "${event.title}":\n${event.registeredUsers.length} registered\n${event.waitlist.length} on waitlist`);
    }
  };
  
  // ========== HELPER FUNCTIONS ==========
  
  const getStatusBadge = (event: Event) => {
    if (event.status === 'full') return { text: 'FULL', class: 'bg-red-100 text-red-800' };
    if (event.status === 'almost_full') return { text: 'ALMOST FULL', class: 'bg-yellow-100 text-yellow-800' };
    if (event.registered >= event.capacity * 0.8) return { text: 'LIMITED SPOTS', class: 'bg-orange-100 text-orange-800' };
    return { text: 'OPEN', class: 'bg-green-100 text-green-800' };
  };

  const getActionButton = (event: Event) => {
    if (event.isUserRegistered) {
      return {
        text: 'Cancel Registration',
        onClick: () => handleCancelRegistration(event.id),
        class: 'bg-red-500 text-white hover:bg-red-600'
      };
    }
    
    if (event.status === 'full') {
      return {
        text: `Join Waitlist (${event.waitlist.length})`,
        onClick: () => handleJoinWaitlist(event.id),
        class: 'bg-purple-500 text-white hover:bg-purple-600'
      };
    }
    
    return {
      text: 'Register Now',
      onClick: () => handleRegister(event.id),
      class: 'bg-solent-blue text-white hover:bg-blue-700'
    };
  };

  // ========== RENDER ==========
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-solent-blue p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">UniCircle</h1>
            <p className="text-blue-100 text-sm mt-1">Events Calendar</p>
          </div>
          <button
            onClick={logout}
            className="text-white text-sm bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg"
          >
            Logout ({user?.name})
          </button>
        </div>
      </header>

      {/* Main Content - ALL content goes inside here */}
      <main className="flex-1 p-4 pb-20">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
              <p className="text-solent-gray">Book your spot for society events</p>
            </div>
            <button className="bg-solent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
              + Create Event
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-4">
          {events.map((event) => {
            const badge = getStatusBadge(event);
            const actionButton = getActionButton(event);
            const isAlmostFull = event.registered >= event.capacity * 0.8;
            
            return (
              <div 
                key={event.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
                    {badge.text}
                  </span>
                  <div className="text-right">
                    <span className="text-solent-gray text-sm block">
                      {event.registered}/{event.capacity} spots
                    </span>
                    {event.waitlist.length > 0 && (
                      <span className="text-purple-600 text-xs block">
                        {event.waitlist.length} on waitlist
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 text-xl mb-2">{event.title}</h3>
                
                <div className="flex items-center text-solent-gray text-sm mb-3">
                  <span className="mr-4">📅 {event.date}</span>
                  <span>📍 {event.location}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                {/* Progress bar for capacity */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-solent-gray mb-1">
                    <span>Capacity</span>
                    <span>{Math.round((event.registered / event.capacity) * 100)}% full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        event.registered >= event.capacity ? 'bg-red-500' :
                        isAlmostFull ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleViewAttendees(event.id)}
                    className="text-solent-blue font-semibold hover:text-blue-700 text-sm"
                  >
                    👤 View Attendees ({event.registered})
                  </button>
                  <button
                    onClick={actionButton.onClick}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${actionButton.class}`}
                  >
                    {event.isUserRegistered && '✓ '}{actionButton.text}
                  </button>
                </div>
                
                {/* User status indicator */}
                {event.isUserRegistered && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
                    <span className="text-green-700 text-sm">✓ You are registered for this event</span>
                  </div>
                )}
                {event.waitlist.includes(user?.id || 999) && (
                  <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded text-center">
                    <span className="text-purple-700 text-sm">⏳ You are on the waitlist (position #{event.waitlist.indexOf(user?.id || 999) + 1})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Registration Stats */}
        <div className="mt-8 p-5 bg-white rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Your Event Registration Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-solent-blue">
                {events.filter(e => e.isUserRegistered).length}
              </p>
              <p className="text-solent-gray text-sm">Events Registered</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'open').length}
              </p>
              <p className="text-solent-gray text-sm">Open for Registration</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {events.filter(e => e.status === 'almost_full').length}
              </p>
              <p className="text-solent-gray text-sm">Almost Full</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {events.reduce((total, event) => total + event.waitlist.length, 0)}
              </p>
              <p className="text-solent-gray text-sm">Total on Waitlists</p>
            </div>
          </div>
        </div>

        {/* Email Simulation Panel - NOW CORRECTLY PLACED inside main */}
        <div className="mt-6 p-4 bg-gray-800 text-white rounded-xl">
          <h3 className="font-bold text-lg mb-3">📧 Email Simulation (Demo Only)</h3>
          <p className="text-gray-300 text-sm mb-3">
            When users register/cancel, emails are simulated. In production, real emails would be sent.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (user) {
                  emailService.sendEventReminder(
                    user.email || 'student@solent.ac.uk',
                    "Web Dev Workshop: React Basics",
                    "Fri, Mar 15 • 6:00 PM",
                    "Turing Building, Room 304",
                    2
                  );
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Simulate Event Reminder Email
            </button>
            <button
              onClick={() => {
                if (user) {
                  emailService.sendWaitlistPromotion(
                    user.email || 'student@solent.ac.uk',
                    "Weekend Hackathon 2024",
                    "Sat-Sun, Mar 23-24 • 9:00 AM",
                    "Innovation Lab"
                  );
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
            >
              Simulate Waitlist Promotion Email
            </button>
          </div>
        </div>
      </main> {/* Closing main tag - everything above this is in main content */}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center text-solent-gray hover:text-solent-blue"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-solent-blue">
          <span className="text-lg">📅</span>
          <span className="text-xs font-semibold">Events</span>
        </button>
        <button 
          onClick={() => navigate('/posts')}
          className="flex flex-col items-center text-solent-gray hover:text-solent-blue"
        >
          <span className="text-lg">📝</span>
          <span className="text-xs">Posts</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center text-solent-gray hover:text-solent-blue"
        >
          <span className="text-lg">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default EventsPage;