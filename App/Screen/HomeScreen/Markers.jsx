import { View, Text, Image} from 'react-native'
import React, { useContext } from 'react'
import { Marker } from 'react-native-maps'
import { SelectedMarkerContext } from '../../Context/SelectedMarkerContext'
export default function Markers({index, place}) {
  const {selectedMarker, setSelectedMarker}=useContext(SelectedMarkerContext)
  return place&&(
    <Marker coordinate={{
      latitude:place.location?.latitude, 
      longitude:place.location?.longitude}}
      onPress={()=>setSelectedMarker(index)}
      >
    <Image source={require('./../../../assets/images/car-marker.jpeg')} style={{width:40, height: 35}}/>
    </Marker>
  )
}