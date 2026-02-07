import { useState } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (postData: {
    title: string;
    content: string;
    category: string;
    scheduleForLater: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
  }) => void;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'announcement',
    scheduleForLater: false,
    scheduledDate: '',
    scheduledTime: '12:00'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
    { value: 'event', label: 'Event', color: 'bg-green-100 text-green-800' },
    { value: 'opportunity', label: 'Opportunity', color: 'bg-purple-100 text-purple-800' },
    { value: 'resource', label: 'Resource', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'reminder', label: 'Reminder', color: 'bg-orange-100 text-orange-800' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Post title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.content.trim().length < 20) newErrors.content = 'Content should be at least 20 characters';
    if (formData.scheduleForLater && !formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onCreatePost({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        scheduleForLater: formData.scheduleForLater,
        scheduledDate: formData.scheduleForLater ? formData.scheduledDate : undefined,
        scheduledTime: formData.scheduleForLater ? formData.scheduledTime : undefined
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'announcement',
        scheduleForLater: false,
        scheduledDate: '',
        scheduledTime: '12:00'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Generate today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
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
                  placeholder="e.g., Important Society Update"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        formData.category === cat.value
                          ? `${cat.color} border-transparent font-semibold`
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full p-3 border rounded-lg ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Write your announcement here... You can include details, links, or instructions for members."
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm">
                    {formData.content.length} characters
                    {formData.content.length < 20 && ' (minimum 20)'}
                  </p>
                  <div className="text-sm text-gray-500">
                    Supports basic formatting
                  </div>
                </div>
              </div>

              {/* Scheduling Options */}
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="scheduleForLater"
                    name="scheduleForLater"
                    checked={formData.scheduleForLater}
                    onChange={handleChange}
                    className="h-4 w-4 text-solent-blue rounded"
                  />
                  <label htmlFor="scheduleForLater" className="ml-2 text-sm font-medium text-gray-700">
                    Schedule for later publication
                  </label>
                </div>

                {formData.scheduleForLater && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Date *
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={today}
                        className={`w-full p-3 border rounded-lg ${errors.scheduledDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Time
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

              {/* Preview (optional) */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  {formData.title ? (
                    <>
                      <h4 className="font-bold text-gray-800 mb-2">{formData.title}</h4>
                      <p className="text-gray-600 text-sm mb-1">
                        Category: <span className="font-medium capitalize">{formData.category}</span>
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">
                        {formData.content || 'Content will appear here...'}
                      </p>
                      {formData.scheduleForLater && formData.scheduledDate && (
                        <p className="text-gray-500 text-sm mt-3">
                          📅 Scheduled for: {formData.scheduledDate} at {formData.scheduledTime}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Preview will appear here...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  formData.scheduleForLater ? 'Schedule Post' : 'Publish Now'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;