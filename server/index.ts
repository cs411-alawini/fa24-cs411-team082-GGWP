import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (your existing routes setup)
import commentsRoutes from './src/routes/commentsRoutes';
import discountsRoutes from './src/routes/discountsRoutes';
import favoritesRoutes from './src/routes/favoritesRoutes';
import recreationRoutes from './src/routes/recreationRoutes';
import statesRoutes from './src/routes/statesRoutes';
import usersRoutes from './src/routes/usersRoutes';

app.use("/api/comments", commentsRoutes);
app.use("/api/discounts", discountsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/recreation", recreationRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/users", usersRoutes);

// Log all endpoints after routes are registered
console.log(listEndpoints(app));


app.listen(PORT, () => {
  console.log(`Project running on http://localhost:${PORT}`);
});