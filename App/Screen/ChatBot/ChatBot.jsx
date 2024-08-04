// ChatBot.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';

const suggestions = [
  'Not able to cancel parking',
  'Want to extend parking time',
  'Payment issue',
  'Feedback or complaint'
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
    autoReply(newMessages);
  };

  const autoReply = (newMessages) => {
    const userMessage = newMessages[0].text.toLowerCase();
    let reply = '';

    if (userMessage.includes('cancel') || userMessage.includes('cancellation')) {
      reply = "It seems you're having trouble canceling your parking reservation. Please make sure you are trying to cancel within the allowed time frame. If the issue persists, please contact our support team for further assistance.";
    } else if (userMessage.includes('extend') || userMessage.includes('extension')) {
      reply = "To extend your parking time, please provide the new end time you'd like to extend to. If you need help with this process, our support team is here to assist you.";
    } else if (userMessage.includes('payment')) {
      reply = "It looks like you are having trouble with payment. Please check your payment details and try again. If the issue continues, please contact our support team for further help.";
    } else if (userMessage.includes('feedback') || userMessage.includes('complaint')) {
      reply = "We appreciate your feedback! Please let us know more details about your experience, and our support team will get back to you as soon as possible.";
    } else {
      reply = "How can I assist you today? If you have any questions or need help with your parking reservation, just let me know!";
    }

    setTimeout(() => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, {
        _id: Math.random().toString(),
        text: reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Support',
          avatar: 'https://placeimg.com/140/140/any'
        }
      }));
    }, 1000); // Simulate a delay for the automated response
  };

  const handleSuggestionPress = (suggestion) => {
    const message = {
      _id: Math.random().toString(),
      text: suggestion,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };
    handleSend([message]);
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionButton}
          onPress={() => handleSuggestionPress(suggestion)}
        >
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => handleSend(messages)}
        user={{
          _id: 1,
        }}
        renderFooter={renderFooter}
        renderBubble={props => <Bubble {...props} />}
        renderSend={props => <Send {...props} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  suggestionButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ChatBot;
