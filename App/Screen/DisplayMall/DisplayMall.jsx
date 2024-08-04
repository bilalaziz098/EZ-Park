import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Platform, Alert, RefreshControl } from 'react-native';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where, deleteDoc } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import Colors from '../../../utils/Colors';

const DisplayMall = () => {
  const [emptySpots, setEmptySpots] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const db = getFirestore(app);
  const { user } = useUser();

  useEffect(() => {
    fetchEmptySpots();
    console.log('Deleting empty bookings...');
    deleteEmptyBookings();

    // Set a timer to periodically check for expired bookings and update the status
    const timer = setInterval(() => {
      console.log('Checking for expired bookings...');
      updateExpiredBookings();
    }, 60000); // Check every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const fetchEmptySpots = async () => {
    try {
      console.log('Fetching empty spots...');
      const q = query(collection(db, 'mall-parking'), where('status', '==', 'empty'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        console.log('Document data:', doc.data());
        data.push({ id: doc.id, ...doc.data() });
      });
      console.log('Fetched empty spots:', data); // Add log
      setEmptySpots(data);
    } catch (error) {
      console.error('Error fetching empty spots:', error);
    }
  };

  const handleLocationPress = (latitude, longitude, formattedAddress) => {
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${formattedAddress}`,
      android: `geo:${latitude},${longitude}?q=${formattedAddress}`,
    });
    Linking.openURL(url);
  };

  const handleBookNow = async (id, fullSpots, numSpots, userEmail, spotNumber, name) => {
    if (fullSpots >= numSpots) {
      Alert.alert('Spot Unavailable', 'Sorry, there are no available spots to book.');
      return;
    }

    try {
      const parkingDocRef = doc(db, 'mall-parking', id);
      await updateDoc(parkingDocRef, {
        status: 'booked',
        bookedBy: user?.primaryEmailAddress.emailAddress,
        spotNumber: spotNumber, // Save spot number in the parking document
        name: name
      });

      // Save booking details in another collection
      await addDoc(collection(db, 'bookings'), {
        parkingSpotId: id,
        bookedBy: user?.primaryEmailAddress.emailAddress,
        bookedAt: new Date(),
        spotNumber: spotNumber,
        name: name // Save spot number in the bookings collection
      });

      Alert.alert('Booking Successful', 'Your spot has been successfully booked.');

      // Refresh empty spots after booking
      fetchEmptySpots();
    } catch (error) {
      console.error('Error booking spot:', error);
      Alert.alert('Booking Failed', 'Failed to book the spot. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    fetchEmptySpots(); // Refresh empty spots
    setRefreshing(false); // Set refreshing state to false after empty spots are fetched
  };

  const deleteEmptyBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where("status", "in", ["empty", "canceled"]));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log('No empty or canceled bookings found.');
        return;
      }
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log('Booking deleted successfully:', doc.id);
      });
    } catch (error) {
      console.error('Error deleting empty or canceled bookings:', error);
    }
  };
  

  const updateExpiredBookings = async () => {
    try {
      const currentTime = new Date();
      const q = query(collection(db, 'bookings'), where("status", "==", "booked"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const bookingData = doc.data();
        const bookingTime = bookingData.bookedAt.toDate();
        const timeDiff = currentTime.getTime() - bookingTime.getTime();
        const bookingDuration = 45 * 60 * 1000; // 45 minutes in milliseconds

        if (timeDiff >= bookingDuration) {
          // Booking has expired, update status to empty
          const parkingSpotId = bookingData.parkingSpotId;
          const parkingDocRef = doc(db, 'mall-parking', parkingSpotId);
          await updateDoc(parkingDocRef, { status: 'empty' });
          console.log('Spot status updated to empty for expired booking:', parkingSpotId);

          // Delete the booking entry
          await deleteDoc(doc.ref);
          console.log('Expired booking deleted:', doc.id);
        }
      });
    } catch (error) {
      console.error('Error updating expired bookings:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.parkingItem}>
      <Text style={styles.label}>Name: {item.name}</Text>
      <Text style={styles.label}>Email: {item.email}</Text>
      <Text style={styles.label}>Status: {item.status || 'Empty'}</Text>
      <Text style={styles.label}>Spot Number: {item.spotNumber}</Text>
      {item.location && (
        <TouchableOpacity onPress={() => handleLocationPress(item.location.latitude, item.location.longitude, item.formattedAddress)}>
          <View style={styles.location}>
            <Text style={styles.locationText}>Location</Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => handleBookNow(item.id, item.fullSpots, item.numSpots, item.email, item.spotNumber, item.name)}>
        <View style={styles.bookNowButton}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </View>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby <Text style={{ color: Colors.primary }}>Public Spots</Text></Text>
      <FlatList
        data={emptySpots}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 30,
    marginBottom: 10,
  },
  heading: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    marginBottom: 20,
  },
  parkingItem: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  label: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingTop: 10,
  },
  locationText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  bookNowButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  bookNowButtonText: {
    color: 'white',
    fontFamily: 'outfit-bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DisplayMall;
