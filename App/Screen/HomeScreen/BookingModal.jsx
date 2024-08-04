import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert,Modal, SafeAreaView} from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../utils/Colors'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useClerk } from '@clerk/clerk-react';
import { useNavigation } from '@react-navigation/native'; 
import Receipt from './Receipt';
const BookingModal = () => {
  const [showModal, setShowModal]=useState(false)
  const navigation = useNavigation(); 
  let selectedSpot = [];
  const { user } = useClerk();
  const [color, setColor] = useState([
    { color: 'red', text: 'Occupied' },
    { color: 'yellow', text: 'Reserved' },
    { color: 'green', text: 'Vacant' }
  ])
  const [row1, setRow1] = useState([
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: true },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: true },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
  ]);
  const [row2, setRow2] = useState([
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: true },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: true },
  ]);
  const [row3, setRow3] = useState([
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'true', selected: false },
    { empty: 'true', selected: false },
    { empty: 'false', selected: false },
    { empty: 'false', selected: false },
  ]);
  const onSelectRow1 = (index) => {
    let tempRow = [];
    tempRow = row1;
    tempRow.map((item, ind) => {
      if (index == ind) {
        if (item.selected === true) {
          item.selected = false;
          item.empty = 'true';
        } else {
          item.selected = true;
          item.empty = 'false';
        }
      }
    });
    let tempSpot = [];
    tempRow.map(item => {
      tempSpot.push(item);
    });
    setRow1(tempSpot);
  }
  const onSelectRow2 = (index) => {
    let tempRow = [];
    tempRow = row2;
    tempRow.map((item, ind) => {
      if (index == ind) {
        if (item.selected === true) {
          item.selected = false;
          item.empty = 'true';
        } else {
          item.selected = true;
          item.empty = 'false';
        }
      }
    });
    let tempSpot = [];
    tempRow.map(item => {
      tempSpot.push(item);
    });
    setRow2(tempSpot);
  };
  const gerAllSeats = () => {
    selectedSpot=[];
    row1.map(item => {
      if (item.selected == true) {
        selectedSpot.push(1)
      }
    });
    row2.map(item => {
      if (item.selected == true) {
        selectedSpot.push(1)
      }
    });
    return selectedSpot.length
  }
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '80%', height: '90%', borderWidth: 0.5, borderRadius: 5, borderColor: Colors.BLACK }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginTop: 3 }}>
          <FlatList
            data={color}
            horizontal
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 4 }}>
                <FontAwesome name="square" size={13} color={item.color} />
                <Text style={{ marginLeft: 2, fontSize: 12 }}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Image source={require('../../../assets/images/exit.webp')} style={{ width: 40, height: 30, marginLeft: '83%', opacity: 1 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
          <View style={{ marginLeft: 10 }}>
            <FlatList
              data={row1}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={{ marginBottom: 5, }} onPress={() => {
                  if (item.selected == false && item.empty == 'false') {
                    alert("Already Booked! Choose Some other spot")
                  // }
                  // else if (item.selected === true && item.empty === 'false') {
                  //   alert("Already Reserved! Choose Some other spot");
                  } else {
                    onSelectRow1(index);
                  }
                }}
                >
                  {item.empty === 'false' && item.selected === true ? (
                    <MaterialIcons name="rectangle" size={40} color="yellow" />
                  ) : item.empty === 'true' && item.selected === false ? (
                    <MaterialIcons name="rectangle" size={40} color="green" />
                  ) : item.empty === 'false' && item.selected === false ? (
                    <MaterialIcons name="rectangle" size={40} color="red" />
                  ) : null}
                </TouchableOpacity>

              )} />
          </View>
          <View style={{ marginRight: 10 }}>
            <FlatList
              data={row2}
              numColumns={2}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={{ marginBottom: 5, }} onPress={() => {
                  if (item.selected == false && item.empty == 'false') {
                    alert("Already Booked! Choose Some other spot")
                  } else {
                    onSelectRow2(index);
                  }
                }}>
                  {item.empty === 'false' && item.selected === true ? (
                    <MaterialIcons name="rectangle" size={40} color="yellow" />
                  ) : item.empty === 'true' && item.selected === false ? (
                    <MaterialIcons name="rectangle" size={40} color="green" />
                  ) : item.empty === 'false' && item.selected === false ? (
                    <MaterialIcons name="rectangle" size={40} color="red" />
                  ) : null}
                </TouchableOpacity>
              )} />
          </View>
        </View>
        <View>
        </View>
      </View>
      <View style={{ bottom: 0, backgroundColor: 'white', height: 60, width: '100%', elevation: 2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 80, marginTop: 20, alignItems:'center' }}>
        <Text style={{ fontSize: 15, fontFamily: 'outfit-medium' }}>{'Selected Spot (' + gerAllSeats() + ')'}</Text>
     <TouchableOpacity onPress={()=>setShowModal(true)} style={{width: '40%', height: 40, backgroundColor: Colors.primary, justifyContent: 'center', marginRight: 80, alignItems: 'center', borderRadius: 40}}>
      <Text style={{color: Colors.WHITE, fontFamily: 'outfit-bold', fontSize: 15}}>
        Book Now
      </Text>
      <Modal
      animationType='slide'
      visible={showModal}>
        <SafeAreaView>
          <Receipt selectedSpot/>
        </SafeAreaView>
      </Modal>
     </TouchableOpacity>
      </View>
    </View>
  )
}

export default BookingModal

const styles = StyleSheet.create({})

