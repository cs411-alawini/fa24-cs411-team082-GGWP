// connection to GCP
import pool from "./connection";
import { RowDataPacket } from "mysql2/promise";

// tables
import { Recreation } from "../model/Recreation";
import { Comments } from "../model/Comments";
import { Discounts } from "../model/Discounts";
import { Favorites } from "../model/Favorites";
import { States } from "../model/States";
import { Users } from "../model/Users";

// Recreation
export async function getAllRecreations(): Promise<Recreation[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Recreation");
    return rows as Recreation[]; // Type assertion to cast RowDataPacket[] to Recreation[]
}

export async function getRecreationByName(name: string): Promise<Recreation | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Recreation WHERE RecName LIKE ?", [`%${name}%`]
    );
    return rows[0] as Recreation | undefined;
}   

// Comments

export async function renameCommentColumn() {
    try {
        await pool.query("ALTER TABLE Comments RENAME COLUMN Comment TO Message;");
        console.log("Column renamed successfully.");
    } catch (error) {
        console.error("Error renaming column:", error);
    }
}

export async function getAllComments(): Promise<Comments[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Comments ORDER BY CommentId LIMIT 1, 1000000;");
    return rows as Comments[];
}

export async function getCommentsByRecreation(recName: string): Promise<Comments[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Comments WHERE RecName = ?",
        [recName]
    );
    return rows as Comments[];
}

export async function addComment(newComment: Comments): Promise<void> {
    const { CommentId, RecName, Message, DatePosted } = newComment;
    await pool.query(
        "INSERT INTO Comments (CommentId, RecName, Message, DatePosted) VALUES (?, ?, ?, ?)",
        [CommentId, RecName, Message, DatePosted]
    );
}

export async function deleteCommentById(commentId: number): Promise<void> {
    await pool.query("DELETE FROM Comments WHERE CommentId = ?", [commentId]);
}

// Discounts
export async function getAllDiscounts(): Promise<Discounts[]> {
    const [rows] = await pool.query("SELECT * FROM Discounts");
    return rows as Discounts[];
}

export async function getDiscountsByRecreation(recName: string): Promise<Discounts[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Discounts WHERE RecName = ?",
        [recName]
    );
    return rows as Discounts[];
}

export async function addDiscount(discount: Discounts): Promise<void> {
    const { DiscountId, RecName, DiscountType, Description } = discount;
    await pool.query(
        "INSERT INTO Discounts (DiscountId, RecName, DiscountType, Description) VALUES (?, ?, ?, ?)",
        [DiscountId, RecName, DiscountType, Description]
    );
}

export async function updateDiscount(discountId: number, updatedDiscount: Discounts): Promise<void> {
    const { RecName, DiscountType, Description } = updatedDiscount;
    await pool.query(
        `UPDATE Discounts
         SET RecName = ?, DiscountType = ?, Description = ?
         WHERE DiscountId = ?`,
        [RecName, DiscountType, Description, discountId]
    );
}

export async function deleteDiscount(discountId: number): Promise<void> {
    await pool.query("DELETE FROM Discounts WHERE DiscountId = ?", [discountId]);
}

// Favorites
export async function getAllFavorites(): Promise<Favorites[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Favorites");
    return rows as Favorites[];
}

export async function getFavoritesByUser(username: string): Promise<Favorites[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Favorites WHERE Username = ?",
        [username]
    );
    return rows as Favorites[];
}

export async function updateFavoriteStatus(username: string, recName: string, status: boolean): Promise<void> {
    await pool.query(
        `UPDATE Favorites
         SET Status = ?
         WHERE Username = ? AND RecName = ?`,
        [status, username, recName]
    );
}

// States
export async function getAllStates(): Promise<States[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM States");
    return rows as States[];
}

// Users
export async function getAllUsers(): Promise<Users[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM Users");
    return rows as Users[];
}

export async function getUserByUsername(username: string): Promise<Users | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM Users WHERE Username = ?",
        [username]
    );
    return rows[0] as Users | undefined;
}
