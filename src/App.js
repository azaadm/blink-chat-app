import React, { useState } from "react";
import moment from "moment";
import "../src/styles/App.css";
import jsonData from "../src/data/chatHistory.json";

function App() {
  // State variables
  const [conversations, setConversations] = useState(jsonData);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [error, setError] = useState("");

  // Find the selected conversation based on its ID
  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Function to handle clicking on a conversation
  const handleSelectedConversation = (conv) => {
    setSelectedConversationId(conv.id);
    setNewMessage("");
    setEditMode(false);
  };

  // Function to handle clicking on a message for editing
  const handleEditMessage = (message) => {
    setNewMessage(message.text);
    setEditMode(true);
    setEditMessageId(message.id);
  };

  // Function to handle sending or editing a message
  const handleSendMessage = () => {
    try {
      if (!selectedConversationId)
        throw new Error("Please select a conversation.");
      if (newMessage.trim() === "") throw new Error("Message cannot be empty.");

      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                messages: editMode
                  ? // If in edit mode, map over each message to update the selected message or leave others unchanged
                    conv.messages.map((msg) =>
                      msg.id === editMessageId
                        ? {
                            ...msg,
                            text: newMessage,
                            last_updated: moment().toISOString(),
                          }
                        : msg
                    )
                  : // If not in edit mode, add a new message to the conversation
                    [
                      ...conv.messages,
                      {
                        id: conv.messages.length + 1,
                        text: newMessage,
                        last_updated: moment().toISOString(),
                      },
                    ],
                last_updated: moment().toISOString(), // Update the last_updated timestamp for the conversation
              }
            : conv
        )
      );

      setNewMessage("");
      setEditMode(false);
      setEditMessageId(null);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Render the application
  return (
    <div className="App">
      {/* Left side: Conversation list */}
      <div className="conversation-list">
        <h2>Conversations</h2>
        <ul>
          {/* Map over each conversation to display in the list */}
          {conversations.map((conv) => (
            <li key={conv.id} onClick={() => handleSelectedConversation(conv)}>
              {conv.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Messages */}
      <div className="messages">
        <h2>Messages</h2>
        {selectedConversation ? (
          <>
            {/* Display messages and reply section */}
            <ul>
              {/* Map over each message in the selected conversation to display in the list */}
              {selectedConversation.messages.map((msg) => (
                <li key={msg.id} onClick={() => handleEditMessage(msg)}>
                  <p className="conversation-date">
                    {moment(msg.last_updated).format("LLL")}
                  </p>
                  <p className="conversation-text">{msg.text}</p>
                </li>
              ))}
            </ul>
            {/* Reply section with input field, button, and error display */}
            <div className="reply-section">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter Message"
              />
              <button onClick={handleSendMessage}>
                {editMode ? "Edit" : "Send"}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </>
        ) : (
          // Display message if no conversation is selected
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
}

export default App;
