import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sample announcement data
  const announcements = [
    {
      id: 1,
      title: "Welcome to the New Semester!",
      author: "Alex Chen",
      time: "2 hours ago",
      content: "Our first meet-up is scheduled for next Friday. We'll be covering intro to web development...",
      comments: 3,
      likes: 24,
      badge: "Committee"
    },
    {
      id: 2,
      title: "Weekend Hackathon Announcement",
      author: "Tech Team",
      time: "1 day ago",
      content: "48-hour hackathon starts this Saturday at 9 AM in the Innovation Lab. Prizes for top projects!",
      comments: 12,
      likes: 42,
      badge: "Event"
    },
    {
      id: 3,
      title: "Project Group Forming",
      author: "Maria Rodriguez",
      time: "3 days ago",
      content: "Looking for 3 more members for our open-source contribution project. React/Node.js experience preferred.",
      comments: 5,
      likes: 18,
      badge: "Opportunity"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-solent-blue p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">UniCircle</h1>
            <p className="text-blue-100 text-sm mt-1">Member Dashboard</p>
          </div>
          <button
            onClick={logout}
            className="text-white text-sm bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg"
          >
            Logout ({user?.name})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {/* Welcome Message */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
          <p className="text-solent-gray">Latest announcements from the committee</p>
        </div>

        {/* Announcements Feed */}
        <div className="space-y-4">
          {announcements.map((post) => (
            <div 
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  post.badge === "Committee" 
                    ? "bg-blue-100 text-blue-800"
                    : post.badge === "Event"
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {post.badge}
                </span>
                <span className="text-solent-gray text-sm">{post.time}</span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-800 text-lg mb-2">{post.title}</h3>
              
              {/* Author */}
              <p className="text-solent-gray text-sm mb-3">By {post.author}</p>
              
              {/* Content Preview */}
              <p className="text-gray-600 mb-4">{post.content}</p>
              
              {/* Interactions */}
              <div className="flex items-center text-solent-gray text-sm border-t border-gray-100 pt-3">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 ml-4 hover:text-blue-600">
                  <span>💬</span>
                  <span>{post.comments} comments</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-3">
        <button 
          className="flex flex-col items-center text-solent-blue"
          // Current page - no onClick needed
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs font-semibold">Home</span>
        </button>
        
        <button 
          onClick={() => navigate('/events')}
          className="flex flex-col items-center text-solent-gray hover:text-solent-blue"
        >
          <span className="text-lg">📅</span>
          <span className="text-xs">Events</span>
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

      {/* Floating Action Button (for committee) */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-solent-blue text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700">
        +
      </button>
    </div>
  );
};

export default DashboardPage;