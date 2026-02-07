import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PostsPage = () => {
  const navigate = useNavigate();
  const { user, logout, isCommittee } = useAuth();

  // All posts data (including from different categories)
  const allPosts = [
    {
      id: 1,
      title: "Welcome to the New Semester!",
      author: "Alex Chen",
      time: "2 hours ago",
      content: "Our first meet-up is scheduled for next Friday. We'll be covering intro to web development and planning events for the year...",
      comments: 3,
      likes: 24,
      category: "announcement" as const,
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
      category: "event" as const,
      badge: "Event"
    },
    {
      id: 3,
      title: "Project Group Forming - React/Node.js",
      author: "Maria Rodriguez",
      time: "3 days ago",
      content: "Looking for 3 more members for our open-source contribution project. React/Node.js experience preferred.",
      comments: 5,
      likes: 18,
      category: "opportunity" as const,
      badge: "Opportunity"
    },
    {
      id: 4,
      title: "Study Session: Algorithms & Data Structures",
      author: "Study Group",
      time: "4 days ago",
      content: "Weekly study session every Wednesday at 5 PM in Library Room 205. All years welcome.",
      comments: 7,
      likes: 31,
      category: "resource" as const,
      badge: "Resource"
    },
    {
      id: 5,
      title: "Committee Meeting Minutes - March",
      author: "Committee Secretary",
      time: "1 week ago",
      content: "Summary of our latest committee meeting. Budget approved for new equipment.",
      comments: 2,
      likes: 15,
      category: "announcement" as const,
      badge: "Committee"
    },
    {
      id: 6,
      title: "Internship Opportunity at TechCorp",
      author: "Career Services",
      time: "2 weeks ago",
      content: "Summer internship applications open. Deadline: April 15th. Apply through portal.",
      comments: 9,
      likes: 37,
      category: "opportunity" as const,
      badge: "Opportunity"
    }
  ];

  // Category filters
  const categories = [
    { id: 'all', name: 'All Posts', count: allPosts.length },
    { id: 'announcement', name: 'Announcements', count: allPosts.filter(p => p.category === 'announcement').length },
    { id: 'event', name: 'Events', count: allPosts.filter(p => p.category === 'event').length },
    { id: 'opportunity', name: 'Opportunities', count: allPosts.filter(p => p.category === 'opportunity').length },
    { id: 'resource', name: 'Resources', count: allPosts.filter(p => p.category === 'resource').length }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = selectedCategory === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'opportunity': return 'bg-purple-100 text-purple-800';
      case 'resource': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-solent-blue p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold">UniCircle</h1>
            <p className="text-blue-100 text-sm mt-1">Society Posts & Announcements</p>
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
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Society Feed</h2>
              <p className="text-solent-gray">All announcements, events, and opportunities</p>
            </div>
            {isCommittee && (
              <button className="bg-solent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                + Create Post
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-solent-blue text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                  {post.badge}
                </span>
                <span className="text-solent-gray text-sm">{post.time}</span>
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-2">{post.title}</h3>
              
              <div className="flex items-center text-solent-gray text-sm mb-3">
                <span>By {post.author}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{post.category}</span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
              
              <div className="flex items-center justify-between text-solent-gray text-sm border-t border-gray-100 pt-3">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <span>👍</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <span>💬</span>
                    <span>{post.comments} comments</span>
                  </button>
                </div>
                <button className="text-solent-blue hover:text-blue-700 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No posts found</h3>
            <p className="text-solent-gray">Try selecting a different category</p>
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
        <button className="flex flex-col items-center text-solent-blue">
          <span className="text-lg">📝</span>
          <span className="text-xs font-semibold">Posts</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center text-solent-gray"
        >
          <span className="text-lg">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

// Need to add useState import
import { useState } from 'react';

export default PostsPage;