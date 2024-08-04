import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../utils/Colors';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import FavouriteScreen from '../Screen/FavouriteScreen/FavouriteScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';
import HomeOwnerList from '../Screen/HomeOwners/HomeOwnerList';
import WhichProviderScreen from '../Screen/WhichProviderScreen/WhichProvideScreen';
import MallHomeScreen from '../Screen/MallScreen/MallHomeScreen';
import HomeOwnerHomeScreen from '../Screen/HomeOwnerSide/HomeScreen';
import HomeOwnerProfileScreen from '../Screen/HomeOwnerSide/HomeScreen';
import HomeOwnerBidsScreen from '../Screen/HomeOwnerSide/BidScreen';
import Form from '../Screen/HomeOwnerSide/Form';
import SpaceForm from '../Screen/MallScreen/SpaceForm';
import BookingScreen from '../Screen/BookingScreen/BookingScreen';
import RatingScreen from '../Screen/Ratings/Ratings';
import DisplayMall from '../Screen/DisplayMall/DisplayMall';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator({ saveLastSession }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'search';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Favourites') {
            iconName = 'favorite';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'HomeParking') {
            iconName = 'local-parking';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'profile';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Notifications') {
            iconName = 'notification';
            return <MaterialIcons name="notifications" size={size} color={color} />;
            
          }
          else if (route.name === 'Public Parking') {
            iconName = 'notification';
            return <MaterialIcons name="local-mall" size={size} color={color} />;
          }
          
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'Home') }} />
      <Tab.Screen name="Favourites" component={FavouriteScreen} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'Favourites') }} />
      <Tab.Screen name="Public Parking" component={DisplayMall} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'Public Parking') }} />
      <Tab.Screen name="HomeParking" component={HomeOwnerList} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'HomeParking') }} />
      {/* <Tab.Screen name="Notifications" component={Notification} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'Notifications') }} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} listeners={{ tabPress: () => saveLastSession('Main', 'Profile') }} />
    </Tab.Navigator>
  );
}

function HomeOwnerTabNavigator({ saveLastSession }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Profile') {
            iconName = 'profile';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Bids') {
            iconName = 'dollar';
            return <FontAwesome name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Profile" component={HomeOwnerProfileScreen} listeners={{ tabPress: () => saveLastSession('HomeOwnerTab', 'Profile') }} />
      <Tab.Screen name="Bids" component={HomeOwnerBidsScreen} listeners={{ tabPress: () => saveLastSession('HomeOwnerTab', 'Bids') }} />
    </Tab.Navigator>
  );
}
function MainStackNavigator({ saveLastSession }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WhichProvider" component={WhichProviderScreen} listeners={{ focus: () => saveLastSession('MainStack', 'WhichProvider') }} />
      <Stack.Screen name="MallHome" component={MallHomeScreen} listeners={{ focus: () => saveLastSession('MainStack', 'MallHome') }} />
      <Stack.Screen name="HomeOwnerHome" component={HomeOwnerHomeScreen} listeners={{ focus: () => saveLastSession('MainStack', 'HomeOwnerHome') }} />
      <Stack.Screen name="HomeOwnerTab" component={HomeOwnerTabNavigator} listeners={{ focus: () => saveLastSession('MainStack', 'HomeOwnerTab') }} />
      <Stack.Screen name="SpaceForm" component={SpaceForm} listeners={{ focus: () => saveLastSession('MainStack', 'SpaceForm') }} />
      {/* <Stack.Screen name="BookingScreen" component={BookingScreen} listeners={{ focus: () => saveLastSession('MainStack', 'BookingScreen') }} /> */}
    </Stack.Navigator>
  );
}
export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState('Main');
  const [initialTab, setInitialTab] = useState('Home');
  const [initialStack, setInitialStack] = useState('WhichProvider');

  useEffect(() => {
    const loadSession = async () => {
      const lastSession = await AsyncStorage.getItem('lastSession');
      const lastTab = await AsyncStorage.getItem('lastTab');
      const lastStack = await AsyncStorage.getItem('lastStack');
      if (lastSession && lastTab && lastStack) {
        setInitialRoute(lastSession);
        setInitialTab(lastTab);
        setInitialStack(lastStack);
      }
    };
    loadSession();
  }, []);

  const saveLastSession = async (routeName, tabName) => {
    await AsyncStorage.setItem('lastSession', routeName);
    await AsyncStorage.setItem('lastTab', tabName);
    await AsyncStorage.setItem('lastStack', tabName);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {props => <MainTabNavigator {...props} saveLastSession={saveLastSession} />}
        </Stack.Screen>
        <Stack.Screen name="MainStack">
          {props => <MainStackNavigator {...props} saveLastSession={saveLastSession} />}
        </Stack.Screen>
        <Stack.Screen name="Form" component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


