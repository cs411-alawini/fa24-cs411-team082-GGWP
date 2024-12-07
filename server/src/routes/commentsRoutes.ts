import { Router, Request, Response } from "express";
import { getCommentsByRecreation, addComment, getAllComments, deleteCommentById } from "../services/database"; // Import functions from database
import { Comments } from "../model/Comments";

const router = Router();

// Fetch all comments
router.get("/", async (req: Request, res: Response) => {
    try {
        console.log("Comments from DB:");

        const comments = await getAllComments(); 
        console.log("Comments from DB:", comments);

        // const modifiedComments = comments.map(comment => ({
        //     ...comment,
        //     Message: comment.Comment, 
        //     Comment: undefined, 
        // }));
        console.log("Fetched Comments:", comments); // Log data

        res.status(200).json(comments); 
    } catch (error) {
        console.error("Error fetching comments:", error);  // Log the actual error

        res.status(500).json({ message: "Error fetching all comments." });
    }
});

// Fetch comments for a specific recreation
router.get("/:recName", async (req: Request, res: Response) => {
    const recName = req.params.recName;
    try {
        const comments = await getCommentsByRecreation(recName); // Use getCommentsByRecreation from database.ts
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments." });
    }
});

// Add a new comment
router.post("/", async (req: Request, res: Response) => {
    const newComment: Comments = req.body; // Assumes the request body contains all required fields
    try {
        await addComment(newComment); // Use addComment from database.ts
        res.status(201).json({ message: "Comment added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment." });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id); // Get the comment ID from the request parameter
    try {
        await deleteCommentById(id); 
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment" }); // Error: server error
    }
});

export default router;
