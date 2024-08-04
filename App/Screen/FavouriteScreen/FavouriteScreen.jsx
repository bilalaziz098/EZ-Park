import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getFirestore } from 'firebase/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import Colors from '../../../utils/Colors'
import { useUser } from '@clerk/clerk-expo';
import {app} from '../../../utils/FirebaseConfig'
import PlaceItem from '../HomeScreen/PlaceItem';

export default function FavouriteScreen() {

  useEffect(() => {
    user&&getFav();
  },[user])
  const [loading, setLoading]= useState(false);
  const {user}=useUser();
  const [favList, setFavList]= useState([]);
  const getFav = async() => {
    setLoading(true)
    const db = getFirestore(app);
    setFavList([])
    const q = query(collection(db, "fav-parking"), where("email", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      setFavList(favList=>[...favList,doc.data()]);
      setLoading(false);
    });
  }
  return (
    <View>
      <Text style={{padding: 10, fontFamily: 'outfit-medium', fontSize: 30}}>My Favourite <Text style={{color:Colors.primary}}>Spots</Text></Text>
      {!favList?<View style={{ height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator
      size={'large'}
      color={Colors.primary}
      />
      <Text style={{fontFamily: 'outfit', marginTop: 5}}>Loading...</Text>
      </View>:null}
      <FlatList
      data={favList}
      onRefresh={()=>getFav()}
      refreshing={loading}
      style={{marginBottom: 70, width: '100%'}}
      
      renderItem={({item, index})=>(
        <PlaceItem place={item.place} isFav={true}
        markedFav={()=>getFav()}
        />
      )}
      />
      <View style={{marginBottom: 200}}>

      </View>
    </View>
  )
}