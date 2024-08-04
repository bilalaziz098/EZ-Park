import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, TextInput, Switch, FlatList, ActivityIndicator} from 'react-native';
import { getFirestore, query, collection, where, getDocs, setDoc, doc, updateDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { app } from '../../../utils/FirebaseConfig';
import Colors from '../../../utils/Colors';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileDetailsScreen() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [location, setLocation] = useState('');
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
  const [isPriceEntered, setIsPriceEntered] = useState(false);
  const [isLocationEntered, setIsLocationEntered] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const db = getFirestore(app);
  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, 'home-parking'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setUserData(data);
        setLoading(false);

        if (data.length > 0 && data[0].phoneNumber && data[0].pricePerHour && data[0].location) {
          setIsFormFilled(true);
        }

        setIsOnline(data[0]?.status === 'online');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserData();
    }

    const loadSession = async () => {
      try {
        const session = await AsyncStorage.getItem('profileDetailsSession');
        if (session) {
          const sessionData = JSON.parse(session);
          setPhoneNumber(sessionData.phoneNumber);
          setPricePerHour(sessionData.pricePerHour);
          setLocation(sessionData.location);
          setIsOnline(sessionData.isOnline);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };

    loadSession();
  }, [user, db]);

  const saveSession = async () => {
    try {
      const sessionData = {
        phoneNumber,
        pricePerHour,
        location,
        isOnline
      };
      await AsyncStorage.setItem('profileDetailsSession', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const status = isOnline ? "online" : "offline";
      await setDoc(doc(db, "home-parking", location.toString()), {
        phoneNumber,
        pricePerHour,
        email: user?.primaryEmailAddress?.emailAddress,
        location,
        status
      });
      saveSession();
      navigation.navigate('HomeOwnerTab');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleStatusChange = async (status) => {
    setIsOnline(status === 'online');
    try {
      const q = query(collection(db, 'home-parking'), where('email', '==', user?.primaryEmailAddress?.emailAddress));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;

      await updateDoc(docRef, {
        status: status
      });

      saveSession();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setPhoneNumber(item.phoneNumber);
    setPricePerHour(item.pricePerHour);
    setLocation(item.location);
  };

  const handleSaveEdit = () => {
    setEditingItemId(null);
    saveSession();
  };

  const renderItem = ({ item }) => (
    <View style={{ alignItems: 'center' }}>
      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <Image source={{ uri: user.imageUrl }} style={{ width: 150, height: 150, borderRadius: 99 }} />
        <Text style={{ fontSize: 26, fontFamily: 'outfit-medium', marginTop: 8 }}>{user.fullName}</Text>
        <Text style={{ fontSize: 18, color: Colors.GRAY, fontFamily: 'outfit', marginTop: 5 }}>{user?.primaryEmailAddress.emailAddress}</Text>
      </View>

      <View style={styles.row}>
        <Feather name="phone" size={24} color="black" style={styles.icon} />
        <Text style={styles.label}>Phone Number:</Text>
        {editingItemId === item.id ?
          <TextInput
            style={styles.editInput}
            onChangeText={text => {
              setPhoneNumber(text);
              setIsPhoneNumberEntered(text !== '');
            }}
            value={phoneNumber}
            keyboardType="numeric"
          /> :
          <Text style={styles.value}>{item.phoneNumber}</Text>
        }
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="pencil-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="attach-money" size={24} color="black" style={styles.icon} />
        <Text style={styles.label}>Price per Hour:</Text>
        {editingItemId === item.id ?
          <TextInput
            style={styles.editInput}
            onChangeText={text => {
              setPricePerHour(text);
              setIsPriceEntered(text !== '');
            }}
            value={pricePerHour}
            keyboardType="numeric"
          /> :
          <Text style={styles.value}>{item.pricePerHour}</Text>
        }
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="pencil-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Ionicons name="location" size={24} color="black" style={styles.icon} />
        <Text style={styles.label}>Address:</Text>
        {editingItemId === item.id ?
          <TextInput
            style={styles.editInput}
            onChangeText={text => {
              setLocation(text);
              setIsLocationEntered(text !== '');
            }}
            value={location}
          /> :
          <Text style={styles.value}>{item.location}</Text>
        }
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="pencil-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {editingItemId === item.id && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData.length > 0 ? (
        <>
          <FlatList
            scrollEnabled={false}
            data={userData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />

          {isFormFilled && (
            <SliderComponent handleStatusChange={handleStatusChange} isOnline={isOnline} />
          )}
        </>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} behavior="padding">
          <Image style={{ height: 100, width: 100, marginBottom: 40 }} source={require('../../../assets/images/userdetails.png')} />
          <TextInput
            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
            placeholder="Phone Number"
            keyboardType="numeric"
            onChangeText={text => {
              setPhoneNumber(text);
              setIsPhoneNumberEntered(text !== '');
            }}
            value={phoneNumber}
          />
          <TextInput
            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
            placeholder="Price per Hour"
            onChangeText={text => {
              setPricePerHour(text);
              setIsPriceEntered(text !== '');
            }}
            value={pricePerHour}
            keyboardType="numeric"
          />
          <TextInput
            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
            placeholder="Address of your home"
            onChangeText={text => {
              setLocation(text);
              setIsLocationEntered(text !== '');
            }}
            value={location}
          />
          <TouchableOpacity
            style={{ backgroundColor: Colors.primary, height: 50, width: 200, borderRadius: 99, alignContent: 'center', justifyContent: 'center' }}
            onPress={handleFormSubmit}
          >
            <Text style={{ textAlign: 'center', color: Colors.WHITE, fontFamily: 'outfit-medium', fontSize: 17 }}>Continue</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function SliderComponent({ handleStatusChange, isOnline }) {
  const handleSliderChange = (value) => {
    handleStatusChange(value ? "online" : "offline");
  };

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>Status:</Text>
      <Switch
        value={isOnline}
        onValueChange={handleSliderChange}
        thumbColor={isOnline ? Colors.primary : Colors.GRAY}
        trackColor={{ false: Colors.GRAY, true: Colors.primary }}
      />
      <Text style={styles.sliderText}>{isOnline ? "Online" : "Offline"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  editInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 17,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  sliderLabel: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'outfit-bold'
  },
  sliderText: {
    fontSize: 16,
    fontFamily: 'outfit'
  },
});


