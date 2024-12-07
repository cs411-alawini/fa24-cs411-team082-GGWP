// import { usersData, statesData, recreationData, commentsData, discountsData, favoritesData } from "./mockData";
import axios from "axios";

export interface Users {
    Username: string;     // Unique username
    Email: string;        // Email address of the user
}

export interface States {
    StateName: string;    // Name or abbreviation of the state
    CityCount: number;    // Number of cities in the state
    Region: string;       // Region the state belongs to (e.g., West, Northeast)
    Population: number;   // Population of the state
    TotalArea: number;    // Total area of the state in square miles or km²
}

export interface Recreation {
    RecName: string;      // Name of the recreational activity
    RecType: string;      // Type of the activity (e.g., park, museum)
    StateName: string;    // The state where it is located
    Address: string;      // Address of the location
}

export interface Favorites {
    Username: string;     // Username of the person who favorited the activity
    RecName: string;      // Name of the recreation that is favorited
    Status: boolean;      // Status of the favorite (e.g., active/inactive)
}

export interface Discounts {
    DiscountId: number;   // Unique identifier for the discount
    RecName: string;      // Recreation name associated with the discount
    DiscountType: string; // Type of discount (e.g., student, senior)
    Description: string;  // Description of the discount
}

export interface Comments {
    CommentId: number;    // Unique identifier for the comment
    Username: string;
    RecName: string;      // Associated recreation name
    Message: string;      // The content of the comment
    DatePosted: string;   // Date the comment was posted
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3007/';

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const searchUserData = (Username: string): Promise<Users[]> => {
    return httpClient
        .get(`/api/users`, {
            params: { search: Username },
        })
        .then((response) => response.data)
};


export const searchCommentData = (searchData: string): Promise<Comments[]> => {
    return httpClient
        .get(`/api/comments`, {
            params: { search: searchData },
        })
        // .get(`/api/comments/${encodeURIComponent(searchData)}`)
        .then((response) => response.data)
};

export const getAllRecData = (): Promise<Recreation[]> => {
    return httpClient
        .get(`/api/recreation`)
        .then((response) => response.data);
};

export const searchRecData = (query: string): Promise<Recreation[]> => {
    return httpClient
        // .get(`/api/recreation`, {
        //     params: { search: query },
        // })
        .get(`/api/recreation/${(query)}`)
        .then((response) => response.data)
};



export const getRecreationByRecName = (RecName: string): Promise<Recreation | undefined> => {
    // Ensure that RecName is encoded here, just in case it's not properly handled by React Router
    const encodedRecName = encodeURIComponent(RecName);
    console.log("Encoded RecName:", encodedRecName);  // Log the encoded value to verify
    return httpClient
        .get(`/api/recreation/${encodedRecName}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log("Error fetching recreation:", error); 
            throw error; 
        });
};

export const addDiscount = (newDiscount: Omit<Discounts, 'DiscountId'>): Promise<Discounts> => {
    return httpClient
        .post(`/api/discounts`, newDiscount)
        .then((response) => response.data);
};
  
export const updateDiscount = (updatedDiscount: Discounts): Promise<void> => {
    return httpClient
    .put(`/api/discounts/${updatedDiscount.DiscountId}`, updatedDiscount)
    .then((response) => response.data);
}

export const deleteDiscount = (DiscountId: number): Promise<void> => {
    return httpClient
    .delete(`/api/discounts/${DiscountId}`)
    .then((response) => response.data);
}

export const addComment = (newComment: {Message: string, Username: string, DatePosted: string}): Promise<Comments> => {
    return httpClient
    .post(`/api/comments`, newComment)
    .then((response) => response.data);
};

// Function to update an existing comment
export const updateComment = (updatedComment: Comments): Promise<void> => {
    return httpClient
    .put(`/api/comments/${updatedComment.CommentId}`, updatedComment)
    .then((response) => response.data);
};

export const deleteComment = (CommentId: number): Promise<void> => {
    return httpClient
    .delete(`/api/comments/${CommentId}`)
    .then((response) => response.data);
};
