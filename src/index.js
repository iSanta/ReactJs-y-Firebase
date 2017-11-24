import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';



// conexion establecida con el back de Google Firebase
firebase.initializeApp({
  apiKey: "AIzaSyARFeUXNx9CzxvvjflfQQ1C6KbIqTA5WEg",
  authDomain: "pseudogram-2beeb.firebaseapp.com",
  databaseURL: "https://pseudogram-2beeb.firebaseio.com",
  projectId: "pseudogram-2beeb",
  storageBucket: "pseudogram-2beeb.appspot.com",
  messagingSenderId: "24286195781"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
