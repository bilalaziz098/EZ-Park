// firebaseService.js
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { app } from './FirebaseConfig';

const db = getFirestore(app);

export const getParkingLocations = async () => {
  const querySnapshot = await getDocs(collection(db, 'parkingLocation'));
  return querySnapshot.docs.map(doc => doc.data());
};

export const bookParkingSpot = async (place, user) => {
  await setDoc(doc(db, "bookings", `${user.id}_${place.id}`), {
    place,
    user: {
      id: user.id,
      email: user.primaryEmailAddress.emailAddress
    },
    timestamp: new Date()
  });
};
