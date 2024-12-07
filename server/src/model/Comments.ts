// Comments.ts
export interface Comments {
    CommentId: number;    // Unique identifier for the comment
    Username: string;
    RecName: string;      // Associated recreation name
    Messages: string;      // The content of the comment
    DatePosted: string;   // Date the comment was posted
}
