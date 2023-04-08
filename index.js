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
let lodingTweets = document.querySelector(".lodingTweets");
let profileImg = document.getElementById("profileImg");

function onAddATweetBtn() {
  if (!postTweetInput.value) {
    postTweetInput.classList.add("error_msgInput");
    document.querySelector(".error_msg").style.display = "block";
    return false;
  } else {
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
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    let monthName = allMonths[month];
    let hours = currentDate.getHours() % 12 || 12;
    let minutes = currentDate.getMinutes();
    let amPm = currentDate.getHours() < 12 ? "AM" : "PM";
    let tweetDate =
      date +
      nth(date) +
      " " +
      monthName +
      ", " +
      pad(hours) +
      ":" +
      pad(minutes) +
      amPm;

    let postTweets = ref(db, "tweets");
    let newTweets = push(postTweets);
    set(newTweets, {
      content: postTweetInput.value,
      date: tweetDate,
    })
      .then(() => {
        alert("Data added sucessfully!");
      })
      .catch((error) => {
        alert(error);
      });
  }
}
addTweet.addEventListener("click", onAddATweetBtn);

function fetchTweets() {
  const db = getDatabase();
  const tweetsRef = ref(db, "tweets", orderByValue("content"));
  onChildAdded(tweetsRef, (data) => {
    onAuthStateChanged(auth, (user) => {

      postTweetInput.addEventListener("focus", () => {
        document.querySelector(".error_msg").style.display = "none";
      });
      postTweetInput.classList.remove("error_msgInput");

      lodingTweets.style.display = "none";
      
      let tweetHTML = `
        <div class="tweet">
        <img src="${user.photoURL}" class="profileImgTweet"></img>
        <div class="tweetContent">
        <h3>${user.displayName}</h3>
        <p>${data.val().content}</p>
        </div>
        <p class="currentDateTime">${data.val().date}</p>
        </div> `;
      postTweetInput.value = "";
      tweetsContainer.insertAdjacentHTML("afterbegin", tweetHTML);

      let profileImgHTML = `<img src="${user.photoURL}" alt="" class="profileImgTweet"> `;
      profileImg.innerHTML = profileImgHTML;
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
      <div class="profile_bg"></div>
      <div class="profileImgContain">
      <img src="${user.photoURL}" class="profileImg"></img>
      </div>
      <h3>${user.displayName}</h3>
      <p>${user.email}</p> `;
    } else {
      myprofileDetails.style.display = "none";
      logInBtnContainer.style.display = "flex";
      tweetsContainer.style.display = "none";
    }
  });
}

updateUserDetails();
