import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  LayoutAnimation, // Import to handle smooth animation
} from "react-native";

interface ChatMessage {
  id: string;
  role: "user" | "gpt";
  content: string;
}

const fetchChatGPTResponse = async (message: string) => {
  if (!message.trim()) return "Please provide a valid message!";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Something went wrong!";
  }
};

const AskMe: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // Listen for keyboard events to calculate height
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        // Smoothly animate layout changes
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setKeyboardHeight(e.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Reset padding when keyboard is hidden
        setKeyboardHeight(0);
      },
    );

    return () => {
      // Cleanup listeners on component unmount
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Mock GPT Response (Replace this with your API integration later)
    const mockResponse = `GPT Response to prompt: "${userInput}"`;

    // const response = await fetchChatGPTResponse(userInput);

    // Update chat history with proper types
    setChatHistory((prev) => [
      ...prev,
      { id: `${prev.length + 1}`, role: "user", content: userInput },
      { id: `${prev.length + 2}`, role: "gpt", content: mockResponse },
    ]);

    setUserInput(""); // Clear input field
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <Text style={styles.title}>Welcome to ChatEase 🤖</Text>
          <Text style={styles.subtitle}>
            Type your questions below. Note: History will be cleared when you
            leave the app. Thanks!!
          </Text>

          {/* Chat List */}
          <FlatList
            data={chatHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.role === "user" ? styles.userMessage : styles.gptMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
            style={styles.chatList}
          />

          {/* Input Field */}
          <View
            style={[
              styles.inputContainer,
              { marginBottom: keyboardHeight > 0 ? keyboardHeight / 3 : 20 }, // Apply dynamic padding
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Ask ChatGPT..."
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  chatList: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
  },
  gptMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e3e5",
  },
  messageText: {
    fontSize: 16,
  },
  inputScroll: {
    paddingBottom: 20, // Provide space for keyboard
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AskMe;
