import { View, Text, Image,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../../utils/Colors'
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../../hooks/warmUpBrowser';
WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
    useWarmUpBrowser();
  
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google"})
  
  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View style={{display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: 20}}>
      <Image source={require('./../../../assets/images/logowritten.jpeg')}
      style={styles.logoImage}
      />
      <Image source={require('./../../../assets/images/Car.jpeg')}
      style={styles.loginImage}
      />
      <View style={{padding: 20}}>
        <Text style={styles.heading}>Your Car Parking Finder App</Text>
        <Text style={styles.subheading}>Find car parking near you, without any hustle in just one click </Text>
        <TouchableOpacity style={styles.button} 
        onPress={onPress}
        >
            <Text style={{color: Colors.WHITE, textAlign: 'center', fontFamily: 'outfit', fontSize: 17}}>Login with Google as User</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    logoImage:{
        width: 400,
        height: 50,
        objectFit: 'contain',

    },
    loginImage:{
        width: '100%',
        height: 220,
        marginTop: 20,
        objectFit: 'cover'
    },
    heading:{
        fontSize: 25,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        marginTop: 20
    },
    subheading:{
        fontSize: 17,
        fontFamily:'outfit',
        marginTop: 15, 
        textAlign: 'center',
        color: Colors.GRAY,
    },
    button:{
        backgroundColor: Colors.primary,
        padding: 16,
        display: 'flex',
        borderRadius: 59,
        marginTop: 70
    },
    button2:{
      backgroundColor: Colors.primary,
        padding: 16,
        display: 'flex',
        borderRadius: 59,
        marginTop: 20
    }
})
