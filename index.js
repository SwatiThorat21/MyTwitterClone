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
  getRedirectResult,
  onAuthStateChanged,
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
    onAuthStateChanged(auth, (user) => {
      let currentDate = new Date();
      let date = currentDate.getDate();
      let month = currentDate.getMonth();
      let allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let monthName = allMonths[month];
      let hours = (currentDate.getHours() % 12) || 12 
      let amPm =  currentDate.getHours()<12 ? "AM":"PM";

      let tweetHTML = `
        <div class="tweet">
        <img src="${user.photoURL}" class="profileImgTweet"></img>
        <div class="tweetContent">
        <h3>${user.displayName}</h3>
        <p>${data.val().content}</p>
        </div>
        <p class="currentDateTime">${monthName} ${date} :  ${hours} ${amPm}</p>
        </div> `;
      postTweetInput.value = "";
      tweetsContainer.insertAdjacentHTML("afterbegin", tweetHTML);
    });
  });
}

fetchTweets();

loginBtn.addEventListener("click", (e) => {
  signInWithRedirect(auth, provider);
  getRedirectResult(auth)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;

      //displayName, email, photoURL
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
});

let myprofileDetails = document.getElementById("myprofileDetails");
let logInBtnContainer = document.getElementById("logInBtnContainer");

function updateUserDetails() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //  const uid = user.uid;
      myprofileDetails.style.display = "block";
      logInBtnContainer.style.display = "none";
      myprofileDetails.innerHTML = `
      <div id="profile_bg"></div>
      <div id="profileImg">
      <img src="${user.photoURL}" class="profileImg"></img>
      </div>
      <h3>${user.displayName}</h3>
      <p>${user.email}</p> `;
    } else {
      myprofileDetails.style.display = "none";
      logInBtnContainer.style.display = "block";
      tweetsContainer.style.display = "none";
    }
  });
}

updateUserDetails();
