import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppMapView from './AppMapView'
import Header from './Header'
import SearchBar from './SearchBar'
import GlobalApi from '../../../utils/GlobalApi'
import { UserLocationContext } from '../../Context/UserLocationContext'
import PlaceListView from './PlaceListView'
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext'

const HomeScreen = () => {
  const [selectedMarker, setSelectedMarker]=useState([]);
  const { location, setLocation } = useContext(UserLocationContext);
  const [placeList, setPlaceList]=useState([]);
  useEffect(()=>{
    location&&GetNearByPlace();
  },[location])
  const GetNearByPlace = () => {
    const data = {
      "includedTypes": ["parking"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location.latitude,
            "longitude": location.longitude
          },
          "radius": 5000.0
        }
      }
    }
    GlobalApi.NewNearByPlace(data).then(resp => {
      // console.log(JSON.stringify(resp.data));
      setPlaceList(resp.data?.places);
    })
  }
  return (
    <SelectedMarkerContext.Provider value={{selectedMarker,setSelectedMarker}}>
    <View >
      <View style={styles.headerContainer}>
        <Header />
        <SearchBar searchedLocation={(location) => 
          setLocation({
            latitude: location.lat,
            longitude: location.lng
          })} />
      </View>
      {placeList&&<AppMapView placeList={placeList} />}
      <View style={styles.placelistContainer}>
        {placeList&&<PlaceListView placeList={placeList}/>}
      </View>
    </View>
    </SelectedMarkerContext.Provider>
  )
}

export default HomeScreen
const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    width: '100%',
    zIndex: 10,
    position: 'absolute'
  },
  placelistContainer:{
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%'
  }
})