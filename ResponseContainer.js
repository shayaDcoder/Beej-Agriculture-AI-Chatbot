import React from 'react';

function ResponseContainer({ response, chatHistory, isTtsEnabled }) {
  return (
    <div className="response-container">
      <div dangerouslySetInnerHTML={{ __html: response }} />
      <div>
        {chatHistory.map((entry, index) => (
          <div key={index} className="chat-entry">
            <p><strong>You:</strong> {entry.userQuery}</p>
            <p><strong>Bot:</strong> {entry.botReply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponseContainer;
