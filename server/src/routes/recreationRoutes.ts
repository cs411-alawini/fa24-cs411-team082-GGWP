import { Router, Request, Response } from "express";
import { getAllRecreations, getRecreationByName } from "../services/database";

const router = Router();

// Fetch all recreation activities
router.get("/", async (req: Request, res: Response) => {
    try {
        const recreation = await getAllRecreations();
        res.status(200).json(recreation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recreation data." });
    }
});

// Fetch recreation by name
router.get("/:name", async (req: Request, res: Response) => {
    const recName = req.params.name;
    console.log(`Received recName: ${recName}`);  // Log the received recName

    try {
        const recreation = await getRecreationByName(recName);
        if (recreation) {
            res.status(200).json(recreation);
        } else {
            res.status(404).json({ message: `Recreation '${recName}' not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching recreation data." });
    }
});

export default router;
