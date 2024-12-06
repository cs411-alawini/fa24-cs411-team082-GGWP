import { Router, Request, Response } from "express";
import { getAllUsers, getUserByUsername } from "../services/database"; // Use functions from the database

const router = Router();

// Fetch all users
router.get("/", async (req: Request, res: Response) => {
    try {
        // Call the database function to fetch all users
        const allUsers = await getAllUsers();
        res.status(200).json(allUsers); // Return all users
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Error fetching all users." });
    }
});

// Fetch user by username
router.get("/:username", async (req: Request, res: Response) => {
    const username = req.params.Username;
    try {
        // Call the database function to fetch a user by username
        const user = await getUserByUsername(username);
        if (user) {
            res.status(200).json(user); // Return the user data
        } else {
            res.status(404).json({ message: `User '${username}' not found.` });
        }
    } catch (error) {
        console.error(`Error fetching user '${username}':`, error);
        res.status(500).json({ message: "Error fetching user data." });
    }
});

export default router;
