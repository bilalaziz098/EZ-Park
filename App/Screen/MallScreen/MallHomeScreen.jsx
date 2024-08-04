import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

const MallHome = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    try {
      setIsLoading(true);
      const db = getFirestore(app);
      const q = query(collection(db, 'mall-parking'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
      const querySnapshot = await getDocs(q);
      const spots = [];
      querySnapshot.forEach(doc => {
        spots.push({ id: doc.id, ...doc.data() });
      });
      setParkingSpots(spots);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      setIsLoading(false);
    }
  };

  const countStatus = (status) => {
    return parkingSpots.filter(spot => spot.status === status).length;
  };

  const totalSpots = parkingSpots.length;
  const emptySpots = countStatus('empty');
  const bookedSpots = countStatus('booked');

  const handleRefresh = () => {
    fetchParkingSpots();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Status</Text>
      <View style={styles.statusContainer}>
        <Text>Total Spots: {totalSpots}</Text>
        <Text>Empty Spots: {emptySpots}</Text>
        <Text>Booked Spots: {bookedSpots}</Text>
      </View>
      <Button title="Refresh" onPress={handleRefresh} disabled={isLoading} />
      <View style={styles.parkingLot}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          parkingSpots.map((spot) => (
            <View 
              key={spot.id} 
              style={[
                styles.spotItem, 
                { backgroundColor: spot.status === 'booked' ? 'red' : 'green' }
              ]} 
            />
          ))
        )}
      </View>
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
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 10,
  },
  statusContainer: {
    marginBottom: 20,
  },
  parkingLot: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  spotItem: {
    width: 40,
    height: 40,
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default MallHome;
