
import pool from "./connection";
import { RowDataPacket } from "mysql2/promise";
import { v4 as uuidv4 } from 'uuid';
// tables
import { Recreation } from "../model/Recreation";
import { Comments } from "../model/Comments";
import { Discounts } from "../model/Discounts";
import { Favorites } from "../model/Favorites";
import { States } from "../model/States";
import { Users } from "../model/Users";
import { OkPacket } from 'mysql2';

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

export async function renameCommentColumn(): Promise<void> {
    const connection = await pool.getConnection();
    try {
      console.log("Renaming column 'Comment' to 'Message' if it exists...");
      await connection.query(`
        ALTER TABLE Comments CHANGE COLUMN Comment Message VARCHAR(255)
      `);
      console.log("Column 'Comment' successfully renamed to 'Message'.");
    } catch (error: any) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log("Column 'Comment' does not exist, skipping rename.");
      } else {
        console.error("Error renaming column:", error);
        throw error;
      }
    } finally {
      connection.release();
    }
  }
  
  export async function initializeDatabase(): Promise<void> {
    console.log("Initializing database...");
    await renameCommentColumn();
    console.log("Database initialization complete.");
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

export async function autoIncrementCommentId() {
    try {
      await pool.query("ALTER TABLE Comments MODIFY COLUMN CommentId INT AUTO_INCREMENT PRIMARY KEY;");
      console.log("Column altered successfully.");
    } catch (error) {
      console.error("Error altering column:", error);
    }
  }

export async function addComment(newComment: Comments): Promise<void> {
    const { Username, RecName, Message, DatePosted } = newComment;
  
    console.log("Attempting to insert comment:", newComment);
  
    try {
      await pool.query(
        `INSERT INTO Comments (Username, RecName, Message, DatePosted) VALUES (?, ?, ?, ?)`,
        [Username, RecName, Message, DatePosted]
      );
      console.log("Comment inserted successfully.");
    } catch (error) {
      console.error("Database error inserting comment:", error);
      throw error; // Rethrow the error to be caught by the route handler
    }
  }
  
export async function updateComments(comment: Comments): Promise<Comments | null> {
    // First, perform the UPDATE
    const [updateResult] = await pool.query(
      `UPDATE Comments
       SET Username = ?, RecName = ?, Message = ?, DatePosted = ?
       WHERE CommentId = ?`,
      [comment.Username, comment.RecName, comment.Message, comment.DatePosted, comment.CommentId]
    );
    // Now fetch the updated comment
    const [rows] = await pool.query(
      `SELECT CommentId, Username, RecName, Message, DatePosted FROM Comments WHERE CommentId = ?`,
      [comment.CommentId]
    );
  
    const updatedRows = rows as Comments[];
    if (updatedRows.length === 0) {
      return null; // Just in case the comment disappeared between update and select
    }
  
    return updatedRows[0];
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
//Transaction
interface NewUserWithComments {
    username: string;
    email: string;
    commentsRecName: string;
    commentText: string;
    datePosted: string;
}

interface RecTypeRow extends RowDataPacket {
    RecType: string;
}

interface CountRow extends RowDataPacket {
    CommentsCount: number;
}
const REQUIRED_REC_TYPE = "Park";
const MAX_COMMENTS_ALLOWED = 10;

export async function addUserWithCommentsChecks(userData: NewUserWithComments): Promise<void> {
    const connection = await pool.getConnection();
    try {
        // Set transaction isolation level and start transaction
        await connection.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
        await connection.beginTransaction();

        // Insert the new user (if not exists)
        const insertUserQuery = `
            INSERT INTO Users (Username, Email)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE Email = VALUES(Email)
        `;
        await connection.query(insertUserQuery, [userData.username, userData.email]);

        // Validate the RecType for the given recreation
        const recTypeCheckQuery = `
            SELECT r.RecType
            FROM Recreation r
            WHERE r.RecName = ?
        `;
        const [recTypeRows] = await connection.query<RecTypeRow[]>(recTypeCheckQuery, [userData.commentsRecName]);

        if (recTypeRows.length === 0) {
            throw new Error(`Recreation '${userData.commentsRecName}' does not exist.`);
        }

        const recType = recTypeRows[0].RecType;
        if (recType !== REQUIRED_REC_TYPE) {
            throw new Error(`Recreation '${userData.commentsRecName}' is not a ${REQUIRED_REC_TYPE}.`);
        }

        // Count the number of comments the user has made
        const countCommentsQuery = `
            SELECT COUNT(*) AS CommentsCount
            FROM Comments
            WHERE Username = ?
        `;
        const [countRows] = await connection.query<CountRow[]>(countCommentsQuery, [userData.username]);
        const currentCommentsCount = countRows[0].CommentsCount;

        if (currentCommentsCount >= MAX_COMMENTS_ALLOWED) {
            throw new Error(`User '${userData.username}' already has ${MAX_COMMENTS_ALLOWED} comments.`);
        }

        // Insert the new comment
        const insertCommentQuery = `
            INSERT INTO Comments (CommentId, Username, RecName, Message, DatePosted)
            VALUES (?, ?, ?, ?, ?)
        `;
        const commentId = Math.floor(Math.random() * 1000000);        
        await connection.query(insertCommentQuery, [
            commentId,
            userData.username,
            userData.commentsRecName,
            userData.commentText || 'No comment provided',
            userData.datePosted,
        ]);

        // Commit the transaction
        await connection.commit();
    } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        console.error("Transaction failed:", error); // Log detailed error for debugging
        throw error;
    } finally {
        // Release the database connection
        connection.release();
    }
}
//Stored Procedure


//Trgger 
async function createTrigger() {
    // Drop the trigger if it exists, then create it
    await pool.query(`DROP TRIGGER IF EXISTS before_insert_comment`);
    await pool.query(`
        CREATE TRIGGER before_insert_comment
        BEFORE INSERT ON Comments
        FOR EACH ROW
        SET NEW.Message = CASE
            WHEN NEW.Message IS NULL OR NEW.Message = '' THEN 'No comment provided'
            ELSE NEW.Message
        END
    `);

    console.log("Trigger 'before_insert_comment' has been created successfully.");
}

createTrigger().catch(console.error);
//constrains 


