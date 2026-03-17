import React, { useState, useEffect, useCallback } from 'react';
import ChatForm from './components/ChatForm';
import LoadingMessage from './components/LoadingMessage';
import ResponseContainer from './components/ResponseContainer';
import VoiceInput from './components/voiceInput';
import './index.css';

function App() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [voices, setVoices] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechSynth(synth);

    const loadVoices = () => {
      const voicesList = synth.getVoices();
      setVoices(voicesList);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakResponse = useCallback((text) => {
    if (speechSynth && voices.length > 0) {
      const utterance = new SpeechSynthesisUtterance(removeFormatting(text));
      const marathiVoice = voices.find((v) => v.lang === 'mr-IN');
      const englishVoice =
        voices.find((v) => v.name.includes('Google UK English Female')) || voices[0];
      utterance.voice = marathiVoice || englishVoice;
      utterance.rate = 1;
      speechSynth.speak(utterance);
    }
  }, [speechSynth, voices]);

  useEffect(() => {
    if (isTtsEnabled && response) {
      speakResponse(response);
    }
  }, [isTtsEnabled, response, speakResponse]);

  const toggleTts = () => {
    setIsTtsEnabled(!isTtsEnabled);
    if (isTtsEnabled && speechSynth) {
      speechSynth.cancel();
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '    - ')
      .replace(/#/g, '')
      .replace(/\n/g, '<br>');
  };

  const removeFormatting = (text) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '');
  };

  const handleVoiceInput = (text) => {
    sendChatQuery(text);
  };

  const sendChatQuery = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      setIsLoading(false);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { userQuery: query, botReply: data.response },
      ]);

      setResponse(data.response);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching response:', error);
      // Handle error scenario
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <img id="chatbot-image" src="/static/chatbot.png" alt="Chatbot" />
          <h1 className="neon-text">Beej</h1>
          {isLoading ? (
            <LoadingMessage />
          ) : (
            <ResponseContainer
              response={formatResponse(response)}
              chatHistory={chatHistory}
              isTtsEnabled={isTtsEnabled}
            />
          )}
          <div className="sound-icon" onClick={toggleTts}>
            <img
              src={
                isTtsEnabled
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFabEiHHqt0jl09iOO1q7fNCWI8jzOXUc8BA&s'
                  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5L6vxKLwTGk6YG7FeyOuosmx11EItI-7Z8Q&s'
              }
              alt="Sound toggle"
            />
          </div>
        </div>
      </div>
      <div className="form-container">
        <VoiceInput onVoiceInput={handleVoiceInput} />
        <ChatForm
          setResponse={(text) => {
            setIsLoading(false);
            setResponse(text);
          }}
          setLoading={setIsLoading}
        />
      </div>
    </div>
  );
}

export default App;
