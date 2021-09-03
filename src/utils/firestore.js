import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAsNXiMi7xpVMVNexMFGppgZl_ASeXO3uI',
  authDomain: 'infogenius.firebaseapp.com',
  projectId: 'infogenius',
  storageBucket: 'infogenius.appspot.com',
  messagingSenderId: '850528171405',
  appId: '1:850528171405:web:1fb1fed3f79008fb1739c4'
};
initializeApp(firebaseConfig);
export default getFirestore();
