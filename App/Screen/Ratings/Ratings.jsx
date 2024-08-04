import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { getFirestore, doc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';

const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const { user } = useUser();

  const db = getFirestore(app);

  
  const handleStarRating = (newRating) => {
    setRating(newRating);
  };

  const submitRating = async () => {
    try {
      await setDoc(doc(db, "rating", "rating"), {
        email: user?.primaryEmailAddress?.emailAddress,
        ratings: rating
      });
     
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index}  value={rating} onPress={() => handleStarRating(index)} style={styles.starButton}>
            <MaterialIcons
              name={index <= rating ? 'star' : 'star-border'}
              size={40}
              color={index <= rating ? '#FFD700' : '#CCCCCC'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
        <Text style={styles.submitText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starButton: {
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default RatingScreen;
