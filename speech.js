import React, { useState, useEffect } from 'react';

const SpeechRecognition = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        onResult(transcript);
        setIsListening(false);
      };

      recognizer.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };

      setRecognition(recognizer);
    } else {
      console.warn('Speech Recognition API is not supported in this browser.');
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div>
      <img
        src="/static/mic.png" 
        alt="Microphone"
        className={isListening ? "microphone-icon listening" : "microphone-icon"}
        onClick={isListening ? stopListening : startListening}
      />
      {isListening && <p>Listening...</p>}
    </div>
  );
};

export default SpeechRecognition;
