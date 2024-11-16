import config from "./config/config.js";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
