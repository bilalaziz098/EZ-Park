import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import BookingModal from '../BookingScreen/BookingScreen';
import ChatBot from '../ChatBot/ChatBot';
import RatingScreen from '../Ratings/Ratings'; // Import RatingScreen

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigation = useNavigation();
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  const handleSpaceProvider = () => {
    navigation.navigate('MainStack');
  };

  const handleMenuItemPress = (screenName) => {
    switch (screenName) {
      case 'Email':
        Linking.openURL('googlegmail://co?to=f2020266359@umt.edu.pk');
        break;
      case 'logout':
        signOut();
        break;
      case 'Feedback':
        setShowRatingsModal(true);
        break;
      case 'Bookings':
        setShowBookingModal(true);
        break;
      default:
        navigation.navigate(screenName);
    }
  };

  const profileMenu = [
    { id: 1, name: 'Home', icon: 'home', screenName: 'Home' },
    { id: 2, name: 'My Favourites', icon: 'bookmark', screenName: 'Favourites' },
    { id: 3, name: 'Contact Us', icon: 'email', screenName: 'Email' },
    { id: 4, name: 'Logout', icon: 'logout', screenName: 'logout' },
    { id: 5, name: 'Feedback', icon: 'star', screenName: 'Feedback' },
    { id: 6, name: 'My Bookings', icon: 'local-parking', screenName: 'Bookings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={() => setShowChatbotModal(true)}>
          <MaterialIcons name="chat" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userEmail}>{user?.primaryEmailAddress.emailAddress}</Text>
      </View>
      <FlatList
        scrollEnabled={false}
        data={profileMenu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => item.screenName ? handleMenuItemPress(item.screenName) : null}
          >
            <MaterialIcons name={item.icon} size={35} color={Colors.BLACK} />
            <Text style={styles.menuItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.spaceProvider} onPress={handleSpaceProvider}>
        <Text style={styles.spaceProviderText}>Switch To Space Provider Mode?</Text>
      </TouchableOpacity>

      {/* Ratings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRatingsModal}
        onRequestClose={() => setShowRatingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowRatingsModal(false)}>
              <MaterialIcons name="close" size={24} color={Colors.BLACK} />
            </TouchableOpacity>
            <RatingScreen />
          </View>
        </View>
      </Modal>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Chatbot Modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={showChatbotModal}
        onRequestClose={() => setShowChatbotModal(false)}
      > */}
        {/* <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowChatbotModal(false)}>
              <MaterialIcons name="close" size={24} color={Colors.BLACK} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chat with Us</Text>
            <ChatBot /> 
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
  },
  profileInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 99,
  },
  userName: {
    fontSize: 26,
    fontFamily: 'outfit-medium',
    marginTop: 5,
  },
  userEmail: {
    fontSize: 18,
    color: Colors.GRAY,
    fontFamily: 'outfit',
    marginTop: 5,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 10,
    paddingHorizontal: 130,
  },
  menuItemText: {
    fontFamily: 'outfit',
    fontSize: 19,
  },
  spaceProvider: {
    width: 250,
    borderRadius: 99,
    padding: 5,
    height: 50,
    backgroundColor: Colors.primary,
    marginHorizontal: 90,
  },
  spaceProviderText: {
    fontFamily: 'outfit',
    textAlign: 'center',
    alignItems: 'center',
    margin: 10,
    color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 50,
    width: '80%',
    height: 700,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'outfit-bold',
  },
});
