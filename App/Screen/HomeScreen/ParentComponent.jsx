import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import PlaceItem from './PlaceItem'; // Import the PlaceItem component

const ParentComponent = () => {
  const [isMallRegistered, setIsMallRegistered] = useState(false); // State to track if the mall is registered
  const db = getFirestore(app);

  useEffect(() => {
    const checkMallRegistration = async () => {
      try {
        const docRef = doc(db, 'mall-registration', user?.id); // Replace 'mall-id' with the actual ID of the mall document
        const docSnap = await getDoc(docRef);
        setIsMallRegistered(docSnap.exists());
      } catch (error) {
        console.error('Error checking mall registration:', error);
      }
    };

    checkMallRegistration();
  }, [db]);

  return (
    <View style={styles.container}>
      {/* Render PlaceItem and pass isMallRegistered as a prop */}
      <PlaceItem place={yourPlaceData} isFav={true} markedFav={() => {}} isMallRegistered={isMallRegistered} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ParentComponent;
