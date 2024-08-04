import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, query, collection, where, getDocs, doc, updateDoc } from '@firebase/firestore';
import { app } from '../../../utils/FirebaseConfig';
import Colors from '../../../utils/Colors';
import { useUser } from '@clerk/clerk-expo';

export default function ProfileDetailsScreen() {
  const [userData, setUserData] = useState(null);
  const [isOnline, setIsOnline] = useState(null); // Initialize with null
  const db = getFirestore(app);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the saved state from AsyncStorage
        const savedIsOnline = await AsyncStorage.getItem('isOnline');
        if (savedIsOnline !== null) {
          setIsOnline(JSON.parse(savedIsOnline));
        } else {
          setIsOnline(false); // Default value if not stored in AsyncStorage
        }

        // Fetch user data from Firebase
        const q = query(collection(db, 'home-parking'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (!userData && user?.primaryEmailAddress?.emailAddress) {
      fetchUserData();
    }
  }, [user, userData, db]);

  const toggleOnlineStatus = async () => {
    try {
      // Toggle the local state
      setIsOnline(prevIsOnline => !prevIsOnline);

      // Save the state in AsyncStorage
      await AsyncStorage.setItem('isOnline', JSON.stringify(!isOnline));

      // Update the user data in Firebase
      const userRef = doc(db, 'home-parking', user?.uid);
      await updateDoc(userRef, { isOnline: !isOnline });
    } catch (error) {
      console.error('Error toggling online status:', error);
    }
  };

  // Render null until initial state is fetched
  if (isOnline === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <View>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{userData?.phoneNumber}</Text>
            <Text style={styles.label}>Price per Hour:</Text>
            <Text style={styles.value}>{userData?.pricePerHour}</Text>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{userData?.location}</Text>
          </View>
          <View>
      <TouchableOpacity style={styles.touch}> 
        <Text> Switch Back to User?</Text></TouchableOpacity>
      </View>
          <View style={styles.onlineStatusContainer}>
            
            <Text style={styles.label}>Online/Offline:</Text>
            <Switch
              trackColor={{ false: Colors.darkGray, true: Colors.primary }}
              thumbColor={Colors.WHITE}
              ios_backgroundColor={Colors.darkGray}
              onValueChange={toggleOnlineStatus}
              value={isOnline}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'outfit',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  
});
