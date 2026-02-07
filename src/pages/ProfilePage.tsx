import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isCommittee } = useAuth();

  // Mock user data
  const userStats = {
    postsCreated: 12,
    eventsAttended: 8,
    commentsMade: 42,
    memberSince: 'Sep 2023'
  };

  const upcomingEvents = [
    { id: 1, title: 'Web Dev Workshop', date: 'Mar 15, 6:00 PM' },
    { id: 2, title: 'Git & GitHub Course', date: 'Mar 19, 5:30 PM' }
  ];

  const recentActivity = [
    { id: 1, action: 'commented on', target: 'Welcome to New Semester', time: '2 hours ago' },
    { id: 2, action: 'registered for', target: 'Weekend Hackathon', time: '1 day ago' },
    { id: 3, action: 'liked', target: 'Project Group Forming', time: '2 days ago' },
    { id: 4, action: 'commented on', target: 'Study Session', time: '3 days ago' }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'committee': return { text: 'COMMITTEE MEMBER', class: 'bg-purple-100 text-purple-800' };
      case 'admin': return { text: 'ADMIN', class: 'bg-red-100 text-red-800' };
      default: return { text: 'MEMBER', class: 'bg-blue-100 text-blue-800' };
    }
  };

  const roleBadge = getRoleBadge(user?.role || 'member');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-solent-blue p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">UniCircle</h1>
            <p className="text-blue-100 text-sm mt-1">Your Profile</p>
          </div>
          <button
            onClick={logout}
            className="text-white text-sm bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-start">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
                  <p className="text-solent-gray">{user?.email || 'user@solent.ac.uk'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.class}`}>
                  {roleBadge.text}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-solent-blue">{userStats.postsCreated}</p>
                  <p className="text-solent-gray text-sm">Posts</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userStats.eventsAttended}</p>
                  <p className="text-solent-gray text-sm">Events</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{userStats.commentsMade}</p>
                  <p className="text-solent-gray text-sm">Comments</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">Since</p>
                  <p className="text-solent-gray text-sm">{userStats.memberSince}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Edit Profile Button */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full py-3 border-2 border-solent-blue text-solent-blue rounded-lg font-semibold hover:bg-blue-50">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Upcoming Events */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
              <span className="mr-2">📅</span> Your Upcoming Events
            </h3>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{event.title}</span>
                      <button className="text-solent-blue text-sm hover:text-blue-700 font-medium">
                        View →
                      </button>
                    </div>
                    <p className="text-solent-gray text-sm mt-1">{event.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">📭</div>
                <p className="text-solent-gray">No upcoming events</p>
                <button 
                  onClick={() => navigate('/events')}
                  className="mt-3 text-solent-blue hover:text-blue-700 font-medium"
                >
                  Browse Events →
                </button>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/events')}
              className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              View All Events
            </button>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
              <span className="mr-2">📝</span> Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    {activity.action.includes('commented') && '💬'}
                    {activity.action.includes('registered') && '✅'}
                    {activity.action.includes('liked') && '👍'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      You <span className="font-medium">{activity.action}</span>{' '}
                      <span className="font-semibold text-gray-800">"{activity.target}"</span>
                    </p>
                    <p className="text-solent-gray text-sm mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
              View Full Activity Log
            </button>
          </div>
        </div>

        {/* Committee Section (only for committee members) */}
        {isCommittee && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
            <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
              <span className="mr-2">⭐</span> Committee Tools
            </h3>
            <p className="text-solent-gray mb-4">
              Special tools available for committee members to manage the society.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="p-3 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-800">Create Announcement</div>
                <div className="text-solent-gray text-sm">Post to all members</div>
              </button>
              <button className="p-3 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-800">Manage Events</div>
                <div className="text-solent-gray text-sm">View registrations</div>
              </button>
              <button className="p-3 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 text-left">
                <div className="font-medium text-gray-800">Member Directory</div>
                <div className="text-solent-gray text-sm">View all members</div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center text-solent-gray"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button 
          onClick={() => navigate('/events')}
          className="flex flex-col items-center text-solent-gray"
        >
          <span className="text-lg">📅</span>
          <span className="text-xs">Events</span>
        </button>
        <button 
          onClick={() => navigate('/posts')}
          className="flex flex-col items-center text-solent-gray"
        >
          <span className="text-lg">📝</span>
          <span className="text-xs">Posts</span>
        </button>
        <button className="flex flex-col items-center text-solent-blue">
          <span className="text-lg">👤</span>
          <span className="text-xs font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfilePage;