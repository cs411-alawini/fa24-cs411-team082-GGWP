import React from 'react';

interface CommentFormProps {
  onClose: () => void;
  onSubmit: (commentData: { Message: string; Username: string; DatePosted: string }) => void;
  defaultCommentData?: { Message: string; Username: string; DatePosted: string };
}

const CommentForm: React.FC<CommentFormProps> = ({ onClose, onSubmit, defaultCommentData }) => {
  const [message, setMessage] = React.useState<string>(defaultCommentData?.Message || 'No message.');
  const [user, setUser] = React.useState<string>(defaultCommentData?.Username || 'Anonymus');
  const [date, setDate] = React.useState<string>(defaultCommentData?.DatePosted || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ Message: message, Username: user, DatePosted: date });
    onClose();
  };

return (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h2 className="text-lg font-bold mb-4">
        {defaultCommentData ? 'Edit Comment' : 'Add Comment'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Comment Text Field */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-900">
            Comment
          </label>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue focus:ring-blue sm:text-sm"
            required
          />
        </div>

        {/* Username Field */}
        <div className="mt-4">
          <label htmlFor="user" className="block text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            id="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue focus:ring-blue sm:text-sm"
            required
          />
        </div>

        {/* Date Field */}
        <div className="mt-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-900">
            Date Posted
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue focus:ring-blue sm:text-sm"
            required
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-x-2">
          <button type="button" className="text-gray-900 font-semibold" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue text-white font-semibold px-4 py-2 rounded-md hover:bg-blue"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);
};


export default CommentForm;
