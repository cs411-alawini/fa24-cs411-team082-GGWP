import React, { useState } from "react";
import { Comments, addComment, deleteComment, updateComment } from "../../services/services";
import CommentForm from "../CommentForm/CommentForm";

// format date from string - dateposted
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
};

interface CommentTimelineProps {
    comments: Comments[];
    onDelete: (CommentId: number) => void;
    onAdd: (newComment: Comments) => void;
    onUpdate: (updatedComment: Comments) => void;
    Message: string;
    Username: string;
    DatePosted: string;
}

const CommentTimeline: React.FC<CommentTimelineProps> = ({ comments, onDelete, Message, Username, DatePosted }) => {
    const [isFormVisible, setIsFormVisible] = React.useState(false);
    const [commentToEdit, setCommentToEdit] = React.useState<Comments | null>(null);
    
    const handleAddComment = () => {
        setCommentToEdit(null);
        setIsFormVisible(true);
    };
    
    const handleEditComment = (updatedComment: Comments) => {
        setCommentToEdit(updatedComment);
        setIsFormVisible(true);
    };


    const handleDelete = async (CommentId: number) => {
        await deleteComment(CommentId);
        onDelete(CommentId);
    };

    const handleFormSubmit = async (commentData: { cMessage: string; cUser: string; cDate: string }) => {
        const completeCommentData = {
            ...commentData,
            Message: Message,
            Username: Username,
            DatePosted: DatePosted
        };

        if (commentToEdit) {
            await updateComment({ ...commentToEdit, ...completeCommentData }); // right overwrites left
        } else {
            await addComment(completeCommentData);
        }

        setCommentToEdit(null);
        setIsFormVisible(false);    
    };



    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Comments</h1>
                {/* Button to add a new comment */}
                <button 
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-gray">
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
                            <p className="text-slate-500">
                                {comment.Message ? comment.Message : "n/a"}
                            </p>

                            
                            <div className="flex space-x-4">
                                {/* EDIT BUTTON */}
                                <button
                                    onClick={(event) => handleEditComment(comment)}
                                    // onClick={handleEditComment(comment)}
                                    className="text-blue hover:text-gray">
                                    Edit
                                </button>
                                {/* DELETE BUTTON */}
                                <button 
                                    onClick={() => handleDelete(comment.CommentId)}
                                    className="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {comments.length === 0 && (
                <p className="text-lg text-slate-500">No comments yet!</p>
            )}
            {
                isFormVisible && (
                    <CommentForm onClose={() => setIsFormVisible(false)} 
                    onSubmit={( 
                        { Message, Username, DatePosted }) => {
                            console.log({ Message, Username, DatePosted });
                            setIsFormVisible(false);
                        }
                    } defaultCommentData={commentToEdit ? { Message: commentToEdit.Message, Username: commentToEdit.Username, DatePosted: commentToEdit.DatePosted } : undefined}
 />
                )
        
            }
        </div>
    );
};

export default CommentTimeline;
