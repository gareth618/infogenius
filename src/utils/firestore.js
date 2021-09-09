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

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents/comments {
//     match /{document=**} {
//       allow read;
//       allow create: if request.auth != null;
//     }
//   }
//   match /databases/{database}/documents/users {
//     match /{document=**} {
//       allow read;
//       allow create: if request.auth != null;
//       allow update: if request.auth != null;
//     }
//   }
// }
