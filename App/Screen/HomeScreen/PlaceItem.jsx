import React, { useState } from 'react';
import { View, Text, Image, Dimensions, Pressable, ToastAndroid, Platform, Linking, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Colors from '../../../utils/Colors';
import GlobalApi from '../../../utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getFirestore, deleteDoc } from "firebase/firestore";
import { app } from '../../../utils/FirebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceItem({ place, isFav, markedFav, isMallRegistered }) {
  const { user } = useUser();
  const db = getFirestore(app);

  const onDirectionClick = () => {
    const url = Platform.select({
      ios: "maps:"+place?.location.latitude+","+place?.location.longitude+"?q="+place?.formattedAddress,
      android: "geo:"+place?.location.latitude+","+place?.location.longitude+"?q="+place?.formattedAddress,
    });
    Linking.openURL(url);
  }

  const onSetFav = async (place) => {
    await setDoc(doc(db, "fav-parking", (place.id).toString()), {
      place: place,
      email: user?.primaryEmailAddress?.emailAddress
    });
    markedFav()
    ToastAndroid.show('Added to Favourites', ToastAndroid.TOP);
  };

  const onRemoveFav = async (placeId) => {
    await deleteDoc(doc(db, "fav-parking", placeId.toString()));
    ToastAndroid.show("Removed from Favorites", ToastAndroid.TOP);
    markedFav()
  };

  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

  return (
    <View style={{ backgroundColor: Colors.WHITE, margin: 5, borderRadius: 10, width: Dimensions.get('screen').width * 0.9 }}>
      <LinearGradient colors={['transparent', '#ffffff', '#ffffff']}>
        {!isFav ? (
          <Pressable style={{ position: 'absolute', right: 0, margin: 5 }} onPress={() => onSetFav(place)}>
            <Entypo name="heart-outlined" size={30} color="white" />
          </Pressable>
        ) : (
          <Pressable style={{ position: 'absolute', right: 0, margin: 5 }} onPress={() => onRemoveFav(place.id)}>
            <Ionicons name="heart-sharp" size={30} color="red" />
          </Pressable>
        )}
        <Image
          source={
            place?.photos ?
              {
                uri: PLACE_PHOTO_BASE_URL + place.photos[0]?.name +
                  "/media?key=" + GlobalApi.API_KEY + "&maxHeightPx=800&maxWidthPx=1200"
              }
              : require('./../../../assets/images/logo.jpeg')
          }
          style={{ width: '100%', borderRadius: 10, height: 180, zIndex: -1 }}
        />
        <View style={{ padding: 15 }}>
          <Text style={{ fontSize: 23, fontFamily: 'outfit-medium' }}>{place.displayName?.text}</Text>
          <Text style={{ color: Colors.GRAY, fontFamily: 'outfit' }}>{place?.shortFormattedAddress}</Text>
        </View>
        <View>
          {isMallRegistered && (
            <TouchableOpacity>
              <Text style={{ fontSize: 20, fontFamily: 'outfit-medium', marginLeft: 10, color: Colors.primary, textAlign: 'center' }}>Book Now!</Text>
            </TouchableOpacity>
          )}
          <Pressable onPress={onDirectionClick} style={{ padding: 12, backgroundColor: Colors.primary, borderRadius: 6, paddingHorizontal: 14 }}>
            <FontAwesome name="location-arrow" size={25} color="white" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}
