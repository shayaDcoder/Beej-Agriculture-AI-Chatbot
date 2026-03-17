import React, { useState } from 'react';
import axios from 'axios';

function ChatForm({ setResponse, setLoading }) {
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUserInput = async (userInput) => {
    if (userInput.length > 200) {
      setErrorMessage('Input exceeds maximum length of 200 characters.');
      return;
    }
    const sanitizedInput = userInput.replace(/<\/?[^>]+(>|$)/g, '');

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        query: sanitizedInput,
      });

      if (response.data && response.data.response) {
        setResponse(response.data.response);
      } else {
        setResponse('No response from server');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponse('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
      setUserInput('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUserInput(userInput);
  };

  return (
    <form id="query-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="user-input"
        placeholder="Ask a question..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit" className="neon-button">
        Ask
      </button>
    </form>
  );
}

export default ChatForm;
