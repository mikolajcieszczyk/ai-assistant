import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  openaiKey: process.env.OPENAI_API_KEY,
};

export default config;
