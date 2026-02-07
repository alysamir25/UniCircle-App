import { useState, useEffect } from 'react';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: number;
    title: string;
    content: string;
    category: string;
  };
  onUpdatePost: (postId: number, postData: {
    title: string;
    content: string;
    category: string;
    scheduleForLater: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
  }) => void;
}

const EditPostModal = ({ isOpen, onClose, post, onUpdatePost }: EditPostModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'announcement',
    scheduleForLater: false,
    scheduledDate: '',
    scheduledTime: '12:00'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with post data when modal opens
  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        scheduleForLater: false,
        scheduledDate: '',
        scheduledTime: '12:00'
      });
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Post title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.scheduleForLater && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdatePost(post.id, formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Post Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Welcome to the New Semester!"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="announcement">📢 Announcement</option>
                  <option value="event">📅 Event</option>
                  <option value="resource">📚 Resource</option>
                  <option value="opportunity">💼 Opportunity</option>
                </select>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-100 border-b border-gray-300 p-2 flex gap-2">
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">B</button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">I</button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">U</button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">📋</button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">🔗</button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded">📷</button>
                  </div>
                  
                  {/* Textarea */}
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full p-3 focus:outline-none ${errors.content ? 'border-red-500' : ''}`}
                    placeholder="Write your post content here..."
                  />
                </div>
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                <div className="text-gray-500 text-sm mt-2">
                  Supports markdown, links, and images
                </div>
              </div>

              {/* Schedule Options */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="scheduleForLater"
                    name="scheduleForLater"
                    checked={formData.scheduleForLater}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="scheduleForLater" className="ml-2 text-sm font-medium text-gray-700">
                    Schedule for later publication
                  </label>
                </div>
                
                {formData.scheduleForLater && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Date *
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={minDate}
                        className={`w-full p-3 border rounded-lg ${errors.scheduledDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Time
                      </label>
                      <input
                        type="time"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;