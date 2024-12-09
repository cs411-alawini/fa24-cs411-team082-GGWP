import React, { useState } from "react";
import { Comments, addComment, deleteComment, updateComment } from "../../services/services";
import CommentForm from "../CommentForm/CommentForm";

// Utility: Format date from string
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
};

interface CommentTimelineProps {
    comments: Comments[];
    onDelete: (CommentId: number) => void;
    onAdd: (newComment: Comments) => void;
    onUpdate: (updatedComment: Comments) => void; 
}


const CommentTimeline: React.FC<CommentTimelineProps> = ({
    comments,
    onDelete,
    onAdd,
    onUpdate,
}) => {
const [isFormVisible, setIsFormVisible] = useState(false);
const [commentToEdit, setCommentToEdit] = useState<Comments | null>(null);

// Handlers
const handleAddComment = () => {
    setCommentToEdit(null);
    setIsFormVisible(true);
};

const handleEditComment = (updatedComment: Comments) => {
    setCommentToEdit(updatedComment);
    setIsFormVisible(true);
};

// const handleDelete = async (CommentId: number) => {
//     if (!CommentId) {
//         console.error("CommentId is missing.");
//         return;
//     }
//     await deleteComment(CommentId);
//     onDelete(CommentId);
// };
const handleDelete = async (CommentId: number) => {
    await deleteComment(CommentId);
    onDelete(CommentId); // Notify parent to remove the comment from the state
};


const handleFormSubmit = async (commentData: { Message: string; Username: string; DatePosted: string }) => {
    if (commentToEdit) {
        const updatedComment = { ...commentToEdit, ...commentData };
        await updateComment(updatedComment);
        onUpdate(updatedComment); // Notify parent to update the state
    } else {
        const newComment = await addComment({
            ...commentData,
        });
        onAdd(newComment); // Notify parent to add the new comment to the state
        // const maxCommentId = Math.max(...comments.map(comment => comment.CommentId), 0);
        // const newCommentId = maxCommentId + 1;

        // // Create the new comment with the required properties, including RecName
        // const newComment: Comments = {
        //     CommentId: newCommentId,
        //     Message: commentData.Message,
        //     Username: commentData.Username,
        //     DatePosted: commentData.DatePosted,
        //     RecName: "Some default or provided recommendation name", // Replace with actual data as needed
        // };

        // // Add the new comment and notify the parent
        // onAdd(newComment); // Notify parent to add the new comment to the state

        // // Optionally send the new comment to the backend if needed
        // await addComment(newComment);


    }

    setCommentToEdit(null);
    setIsFormVisible(false);
};

console.log("here: ", comments); // Check if CommentId exists for all comments

return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Comments</h1>
                <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-gray"
                >
                    + New Comment
                </button>
            </div>

            {/* Timeline List */}
            <ul
                aria-label="Comment Feed"
                role="feed"
                className="relative flex flex-col gap-12 py-12 pl-6 text-sm before:absolute before:top-0 before:left-6 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:top-6 after:left-6 after:bottom-6 after:-translate-x-1/2 after:border after:border-slate-200"
            >
                {comments.map((comment) => (
                    <li
                        key={comment.CommentId}
                        role="article"
                        className="relative pl-6 before:absolute before:left-0 before:top-2 before:z-10 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-emerald-500 before:ring-2 before:ring-white"
                    >
                        <div className="flex flex-col flex-1 gap-2">
                            <h4 className="text-base font-medium leading-7 text-emerald-500">
                                {formatDate(comment.DatePosted)}
                            </h4>
                            <p className="text-black">
                                {comment.Username}
                            </p>

                            <p className="text-slate-500">
                                {comment.Message ? comment.Message : "n/a"}
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEditComment(comment)}
                                    className="text-blue hover:text-gray"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.CommentId)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* No Comments Available */}
            {comments.length === 0 && (
                <p className="text-lg text-slate-500">No comments yet!</p>
            )}

            {/* Form */}
            {isFormVisible && (
                <CommentForm
                    onClose={() => setIsFormVisible(false)}
                    onSubmit={handleFormSubmit}
                    defaultCommentData={
                        commentToEdit
                            ? {
                                  Message: commentToEdit.Message,
                                  Username: commentToEdit.Username,
                                  DatePosted: commentToEdit.DatePosted,
                              }
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default CommentTimeline;
