import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Linking, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { getFirestore, query, collection, where, getDocs } from '@firebase/firestore';
import { app } from '../../../utils/FirebaseConfig';
import Colors from '../../../utils/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeownerList() {
  const [homeowners, setHomeowners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    fetchHomeowners();
  }, []);

  const fetchHomeowners = async () => {
    const db = getFirestore(app);
    try {
      const q = query(collection(db, 'home-parking'), where('status', '==', 'online')); // Filter by status 'online'
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setHomeowners(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homeowners:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text>Email: {item.email}</Text>
        <Text>Price Per Hour: {item.pricePerHour}</Text>
        <Text>Address: {item.location}</Text>

        <Text style={{ fontSize: 16, fontFamily: 'outfit-medium', marginTop: 3 }}>Phone Number: {item.phoneNumber}</Text>
        <TouchableOpacity onPress={() => handleCall(item.phoneNumber)}>
          <Ionicons name="call" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NearBy <Text style={{ color: Colors.primary }}> HomeOwners</Text></Text>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      )}
      {!loading && homeowners.length === 0 && (
        <Text style={styles.noDataText}>No Public Parking found NearBy</Text>
      )}
      <FlatList
        data={homeowners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchHomeowners}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 30,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontFamily: 'outfit',
    marginTop: 5,
  },
  noDataText: {
    fontFamily: 'outfit',
    marginTop: 20,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY, // You can set the color of the separator here
    marginVertical: 10, // Adjust the vertical spacing between items
  },
});
