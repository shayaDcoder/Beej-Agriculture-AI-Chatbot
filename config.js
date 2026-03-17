import dotenv from 'dotenv';

dotenv.config();

const config = {
  geminiApiKey: process.env.REACT_APP_GEMINI_API_KEY,
};

export default config;
