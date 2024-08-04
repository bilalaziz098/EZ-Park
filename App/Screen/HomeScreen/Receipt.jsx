import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { useUser, useAuth } from '@clerk/clerk-expo';
import Colors from '../../../utils/Colors'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
const Receipt = () => {

  const { user } = useUser();
  return (

    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30, fontFamily: 'outfit-bold', marginTop: 30 }}>
        Your Parking Spot Receipt
      </Text>
      <Text style={{ fontSize: 17, fontFamily: 'outfit-medium', color: Colors.GRAY }} >Display to avoid any inconvenience</Text>
      <View style={{ height: '70%', width: '80%', marginTop: 45, borderWidth: 1 }} >
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

          <View style={{ marginBottom: 10 }}>
          </View>
        </View>
        <View style={{ marginTop: 15, marginLeft: 10 }}>
          <Text style={{ fontSize: 15, fontFamily: 'outfit-medium' }}>Name: {user.fullName}</Text>
          <Text style={{ fontSize: 15, fontFamily: 'outfit-medium' }}>Email: {user?.primaryEmailAddress.emailAddress}</Text>
          <Text style={{ fontSize: 15, fontFamily: 'outfit-medium', color: 'red' }}>Your Booking is valid for 45 min</Text>
        </View>
        <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontFamily: 'outfit-bold', color: Colors.primary }}>Pay Rs. 100 </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
          
          <QRCode size={130}
            value={`Name: ${user.fullName}\n Email: ${user?.primaryEmailAddress.emailAddress}`}
            logoSize={35}
            logoBackgroundColor='transparent'
          />
        </View>
      </View>
    </View>
  )
}

export default Receipt

const styles = StyleSheet.create({})