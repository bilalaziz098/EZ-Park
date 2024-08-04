import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../../utils/Colors';

export default function Header() {
    const {user}=useUser();
  return (

    <View style={styles.container}>
      <Image source={{uri:user?.imageUrl}}
      style={{width: 45, height: 45, borderRadius: 99}}
      />
      <Image source={require('./../../../assets/images/logowritten.jpeg')} style={{width: 200, height: 30, objectFit: 'contain'}}/>
    <FontAwesome5 name="filter" size={26} color="black" />
    </View>

  )
}
const styles = StyleSheet.create({
    container:{
        display:'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

    }
})