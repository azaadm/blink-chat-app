import React from "react";
import { act, render, fireEvent } from "@testing-library/react";
import App from "../App";

// Mock conversation data for testing
jest.mock("../data/chatHistory.json", () => [
  {
    id: "5f58bcd7a88fab5f34df94d6",
    name: "conversation 1",
    last_updated: "2020-05-04T03:37:18",
    messages: [
      {
        id: "5f58bcd7352396fffbae8b6e",
        text: "Lorem labore ea et",
        last_updated: "2020-05-04T03:37:18",
      },
      {
        id: "5f58bcd7352396fffbae8b63",
        text: "ex excepteur deserunt laboris",
        last_updated: "2020-05-04T03:37:18",
      },
    ],
  },
]);

describe("App Component", () => {
  test("renders App component", () => {
    render(<App />);
  });

  test("displays conversation list", () => {
    const { getByText } = render(<App />);
    const conversation = getByText("Conversations");
    expect(conversation).toBeInTheDocument();
  });

  test("selects a conversation and displays messages", async () => {
    const { getByText } = render(<App />);
    const conversationItem = getByText("conversation 1");

    // Use act to wait for the state update
    await act(async () => {
      fireEvent.click(conversationItem);
    });

    // Rerender the component to reflect the state changes
    render(<App />);

    const message1 = getByText("Lorem labore ea et");
    const message2 = getByText("ex excepteur deserunt laboris");

    expect(message1).toBeInTheDocument();
    expect(message2).toBeInTheDocument();
  });

  test("sends a new message", () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const conversationItem = getByText("conversation 1");
    fireEvent.click(conversationItem);

    const inputField = getByPlaceholderText("Enter Message");
    const sendButton = getByText("Send");

    fireEvent.change(inputField, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    const newMessage = getByText("Hello!");
    expect(newMessage).toBeInTheDocument();
  });

  test("edits an existing message", () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    const conversationItem = getByText("conversation 1");
    fireEvent.click(conversationItem);

    const messageItem = getByText("Lorem labore ea et");
    fireEvent.click(messageItem);

    const inputEditField = getByPlaceholderText("Enter Message");
    fireEvent.change(inputEditField, { target: { value: "Edited message" } });
    const editButton = getByText("Edit");
    fireEvent.click(editButton);

    const editedMessage = getByText("Edited message");

    expect(editedMessage).toBeInTheDocument();
  });
});
