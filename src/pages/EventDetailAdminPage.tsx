import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import emailService from '../services/emailService';

// Mock attendee data - in real app, this would come from API
const mockAttendees = [
  { id: 1, name: "Alex Chen", email: "alex@solent.ac.uk", universityId: "S123456", registrationDate: "2024-03-10 14:30", status: 'registered' as const },
  { id: 2, name: "Sam Wilson", email: "sam@solent.ac.uk", universityId: "S123457", registrationDate: "2024-03-10 15:15", status: 'registered' as const },
  { id: 3, name: "Jamie Patel", email: "jamie@solent.ac.uk", universityId: "S123458", registrationDate: "2024-03-11 09:45", status: 'registered' as const },
  { id: 4, name: "Taylor Kim", email: "taylor@solent.ac.uk", universityId: "S123459", registrationDate: "2024-03-11 11:20", status: 'registered' as const },
  { id: 5, name: "Morgan Lee", email: "morgan@solent.ac.uk", universityId: "S123460", registrationDate: "2024-03-12 16:10", status: 'waitlisted' as const, position: 1 },
  { id: 6, name: "Jordan Smith", email: "jordan@solent.ac.uk", universityId: "S123461", registrationDate: "2024-03-12 17:45", status: 'waitlisted' as const, position: 2 },
  { id: 7, name: "Casey Brown", email: "casey@solent.ac.uk", universityId: "S123462", registrationDate: "2024-03-13 10:30", status: 'attended' as const },
  { id: 8, name: "Riley Davis", email: "riley@solent.ac.uk", universityId: "S123463", registrationDate: "2024-03-13 11:15", status: 'cancelled' as const },
];

// Mock event data
const mockEvent = {
  id: 2,
  title: "Weekend Hackathon 2024",
  date: "Sat-Sun, Mar 23-24 • 9:00 AM",
  location: "Innovation Lab",
  description: "48-hour coding marathon with prizes for best projects. Bring your laptop and creativity!",
  capacity: 50,
  registered: 50,
  registeredUsers: Array.from({length: 50}, (_, i) => i + 1),
  waitlist: [51, 52, 53],
  status: "full" as const,
  organizerName: "Alex Chen",
  createdAt: "2024-02-15"
};

type Attendee = {
  id: number;
  name: string;
  email: string;
  universityId?: string;
  registrationDate: string;
  status: 'registered' | 'waitlisted' | 'attended' | 'cancelled';
  position?: number;
};

const EventDetailAdminPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout, isCommittee } = useAuth();
  
  const [event] = useState(mockEvent);
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>(mockAttendees);
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Redirect non-committee members
  useEffect(() => {
    if (!isCommittee) {
      navigate('/dashboard');
    }
  }, [isCommittee, navigate]);

  // Filter attendees based on search and status
  useEffect(() => {
    let filtered = attendees;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.status === statusFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(attendee => 
        attendee.name.toLowerCase().includes(term) ||
        attendee.email.toLowerCase().includes(term) ||
        attendee.universityId?.toLowerCase().includes(term)
      );
    }
    
    setFilteredAttendees(filtered);
  }, [attendees, statusFilter, searchTerm]);

  // Handle attendee selection
  const toggleAttendeeSelection = (attendeeId: number) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const selectAllAttendees = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    }
  };

  // CSV Export functionality
  const exportToCSV = () => {
    const selected = selectedAttendees.length > 0 
      ? attendees.filter(a => selectedAttendees.includes(a.id))
      : attendees;
    
    const headers = ['Name', 'Email', 'University ID', 'Registration Date', 'Status', 'Waitlist Position'];
    const csvContent = [
      headers.join(','),
      ...selected.map(attendee => [
        `"${attendee.name}"`,
        `"${attendee.email}"`,
        `"${attendee.universityId || ''}"`,
        `"${attendee.registrationDate}"`,
        `"${attendee.status}"`,
        `"${attendee.position || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  // Waitlist management
  const promoteFromWaitlist = (attendeeId: number) => {
    setAttendees(prev => prev.map(attendee => {
      if (attendee.id === attendeeId && attendee.status === 'waitlisted') {
        // In a real app, you'd send promotion email
        emailService.sendWaitlistPromotion(
          attendee.email,
          event.title,
          event.date,
          event.location
        );
        
        return {
          ...attendee,
          status: 'registered' as const,
          position: undefined
        };
      }
      return attendee;
    }));
  };

  const removeFromEvent = (attendeeId: number) => {
    if (window.confirm('Are you sure you want to remove this attendee?')) {
      setAttendees(prev => prev.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, status: 'cancelled' as const }
          : attendee
      ));
    }
  };

  const markAsAttended = (attendeeId: number) => {
    setAttendees(prev => prev.map(attendee => 
      attendee.id === attendeeId 
        ? { ...attendee, status: 'attended' as const }
        : attendee
    ));
  };

  // Stats calculations
  const registeredCount = attendees.filter(a => a.status === 'registered').length;
  const waitlistedCount = attendees.filter(a => a.status === 'waitlisted').length;
  const attendedCount = attendees.filter(a => a.status === 'attended').length;
  const cancelledCount = attendees.filter(a => a.status === 'cancelled').length;

  if (!isCommittee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">This area is only accessible to committee members.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-solent-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-purple-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-purple-200 hover:text-white text-sm mb-2 flex items-center"
            >
              ← Back to Admin Dashboard
            </button>
            <h1 className="text-white text-2xl font-bold">Event Management</h1>
            <p className="text-purple-200 text-sm mt-1">Manage attendees and waitlist for: {event.title}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-white text-sm bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg"
            >
              Admin Dashboard
            </button>
            <button
              onClick={logout}
              className="text-white text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Logout ({user?.name})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {/* Event Overview Card */}
        <div className="bg-white rounded-xl shadow border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
              <div className="flex items-center text-gray-600 mt-2">
                <span className="mr-4">📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>
              <p className="text-gray-600 mt-2">{event.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">
                {event.registered}/{event.capacity} Registered
              </div>
              <div className="text-sm text-gray-600">
                {event.waitlist.length} on waitlist
              </div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                event.status === 'full' ? 'bg-red-100 text-red-800' :
                event.status === 'almost_full' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {event.status.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{registeredCount}</p>
              <p className="text-gray-600 text-sm">Registered</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{waitlistedCount}</p>
              <p className="text-gray-600 text-sm">On Waitlist</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{attendedCount}</p>
              <p className="text-gray-600 text-sm">Attended</p>
            </div>
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{cancelledCount}</p>
              <p className="text-gray-600 text-sm">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Attendee Management Section */}
        <div className="bg-white rounded-xl shadow border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Attendee Management</h2>
            
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="registered">Registered</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
              >
                📊 Export
              </button>
            </div>
          </div>

          {/* Attendee Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={selectAllAttendees}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 text-sm font-medium">Attendee</th>
                  <th className="text-left p-3 text-sm font-medium">University ID</th>
                  <th className="text-left p-3 text-sm font-medium">Registration Date</th>
                  <th className="text-left p-3 text-sm font-medium">Status</th>
                  <th className="text-left p-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee.id)}
                        onChange={() => toggleAttendeeSelection(attendee.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-gray-600 text-sm">{attendee.email}</div>
                    </td>
                    <td className="p-3">{attendee.universityId || '-'}</td>
                    <td className="p-3">{attendee.registrationDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        attendee.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                        attendee.status === 'waitlisted' ? 'bg-purple-100 text-purple-800' :
                        attendee.status === 'attended' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {attendee.status.toUpperCase()}
                        {attendee.position && ` (#${attendee.position})`}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        {attendee.status === 'waitlisted' && (
                          <button
                            onClick={() => promoteFromWaitlist(attendee.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Promote from waitlist"
                          >
                            ↑ Promote
                          </button>
                        )}
                        {attendee.status === 'registered' && (
                          <button
                            onClick={() => markAsAttended(attendee.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Mark as attended"
                          >
                            ✓ Attended
                          </button>
                        )}
                        <button
                          onClick={() => removeFromEvent(attendee.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Remove attendee"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAttendees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No attendees found matching your criteria
              </div>
            )}
          </div>

          {/* Selected Attendee Actions */}
          {selectedAttendees.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-purple-700">
                  {selectedAttendees.length} attendee(s) selected
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      if (window.confirm(`Send reminder email to ${selectedAttendees.length} selected attendee(s)?`)) {
                        // In real app, send bulk emails
                        alert(`Reminder email sent to ${selectedAttendees.length} attendee(s)`);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Send Reminder
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${selectedAttendees.length} selected attendee(s)?`)) {
                        setAttendees(prev => prev.map(attendee => 
                          selectedAttendees.includes(attendee.id)
                            ? { ...attendee, status: 'cancelled' as const }
                            : attendee
                        ));
                        setSelectedAttendees([]);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Remove Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="mt-6 bg-white rounded-xl shadow border p-6">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                if (window.confirm('Send reminder email to all registered attendees?')) {
                  alert('Reminder email sent to all registered attendees');
                }
              }}
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-center"
            >
              <div className="text-2xl mb-2">📧</div>
              <div className="font-medium">Send Event Reminder</div>
              <div className="text-gray-500 text-sm">Email all registered attendees</div>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Send promotion email to all waitlisted attendees?')) {
                  alert('Promotion email sent to waitlisted attendees');
                }
              }}
              className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 text-center"
            >
              <div className="text-2xl mb-2">⬆️</div>
              <div className="font-medium">Promote Waitlist</div>
              <div className="text-gray-500 text-sm">Promote first 5 waitlisted</div>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Generate check-in QR codes for this event?')) {
                  alert('QR codes generated. Share the link with attendees.');
                }
              }}
              className="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-center"
            >
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium">Generate Check-in QR</div>
              <div className="text-gray-500 text-sm">For event day check-in</div>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center text-gray-400 hover:text-solent-blue"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs">User View</span>
        </button>
        <button 
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center text-purple-600"
        >
          <span className="text-lg">📊</span>
          <span className="text-xs font-semibold">Dashboard</span>
        </button>
        <button className="flex flex-col items-center text-purple-600">
          <span className="text-lg">📅</span>
          <span className="text-xs font-semibold">Event Detail</span>
        </button>
        <button 
          onClick={() => navigate('/admin?tab=events')}
          className="flex flex-col items-center text-gray-400 hover:text-purple-600"
        >
          <span className="text-lg">📋</span>
          <span className="text-xs">All Events</span>
        </button>
      </nav>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Export Attendee List</h2>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="mr-2"
                      />
                      CSV (Excel)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="pdf"
                        checked={exportFormat === 'pdf'}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="mr-2"
                      />
                      PDF
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      All registered attendees ({registeredCount})
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Waitlisted attendees ({waitlistedCount})
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Attended list ({attendedCount})
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={exportToCSV}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Export {exportFormat.toUpperCase()} File
                  </button>
                  <p className="text-gray-500 text-sm mt-2 text-center">
                    {selectedAttendees.length > 0 
                      ? `Exporting ${selectedAttendees.length} selected attendees`
                      : 'Exporting all filtered attendees'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailAdminPage;