import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import CreateEventModal from '../components/CreateEventModal';
import CreatePostModal from '../components/CreatePostModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Types for admin data
type AdminEvent = {
  id: number;
  title: string;
  date: string;
  registered: number;
  capacity: number;
  waitlist: number;
  status: 'open' | 'almost_full' | 'full';
};

type AdminPost = {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'committee' | 'admin';
  eventsAttended: number;
  joinDate: string;
  lastActive: string;
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, isCommittee } = useAuth();
  
  // Redirect non-committee members
  useEffect(() => {
    if (!isCommittee) {
      navigate('/dashboard');
    }
  }, [isCommittee, navigate]);

  // Mock admin data
  const [events, setEvents] = useState<AdminEvent[]>([
    { id: 1, title: "Web Dev Workshop", date: "Mar 15", registered: 28, capacity: 40, waitlist: 0, status: 'open' },
    { id: 2, title: "Weekend Hackathon", date: "Mar 23-24", registered: 50, capacity: 50, waitlist: 3, status: 'full' },
    { id: 3, title: "Git & GitHub Course", date: "Mar 19", registered: 65, capacity: 100, waitlist: 0, status: 'open' },
    { id: 4, title: "AI Tools Workshop", date: "Apr 3", registered: 34, capacity: 35, waitlist: 0, status: 'almost_full' },
    { id: 5, title: "Cybersecurity Basics", date: "Apr 10", registered: 45, capacity: 50, waitlist: 2, status: 'open' },
    { id: 6, title: "Data Science Intro", date: "Mar 28", registered: 38, capacity: 40, waitlist: 0, status: 'almost_full' },
  ]);

  const [posts, setPosts] = useState<AdminPost[]>([
    { id: 1, title: "Welcome to New Semester", author: "Alex Chen", date: "2h ago", likes: 24, comments: 3, category: "announcement" },
    { id: 2, title: "Hackathon Announcement", author: "Tech Team", date: "1d ago", likes: 42, comments: 12, category: "event" },
    { id: 3, title: "Project Group Forming", author: "Maria R.", date: "3d ago", likes: 18, comments: 5, category: "opportunity" },
    { id: 4, title: "Exam Study Session", author: "Study Group", date: "5d ago", likes: 32, comments: 8, category: "resource" },
    { id: 5, title: "Summer Internships", author: "Career Center", date: "1w ago", likes: 56, comments: 15, category: "opportunity" },
  ]);

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Alex Chen", email: "alex@solent.ac.uk", role: 'committee', eventsAttended: 8, joinDate: "Sep 2023", lastActive: "Today" },
    { id: 2, name: "Sam Wilson", email: "sam@solent.ac.uk", role: 'member', eventsAttended: 5, joinDate: "Oct 2023", lastActive: "Today" },
    { id: 3, name: "Jamie Patel", email: "jamie@solent.ac.uk", role: 'member', eventsAttended: 3, joinDate: "Jan 2024", lastActive: "2 days ago" },
    { id: 4, name: "Taylor Kim", email: "taylor@solent.ac.uk", role: 'member', eventsAttended: 7, joinDate: "Sep 2023", lastActive: "Today" },
    { id: 5, name: "Morgan Lee", email: "morgan@solent.ac.uk", role: 'member', eventsAttended: 2, joinDate: "Feb 2024", lastActive: "1 week ago" },
    { id: 6, name: "Jordan Smith", email: "jordan@solent.ac.uk", role: 'member', eventsAttended: 4, joinDate: "Nov 2023", lastActive: "3 days ago" },
    { id: 7, name: "Casey Brown", email: "casey@solent.ac.uk", role: 'committee', eventsAttended: 9, joinDate: "Aug 2023", lastActive: "Today" },
    { id: 8, name: "Riley Davis", email: "riley@solent.ac.uk", role: 'member', eventsAttended: 6, joinDate: "Dec 2023", lastActive: "Yesterday" },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'posts' | 'analytics' | 'members'>('overview');
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // month, quarter, year
  const [reportType, setReportType] = useState('summary'); // summary, detailed, custom

  // Stats calculations
  const totalMembers = members.length;
  const committeeMembers = members.filter(m => m.role === 'committee' || m.role === 'admin').length;
  const activeMembers = members.filter(m => m.lastActive === 'Today' || m.lastActive === 'Yesterday').length;
  const totalEvents = events.length;
  const fullEvents = events.filter(e => e.status === 'full').length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
  const totalWaitlist = events.reduce((sum, event) => sum + event.waitlist, 0);
  const totalPosts = posts.length;
  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments, 0);
  const avgEventAttendance = events.length > 0 ? (totalRegistrations / events.length).toFixed(1) : '0';

  // Chart Data
  const registrationTrendData = [
    { month: 'Jan', registrations: 45, events: 3 },
    { month: 'Feb', registrations: 78, events: 5 },
    { month: 'Mar', registrations: 120, events: 8 },
    { month: 'Apr', registrations: 65, events: 4 },
    { month: 'May', registrations: 89, events: 6 },
    { month: 'Jun', registrations: 105, events: 7 },
  ];

  const popularEventsData = events
    .sort((a, b) => b.registered - a.registered)
    .slice(0, 5)
    .map(event => ({
      name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
      registrations: event.registered,
      capacity: event.capacity,
      fill: event.status === 'full' ? '#ef4444' : event.status === 'almost_full' ? '#f59e0b' : '#10b981'
    }));

  const memberEngagementData = [
    { name: 'Active', value: activeMembers, color: '#10b981' },
    { name: 'Occasional', value: members.filter(m => m.lastActive === '3 days ago' || m.lastActive === '2 days ago').length, color: '#f59e0b' },
    { name: 'Inactive', value: members.filter(m => m.lastActive === '1 week ago' || m.lastActive === '2 weeks ago').length, color: '#ef4444' },
  ];

  const eventStatusData = [
    { name: 'Open', value: events.filter(e => e.status === 'open').length, color: '#10b981' },
    { name: 'Almost Full', value: events.filter(e => e.status === 'almost_full').length, color: '#f59e0b' },
    { name: 'Full', value: events.filter(e => e.status === 'full').length, color: '#ef4444' },
  ];

  const topMembersData = members
    .sort((a, b) => b.eventsAttended - a.eventsAttended)
    .slice(0, 5)
    .map(member => ({
      name: member.name.split(' ')[0],
      events: member.eventsAttended,
      role: member.role
    }));

  // Export functions
  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    let content = '';
    let filename = '';
    
    if (reportType === 'summary') {
      const data = {
        dateGenerated: new Date().toISOString(),
        totalMembers,
        committeeMembers,
        activeMembers,
        totalEvents,
        totalRegistrations,
        totalPosts,
        totalEngagement,
        avgEventAttendance,
        dateRange,
      };
      
      if (format === 'csv') {
        content = Object.entries(data).map(([key, value]) => `"${key}","${value}"`).join('\n');
        filename = `analytics_summary_${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        content = JSON.stringify(data, null, 2);
        filename = `analytics_summary_${new Date().toISOString().split('T')[0]}.json`;
      }
    } else {
      // Detailed report
      const reportData = {
        events: events.map(e => ({
          title: e.title,
          date: e.date,
          registered: e.registered,
          capacity: e.capacity,
          waitlist: e.waitlist,
          status: e.status
        })),
        members: members.map(m => ({
          name: m.name,
          email: m.email,
          role: m.role,
          eventsAttended: m.eventsAttended,
          joinDate: m.joinDate,
          lastActive: m.lastActive
        })),
        posts: posts.map(p => ({
          title: p.title,
          author: p.author,
          date: p.date,
          likes: p.likes,
          comments: p.comments,
          category: p.category
        }))
      };
      
      if (format === 'csv') {
        const eventsCSV = ['Event Title,Date,Registered,Capacity,Waitlist,Status']
          .concat(reportData.events.map(e => `"${e.title}","${e.date}",${e.registered},${e.capacity},${e.waitlist},${e.status}`))
          .join('\n');
        
        const membersCSV = ['Name,Email,Role,Events Attended,Join Date,Last Active']
          .concat(reportData.members.map(m => `"${m.name}","${m.email}",${m.role},${m.eventsAttended},${m.joinDate},${m.lastActive}`))
          .join('\n');
        
        content = `EVENTS DATA\n${eventsCSV}\n\nMEMBERS DATA\n${membersCSV}`;
        filename = `detailed_report_${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        content = JSON.stringify(reportData, null, 2);
        filename = `detailed_report_${new Date().toISOString().split('T')[0]}.json`;
      }
    }
    
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Report exported as ${filename}`);
  };

  // Admin functions
  const deleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const deletePost = (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const promoteToCommittee = (memberId: number) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: 'committee' as const } : member
    ));
  };

  const handleCreateEvent = (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
  }) => {
    const newEvent: AdminEvent = {
      id: events.length + 1,
      title: eventData.title,
      date: `${eventData.date} • ${eventData.time}`,
      registered: 0,
      capacity: eventData.capacity,
      waitlist: 0,
      status: 'open'
    };
    
    setEvents([...events, newEvent]);
    alert(`Event "${eventData.title}" created successfully!`);
  };

  const handleCreatePost = (postData: {
    title: string;
    content: string;
    category: string;
    scheduleForLater: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
  }) => {
    const newPost: AdminPost = {
      id: posts.length + 1,
      title: postData.title,
      author: user?.name || 'Committee Member',
      date: postData.scheduleForLater 
        ? `Scheduled: ${postData.scheduledDate}` 
        : 'Just now',
      likes: 0,
      comments: 0,
      category: postData.category
    };
    
    setPosts([newPost, ...posts]);
    
    const message = postData.scheduleForLater
      ? `Post "${postData.title}" scheduled for ${postData.scheduledDate} ${postData.scheduledTime}`
      : `Post "${postData.title}" published successfully!`;
      
    alert(message);
  };

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
            <h1 className="text-white text-2xl font-bold">Committee Dashboard</h1>
            <p className="text-purple-200 text-sm mt-1">Admin tools for UniCircle management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white text-sm bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded-lg"
            >
              User View
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
      <main className="flex-1 p-4 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-2xl font-bold text-solent-blue">{totalMembers}</p>
            <p className="text-gray-600 text-sm">Total Members</p>
            <p className="text-gray-500 text-xs">{committeeMembers} committee, {activeMembers} active</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-2xl font-bold text-green-600">{totalEvents}</p>
            <p className="text-gray-600 text-sm">Active Events</p>
            <p className="text-gray-500 text-xs">{fullEvents} full, {totalWaitlist} on waitlists</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-2xl font-bold text-purple-600">{totalPosts}</p>
            <p className="text-gray-600 text-sm">Active Posts</p>
            <p className="text-gray-500 text-xs">{totalEngagement} total engagements</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-2xl font-bold text-orange-600">{avgEventAttendance}</p>
            <p className="text-gray-600 text-sm">Avg. Attendance</p>
            <p className="text-gray-500 text-xs">{totalRegistrations} total registrations</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md ${activeTab === 'events' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              📅 Events
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md ${activeTab === 'posts' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              📝 Posts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md ${activeTab === 'analytics' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              📈 Analytics
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md ${activeTab === 'members' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              👥 Members
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow border p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <div className="text-2xl mb-2">+</div>
                  <div className="font-medium">Create New Event</div>
                  <div className="text-gray-500 text-sm">Schedule workshops, hackathons, etc.</div>
                </button>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
                >
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-medium">Create Announcement</div>
                  <div className="text-gray-500 text-sm">Post to all members</div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-medium">View Analytics</div>
                  <div className="text-gray-500 text-sm">See insights and reports</div>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      📅
                    </div>
                    <div>
                      <p className="font-medium">New event registration</p>
                      <p className="text-gray-500 text-sm">Sam Wilson registered for Web Dev Workshop</p>
                    </div>
                    <span className="ml-auto text-gray-500 text-sm">10 min ago</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      💬
                    </div>
                    <div>
                      <p className="font-medium">New comment</p>
                      <p className="text-gray-500 text-sm">Jamie Patel commented on "Welcome Post"</p>
                    </div>
                    <span className="ml-auto text-gray-500 text-sm">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Event Management</h2>
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="bg-solent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                >
                  + Create New Event
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 text-sm font-medium">Event</th>
                      <th className="text-left p-3 text-sm font-medium">Date</th>
                      <th className="text-left p-3 text-sm font-medium">Registration</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                      <th className="text-left p-3 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{event.title}</div>
                        </td>
                        <td className="p-3">{event.date}</td>
                        <td className="p-3">
                          <div>{event.registered}/{event.capacity}</div>
                          {event.waitlist > 0 && (
                            <div className="text-purple-600 text-sm">{event.waitlist} on waitlist</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.status === 'full' ? 'bg-red-100 text-red-800' :
                            event.status === 'almost_full' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/event/${event.id}/admin`)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {/* Edit functionality */}}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Post Management</h2>
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                >
                  + Create New Post
                </button>
              </div>

              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{post.title}</h3>
                        <div className="text-gray-600 text-sm mt-1">
                          By {post.author} • {post.date} • {post.category}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>👍 {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
                
                <div className="flex flex-wrap gap-3">
                  {/* Date Range Selector */}
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 3 months</option>
                    <option value="year">Last 12 months</option>
                  </select>
                  
                  {/* Report Type */}
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="custom">Custom Report</option>
                  </select>
                  
                  {/* Export Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportReport('csv')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                    >
                      📥 Export CSV
                    </button>
                    <button
                      onClick={() => exportReport('pdf')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
                    >
                      📥 Export PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Registration Trends */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-4">Registration Trends</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={registrationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="registrations" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="events" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Popular Events */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-4">Most Popular Events</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={popularEventsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="registrations" name="Registrations">
                        {popularEventsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Member Engagement */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-4">Member Engagement</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={memberEngagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {memberEngagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Event Status Distribution */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-gray-800 mb-4">Event Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={eventStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {eventStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Members Table */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-bold text-gray-800 mb-4">Top Members by Event Attendance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 text-sm font-medium">Rank</th>
                        <th className="text-left p-3 text-sm font-medium">Member</th>
                        <th className="text-left p-3 text-sm font-medium">Role</th>
                        <th className="text-left p-3 text-sm font-medium">Events Attended</th>
                        <th className="text-left p-3 text-sm font-medium">Join Date</th>
                        <th className="text-left p-3 text-sm font-medium">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMembersData.map((member, index) => (
                        <tr key={index} className="border-b hover:bg-white">
                          <td className="p-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              #{index + 1}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{member.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              member.role === 'committee' || member.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {member.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${(member.events / Math.max(...topMembersData.map(m => m.events))) * 100}%` }}
                                ></div>
                              </div>
                              <span className="font-bold">{member.events}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {members.find(m => m.name.startsWith(member.name))?.joinDate || 'N/A'}
                          </td>
                          <td className="p-3">
                            {members.find(m => m.name.startsWith(member.name))?.lastActive || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {((totalRegistrations / (totalMembers * totalEvents)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-600 text-sm">Registration Rate</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((activeMembers / totalMembers) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-600 text-sm">Active Members</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(totalEngagement / totalMembers).toFixed(1)}
                  </div>
                  <div className="text-gray-600 text-sm">Avg. Engagements per Member</div>
                </div>
                <div className="bg-white p-4 rounded-lg border text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {((totalRegistrations / (events.reduce((sum, e) => sum + e.capacity, 0))) * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-600 text-sm">Overall Capacity Utilization</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Member Directory</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 text-sm font-medium">Member</th>
                      <th className="text-left p-3 text-sm font-medium">Role</th>
                      <th className="text-left p-3 text-sm font-medium">Events Attended</th>
                      <th className="text-left p-3 text-sm font-medium">Join Date</th>
                      <th className="text-left p-3 text-sm font-medium">Last Active</th>
                      <th className="text-left p-3 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-gray-600 text-sm">{member.email}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.role === 'committee' || member.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">{member.eventsAttended}</td>
                        <td className="p-3">{member.joinDate}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.lastActive === 'Today' ? 'bg-green-100 text-green-800' :
                            member.lastActive === 'Yesterday' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {member.lastActive}
                          </span>
                        </td>
                        <td className="p-3">
                          {member.role === 'member' && (
                            <button
                              onClick={() => promoteToCommittee(member.id)}
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Make Committee
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center ${activeTab === 'overview' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
        >
          <span className="text-lg">📊</span>
          <span className="text-xs">Overview</span>
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center ${activeTab === 'analytics' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
        >
          <span className="text-lg">📈</span>
          <span className="text-xs">Analytics</span>
        </button>
        <button 
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center text-purple-600"
        >
          <span className="text-lg">⚙️</span>
          <span className="text-xs font-semibold">Admin</span>
        </button>
      </nav>

      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onCreateEvent={handleCreateEvent}
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
};

export default AdminDashboardPage;