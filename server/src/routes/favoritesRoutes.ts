import { Router, Request, Response } from "express";
import { getAllFavorites, getFavoritesByUser, updateFavoriteStatus } from "../services/database"; // Use functions from database

const router = Router();

// Fetch all favorites
router.get("/", async (req: Request, res: Response) => {
    try {
        // Call the database function to fetch all favorites
        const allFavorites = await getAllFavorites();
        res.status(200).json(allFavorites); // Return all favorites
    } catch (error) {
        console.error("Error fetching all favorites:", error);
        res.status(500).json({ message: "Error fetching all favorites." });
    }
});

// Fetch all favorites for a user
router.get("/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
        // Call the database function to fetch favorites for a specific user
        const favorites = await getFavoritesByUser(username);
        res.status(200).json(favorites); // Return favorites for the user
    } catch (error) {
        console.error(`Error fetching favorites for user ${username}:`, error);
        res.status(500).json({ message: "Error fetching favorites." });
    }
});

// Update favorite status
router.put("/:username/:recName", async (req: Request, res: Response) => {
    const { username, recName } = req.params; // Extract parameters from the request URL
    const { status } = req.body; // Extract the `status` from the request body

    try {
        // Call the database function to update the favorite status
        await updateFavoriteStatus(username, recName, status);
        res.status(200).json({ message: "Favorite status updated successfully." });
    } catch (error) {
        console.error(
            `Error updating favorite status for user ${username}, recreation ${recName}:`,
            error
        );
        res.status(500).json({ message: "Error updating favorite status." });
    }
});

export default router;
