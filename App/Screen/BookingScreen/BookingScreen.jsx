import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import * as Notifications from 'expo-notifications';

const BookingModal = ({ visible, onClose }) => {
  const [userBookings, setUserBookings] = useState([]);
  const db = getFirestore(app);
  const { user } = useUser();

  useEffect(() => {
    if (visible) {
      fetchUserBookings();
    }
  }, [visible]);

  useEffect(() => {
    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(handleNotification);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNotification = (notification) => {
    // Handle incoming notifications here
    console.log(notification);
  };

  const scheduleNotification = async (bookingId) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Expired',
        body: 'Your booking has expired.',
      },
      trigger: null, // Send immediately
    });

    // Update spot status to empty
    try {
      await updateSpotStatus(bookingId);
    } catch (error) {
      console.error('Error updating spot status:', error);
    }
  };

  const updateSpotStatus = async (bookingId) => {
    console.log('Booking ID:', bookingId); // Add this line to check the value of bookingId

    // Get the booking document reference
    const bookingRef = doc(db, 'bookings', bookingId);

    try {
      // Update the spot status to empty
      await updateDoc(bookingRef, {
        status: 'empty'
      });
      console.log('Spot status updated to empty');
    } catch (error) {
      console.error('Error updating spot status:', error);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where("bookedBy", "==", user?.primaryEmailAddress.emailAddress));
      const querySnapshot = await getDocs(q);
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      // Filter out expired bookings
      const filteredBookings = bookings.filter((booking) => {
        const currentTime = new Date();
        const bookingTime = booking.bookedAt.toDate();
        const timeDiff = currentTime.getTime() - bookingTime.getTime();
        const remainingTime = Math.max(0, 45 * 60 * 1000 - timeDiff); // 45 minutes in milliseconds
        return remainingTime > 0;
      });

      setUserBookings(filteredBookings);

      // Schedule notifications for bookings that are about to expire
      filteredBookings.forEach((booking) => {
        const currentTime = new Date();
        const bookingTime = booking.bookedAt.toDate();
        const timeDiff = currentTime.getTime() - bookingTime.getTime();
        const remainingTime = Math.max(0, 45 * 60 * 1000 - timeDiff); // 45 minutes in milliseconds
        if (remainingTime === 0) {
          // Booking has expired, send notification immediately
          scheduleNotification(booking.id); // Pass booking.id to scheduleNotification
        } else if (remainingTime > 0 && remainingTime <= 60000) {
          // Booking will expire in less than a minute, schedule notification
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Booking Expiring Soon',
              body: 'Your booking will expire in less than a minute.',
            },
            trigger: { seconds: Math.floor(remainingTime / 1000) }, // Send notification when booking expires
          });
        }
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      // Update the booking status to 'empty'
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'empty' });

      // Remove the canceled booking from the UI state
      setUserBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const renderItem = ({ item }) => {
    // Calculate remaining time
    const currentTime = new Date();
    const bookingTime = item.bookedAt.toDate();
    const timeDiff = currentTime.getTime() - bookingTime.getTime();
    const remainingTime = Math.max(0, 45 * 60 * 1000 - timeDiff); // 45 minutes in milliseconds
    const minutes = Math.floor(remainingTime / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Define border color based on remaining time
    let borderColor = 'gray';
    if (remainingTime <= 60000) {
      borderColor = 'red';
    }
    if (item.status === 'empty') {
      // Don't render if the status is empty
      return null;
    }

    return (
      <View style={[styles.bookingItem, { borderColor }]}>
        <Text style={styles.label}>Place: {item.name}</Text>
        <Text style={styles.label}>Parking Number: {item.spotNumber}</Text>
        <Text style={styles.label}>Remaining Time: {minutes} mins {seconds} secs</Text>
        {/* <Button title="Cancel Booking" onPress={() => cancelBooking(item.id)} /> */}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Your Bookings</Text>
          <FlatList
            data={userBookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginBottom: 10,
  },
  bookingItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
  },
});

export default BookingModal;
