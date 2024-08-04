import { View, Text, FlatList, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PlaceItem from './PlaceItem';
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../../utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PlaceListView({ placeList, navigation }) {
  const FlatListRef = useRef(null);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const { selectedMarker, setSelectedMarker } = useContext(SelectedMarkerContext);
  const db = getFirestore(app);

  useEffect(() => {
    if (selectedMarker && placeList.length > 0) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker, placeList]);

  const scrollToIndex = (index) => {
    FlatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index
  });

  useEffect(() => {
    if (user) {
      getFav();
    }
  }, [user]);

  const getFav = async () => {
    setFavList([]);
    const q = query(collection(db, "fav-parking"), where("email", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setFavList(favList => [...favList, doc.data()]);
    });
  };

  const isFav = (place) => {
    return favList.some(item => item.place.id === place.id);
  };

  if (!placeList || placeList.length === 0) {
    return <Text>No places available</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={placeList}
        pagingEnabled
        ref={FlatListRef}
        horizontal
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index} style={{ width: Dimensions.get('window').width }}>
            <PlaceItem 
              place={item} 
              isFav={isFav(item)}
              markedFav={() => getFav()}
              navigation={navigation}
            />
          </View>
        )}
      />
    </View>
  );
}
