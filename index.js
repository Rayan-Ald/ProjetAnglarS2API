// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const express = require('express');
const cors = require('cors');
const {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} = require('firebase/firestore');
const appExpress = express();

const firebaseConfig = {
  apiKey: 'AIzaSyD4qgrCqKwSDkaSjbPoOKM_-kM5JKFXS2Y',
  authDomain: 'gestion-hotel-61a80-3f1f0.firebaseapp.com',
  projectId: 'gestion-hotel-61a80',
  storageBucket: 'gestion-hotel-61a80.appspot.com',
  messagingSenderId: '132753252870',
  appId: '1:132753252870:web:3436659e710b0ae3ec1987',
  measurementId: 'G-DYB671LFHX',
};

// Initialize Firebase
appExpress.use(cors());
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const addDrink = async (userId, centilitres) => {
//   const userRef = doc(db, "user", userId);
//   const userDoc = await getDoc(userRef);
//   if (userDoc.exists()) {
//     const today = new Date().toISOString().substr(0, 10);
//     const userDrinksRef = collection(db, "userDrinks");
//     const queryRef = query(
//       userDrinksRef,
//       where("userId", "==", userId),
//       where("date", "==", today)
//     );
//     const querySnapshot = await getDocs(queryRef);
//     let userDrinksDoc;
//     if (querySnapshot.size === 0) {
//       userDrinksDoc = await addDoc(userDrinksRef, {
//         userId,
//         date: today,
//         total: centilitres,
//       });
//     } else {
//       userDrinksDoc = querySnapshot.docs[0];
//       const data = userDrinksDoc.data();
//       const newTotal = data.total + centilitres;
//       await updateDoc(userDrinksDoc.ref, { total: newTotal });
//     }
//     console.log(`Added ${centilitres} cl to user ${userId} on ${today}`);
//     return { success: true };
//   } else {
//     console.log("User not found");
//     return { success: false, error: "User not found" };
//   }
// };

const getHotels= async () => {
  const hotelsRef = collection(db, 'hotels');
  const queryRef = query(hotelsRef);
  const querySnapshot = await getDocs(queryRef);
  if (querySnapshot.size === 0) {
    console.log('No hotels were found for this id');
    return null;
  } else {
    const hotelsData = querySnapshot.docs[0].data();
    console.log(hotelsData);
    return hotelsData;
  }
};

// appExpress.get('/hotel/:hotelid', async (req, res) => {
//   console.log('GET /hotel/:hotelid');
//   const hotelid = req.params.hotelid;
//   let q = await getHotelParId(hotelid);
//   res.json(q);
// });
appExpress.get('/hotels', async (req, res) => {
  console.log('GET /hotels');
  let q = await getHotels();
  res.json(q);
});

appExpress.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});