import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';

const NewParkingForm = () => {
  const [location, setLocation] = useState(null);
  const [numSpots, setNumSpots] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const navigation = useNavigation();
  const { user } = useUser();
  const db = getFirestore(app);

  useEffect(() => {
    checkIfEmailRegistered();
    getLocation();
  }, []);

  const checkIfEmailRegistered = async () => {
    try {
      const q = query(collection(db, 'mall-parking'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log('User is already registered');
        navigation.navigate('MallHome');
      }
    } catch (error) {
      console.error('Error checking if email is registered:', error);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is required to get current location.');
        return;
      }
      
      const locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    }
  };

  const handleNumSpotsChange = (text) => {
    const num = parseInt(text);
    if (!isNaN(num) && num > 0) {
      setNumSpots(text);
      setParkingSpots(Array.from({ length: num }, (_, index) => ({ id: index + 1 })));
    } else {
      setNumSpots('');
      setParkingSpots([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Convert numSpots to a number
      const numSpotsInt = parseInt(numSpots);

      // Create an array to store promises for adding parking spots
      const promises = [];

      // Loop through each parking spot
      for (let i = 1; i <= numSpotsInt; i++) {
        // Add the parking spot to Firestore
        const promise = addDoc(collection(db, 'mall-parking'), {
          email: user?.primaryEmailAddress?.emailAddress,
          name: name,
          location: location,
          spotNumber: i , // Add a spot number for reference
          status: 'empty' // Set the initial status of each spot to 'empty'
        });
        promises.push(promise);
      }

      // Wait for all parking spots to be added
      await Promise.all(promises);

      console.log('All parking spots submitted successfully');
      setIsLoading(false);

      navigation.navigate('MallHome');
    } catch (error) {
      console.error('Error submitting parking data:', error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />

      {location && (
        <View style={styles.location}>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      )}

      <Text style={styles.label}>Number of Spots:</Text>
      <TextInput
        style={styles.input}
        value={numSpots}
        onChangeText={handleNumSpotsChange}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Button
        title={isLoading ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isLoading || !location}
      />

      {/* <FlatList
        data={parkingSpots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.spotItem}>
            <Text>Spot {item.id}</Text>
          </View>
        )}
        contentContainerStyle={styles.parkingLot}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  label: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  location: {
    marginBottom: 20,
  },
  parkingLot: {
    marginTop: 20,
    alignItems: 'center',
  },
  spotItem: {
    width: 40,
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewParkingForm;
