// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBNpq_CywhebNsEEMg8cxjNfIHRBQw-ygk",
  authDomain: "mytwitterclone-43c08.firebaseapp.com",
  databaseURL:
    "https://mytwitterclone-43c08-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytwitterclone-43c08",
  storageBucket: "mytwitterclone-43c08.appspot.com",
  messagingSenderId: "178203321423",
  appId: "1:178203321423:web:9e35de5b8e51458098f63a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
  push,
  onChildAdded,
  orderByValue,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const db = getDatabase();

let postTweetInput = document.getElementById("postTweetInput");
let addTweet = document.getElementById("addTweet");
let tweetsContainer = document.getElementById("tweetsContainer");
let loginBtn = document.getElementById("loginBtn");

function addATweet() {
  if (!postTweetInput.value) {
    alert("Please add a tweet");
    return false;
  } else {
    let postTweets = ref(db, "tweets");
    let newTweets = push(postTweets);
    set(newTweets, {
      content: postTweetInput.value,
    })
      .then(() => {
        alert("Data added sucessfully!");
      })
      .catch((error) => {
        alert(error);
      });
  }
}
addTweet.addEventListener("click", addATweet);

function fetchTweets() {
  const db = getDatabase();
  const tweetsRef = ref(db, "tweets", orderByValue("content"));
  onChildAdded(tweetsRef, (data) => {
    let tweetHTML = `
    <div class="tweet">
    <div class="profileImgTweet"></div>
    <div class="tweetContent">
        <h3>Swati Thorat</h3>
        <p>${data.val().content}</p>
    </div>
    </div> `;
    postTweetInput.value = "";
    tweetsContainer.insertAdjacentHTML("afterbegin", tweetHTML);
  });
}

fetchTweets();

loginBtn.addEventListener("click", (e) => {
  signInWithRedirect(auth, provider);
  getRedirectResult(auth)
    .then((result) => {
      
            // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log(JSON.stringify(user));
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});
