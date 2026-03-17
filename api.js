import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat';

export const chatWithBot = async (query) => {
    try {
        const response = await axios.post(API_URL, { query });
        return response.data.response;
    } catch (error) {
        console.error("Error chatting with bot:", error);
        return "Error fetching data. Please try again later.";
    }
};
