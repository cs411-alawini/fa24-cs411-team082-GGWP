import { Router, Request, Response } from "express";
import { getAllStates } from "../services/database";

const router = Router();

// Fetch all states
router.get("/", async (req: Request, res: Response) => {
    try {
        const states = await getAllStates();
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: "Error fetching states data." });
    }
});

export default router;
