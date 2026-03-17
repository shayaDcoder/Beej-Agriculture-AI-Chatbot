import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onVoiceInput }) => {
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };

      recog.onerror = (event) => {
        let error = 'Error listening. Please try again.';
        if (event.error === 'network') {
          error = 'Network error. Please check your internet connection.';
        }
        setErrorMessage(error);
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      setErrorMessage('Speech recognition is not supported in this browser.');
    }
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognition && !isListening) {
      setErrorMessage('');
      recognition.start();
      setIsListening(true);
    } else if (!recognition) {
      setErrorMessage('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <div className="voice-input">
      <img
        src="/static/mic.png"
        alt="Microphone"
        className="microphone-icon"
        onClick={startListening}
      />
      {isListening && <p>Listening...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default VoiceInput;
