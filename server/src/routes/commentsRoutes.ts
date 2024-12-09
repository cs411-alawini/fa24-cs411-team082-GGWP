import { Router, Request, Response } from "express";
import { updateComments, getAllComments, getCommentsByRecreation, addComment, deleteCommentById } from "../services/database";
import type { Comments } from "../model/Comments";
import { autoIncrementCommentId } from "../services/database";

const router = Router();



// router.post("/", async (req: Request, res: Response) => {
//   const newComment: Comments = req.body;
//   await addComment(newComment);
//   res.status(201).json({ message: "Comment successfully added.", newComment});
//   // Generate CommentId using Date.now()
// });

router.post("/", async (req: Request, res: Response) => {
  const newComment: Comments = req.body;

  try {
    await addComment(newComment);
    // res.status(201).json({ message: "Comment successfully added.", newComment});
  } catch (error) {
    res.status(500).json({ message: "Error adding comment from router" });
  }
});




router.get("/", async (req: Request, res: Response) => {
  try {
    const comments = await getAllComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching all comments." });
  }
});

router.get("/:recName", async (req: Request, res: Response) => {
  const recName = req.params.recName;
  try {
    const comments = await getCommentsByRecreation(recName);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments." });
  }
});

router.put("/:CommentId", async (req: Request, res: Response) => {
    const CommentId = parseInt(req.params.CommentId, 10);
    const updatedComment: Comments = req.body;
  
    // Validate inputs
    if (!CommentId || !updatedComment || !updatedComment.Message) {
      console.log("Invalid data provided:", { CommentId, updatedComment });
      res.status(400).json({ message: "Invalid data provided" });
      return; // Stop execution after responding
    }
  
    updatedComment.CommentId = CommentId;
  
    try {
      console.log("Received update for comment:", updatedComment);
      const result = await updateComments(updatedComment);
  
      if (result) {
        // If the update is successful and we have an updated comment, return it
        res.status(200).json(result);
      } else {
        // If no comment was found to update
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Error updating comment" });
    }
  });
  

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await deleteCommentById(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment" });
  }
});

export default router;
