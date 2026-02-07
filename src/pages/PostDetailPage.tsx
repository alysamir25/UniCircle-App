import { useParams, useNavigate } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock post data (in a real app, this would come from an API)
  const post = {
    id: id || "1",
    title: "Welcome to the New Semester!",
    author: "Alex Chen",
    role: "Committee President",
    time: "2 hours ago",
    content: `Our first meet-up is scheduled for next Friday, October 27th, at 6:00 PM in the Turing Building (Room 304). 

We'll be covering an introduction to modern web development with React and Node.js. Pizza and drinks will be provided!

We'll also be brainstorming event ideas for the entire academic year, so bring your creativity. Please RSVP via the events tab by Wednesday so we can order enough food.`,
    likes: 24,
    comments: 3,
    badge: "Committee"
  };

  // Mock comments
  const comments = [
    { id: 1, author: "Jamie Patel", time: "1 hour ago", content: "This sounds amazing! Can't wait for the pizza." },
    { id: 2, author: "Sam Wilson", time: "45 mins ago", content: "Will there be options for vegetarian dietary requirements?" },
    { id: 3, author: "Taylor Kim", time: "30 mins ago", content: "I can help with the React workshop if needed!" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Back Button */}
      <header className="bg-solent-blue p-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-white mr-4 text-xl"
          >
            ←
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">UniCircle</h1>
            <p className="text-blue-100 text-sm">Post Details</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {/* Post Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">
          {/* Badge */}
          <div className="flex justify-between items-start mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              {post.badge}
            </span>
            <span className="text-solent-gray text-sm">{post.time}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-800 mr-3">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{post.author}</p>
              <p className="text-solent-gray text-sm">{post.role}</p>
            </div>
          </div>

          {/* Content */}
          <div className="text-gray-700 whitespace-pre-line mb-6">
            {post.content}
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <button className="flex items-center gap-2 text-solent-gray hover:text-blue-600">
              <span className="text-xl">👍</span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-solent-gray hover:text-blue-600">
              <span className="text-xl">💬</span>
              <span>{post.comments} comments</span>
            </button>
            <button className="flex items-center gap-2 text-solent-gray hover:text-blue-600">
              <span className="text-xl">↷</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comments ({post.comments})</h2>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-800 mr-3 text-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">{comment.author}</p>
                      <span className="text-solent-gray text-xs">{comment.time}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{comment.content}</p>
                    <button className="text-solent-gray text-sm mt-2 hover:text-blue-600">
                      👍 Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Input */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-300 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-800">
              Y
            </div>
            <input 
              type="text" 
              placeholder="Write a comment..."
              className="flex-1 p-3 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-solent-blue"
            />
            <button className="w-10 h-10 bg-solent-blue text-white rounded-full flex items-center justify-center hover:bg-blue-700">
              ↑
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (same as dashboard) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center text-solent-gray"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-solent-gray">
          <span className="text-lg">📅</span>
          <span className="text-xs">Events</span>
        </button>
        <button className="flex flex-col items-center text-solent-blue">
          <span className="text-lg">📝</span>
          <span className="text-xs font-semibold">Posts</span>
        </button>
        <button className="flex flex-col items-center text-solent-gray">
          <span className="text-lg">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default PostDetailPage;