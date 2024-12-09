import { Router, Request, Response } from "express";
import { getAllDiscounts, addDiscount } from "../services/database";
import { Discounts } from "../model/Discounts";
import { updateDiscount } from "../services/database";
import { deleteDiscount } from "../services/database";


const router = Router();

// Fetch all discounts
router.get("/", async (req: Request, res: Response) => {
    try {
        const discounts = await getAllDiscounts();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching discounts." });
    }
});

// Add a new discount
router.post("/", async (req: Request, res: Response) => {
    try {
        // Extract data from request body and validate it
        const { DiscountId, RecName, DiscountType, Description } = req.body;
        
        // Construct new discount object based on the request body
        const newDiscount: Discounts = { DiscountId, RecName, DiscountType, Description };
        
        // Call the service function to add the discount
        await addDiscount(newDiscount);
        
        // Send success response
        res.status(201).json({ message: "Discount added successfully", newDiscount });
    } catch (error) {
        console.error(error); // Log the error for debugging
    }
});



// Update an existing discount
router.put("/:id", async (req: Request, res: Response) => {
    const discountId = parseInt(req.params.id); // Get the DiscountId from the URL
    const updatedDiscount: Discounts = req.body; // Get updated data from request body

    try {
        await updateDiscount(discountId, updatedDiscount); // Update the discount in the database
        res.status(200).json({ message: "Discount updated successfully", updatedDiscount });
    } catch (error) {
        res.status(500).json({ message: "Error updating discount.", error });
    }
});


router.delete("/:id", async (req: Request, res: Response) => {
    const discountId = parseInt(req.params.id); // Parse the discount ID from the URL

    try {
        await deleteDiscount(discountId); // Call the function to delete the discount
        res.status(200).json({ message: `Discount with ID ${discountId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: `Error deleting discount with ID ${discountId}`, error });
    }
});

export default router;
