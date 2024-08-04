import { View, Text } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Colors from '../../../utils/Colors';
import { Entypo } from '@expo/vector-icons';

export default function SearchBar({searchedLocation}) {
  return (
    <View style={{display: 'flex', flexDirection: 'row', marginTop: 15, paddingHorizontal: 5, backgroundColor: Colors.WHITE, borderRadius: 6}}>
    <Entypo name="location-pin" size={24} color="black" />
        <GooglePlacesAutocomplete
      placeholder='Find Parking spot'
      fetchDetails={true}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        searchedLocation(details?.geometry.location)
      }}
      query={{
        key: '',
        language: 'en',
      }}
      onFail={error=>console.log(error)}
    />
    </View>
  )
}