import express from "express";
import commentsRoutes from "./src/routes/commentsRoutes";
import discountsRoutes from "./src/routes/discountsRoutes";
import favoritesRoutes from "./src/routes/favoritesRoutes";
import recreationRoutes from "./src/routes/recreationRoutes";
import statesRoutes from "./src/routes/statesRoutes";
import usersRoutes from "./src/routes/usersRoutes";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/comments", commentsRoutes);
app.use("/api/discounts", discountsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/recreation", recreationRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/users", usersRoutes);



// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
