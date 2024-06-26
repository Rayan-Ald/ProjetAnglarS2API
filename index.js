// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} = require('firebase/auth');
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
const auth = getAuth(app);

appExpress.use(express.json());

const getHotels = async () => {
  const hotelsRef = collection(db, 'hotels');
  const queryRef = query(hotelsRef);
  const querySnapshot = await getDocs(queryRef);
  if (querySnapshot.size === 0) {
    console.log('No hotels were found for this id');
    return null;
  } else {
    const hotelsData = [];
    //foreach querySnapshot.docs
    for (const doc of querySnapshot.docs) {
      hotelsData.push(doc.data());
    }
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

// ////////////// client part //////////////////

async function login(email, password) {
  console.log(email, password);

  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in
    var user = userCredential.user;
    console.log(userCredential);
    if (user) {
      console.log('SUCCESSSSSSSSSSSSSSSSSSSSSSSS');
      return { success: true, user: user };
    } else {
      return { success: false, message: 'invalid credentials' };
    }
  } catch (error) {
    return { success: false, message: 'invalid credentials' };
  }
}

async function signin(email, password) {
  console.log(email, password);
  try {
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    var user = userCredential.user;
    if (user) {
      // Signed in
      console.log(user);
      return { success: true, user: user };
    } else {
      return { success: false, message: 'invalid credentials' };
    }
  } catch {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return { success: false, message: 'invalid credentials' };
  }
}

function logout() {
  signOut(auth)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
    });
}
appExpress.get('/hotels', async (req, res) => {
  console.log('GET /hotels');
  let q = await getHotels();
  res.json(q);
});

appExpress.post('/loginUser', async (req, res) => {
  console.log('LOGIN user');
  console.log(req.body);

  let q = await login(req.body.email, req.body.password);
  console.log('result', q);
  if (q.success) {
    res.status(200).json(q.user);
  } else {
    res.status(201).json({ message: 'Utilisateur non trouvé' });
  }
});

appExpress.post('/signinUser', async (req, res) => {
  console.log('SIGNIN user');
  console.log(req.body);
  try {
    let q = await signin(req.body.email, req.body.password);
    console.log('user ', q);
    if (q) {
      res.status(200).json(q);
    } else {
      res.status(201).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(201).json({ message: 'Erreur du serveur' });
  }
});

appExpress.get('/logout', function (req, res) {
  console.log('LOGOUT user');
  let q = logout();
  res.json(q);
});

appExpress.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
