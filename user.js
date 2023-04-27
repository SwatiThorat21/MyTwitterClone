// Import the functions you need from the SDKs you need
import { searchTweetByContent, getHTMLforTweet} from "./search.js";
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
const user = auth.currentUser;

import {
  getDatabase,
  set,
  get,
  ref,
  child,
  push,
  onChildAdded,
  orderByChild,
  query,
  startAt,
  endAt,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const db = getDatabase();

let tweetsContainer = document.getElementById("tweetsContainer");
let lodingTweets = document.querySelector(".lodingTweets");
let profileImg = document.getElementById("profileImg");
let addTweetsContainer = document.querySelector(".addTweetsContainer");
let myprofileDetails = document.getElementById("myprofileDetails");
let myProfileContainer = document.getElementById("myProfileContainer");
let container = document.getElementById("container");
let searchInput = document.getElementById("searchInput");
let header = document.querySelector("header");

var url_string = window.location;
var newUrl = new URL(url_string);
var userId = newUrl.searchParams.get("user_id");

function getHTMLforMyprofileDetails(user) {
  let myprofileDetailsHTML = `
  <div class="profile_bg"></div>
  <div class="profileImgContain">
  <img src="${user.userPhotoURL}" class="profileImg" id="profileImg"></img>
  </div>
  <h3>${user.userName}</h3>
  <p>${user.userEmail}</p> `;
  return myprofileDetailsHTML;
}

function getHTMLforprofileImg(user) {
  let profileImgHTML = `<img src="${user.userPhotoURL}" alt="" class="profileImgTweet"> `;
  return profileImgHTML;
}
async function handleOnChildAdded(data) {
  lodingTweets.style.display = "none";
  tweetsContainer.insertAdjacentHTML("afterbegin", await getHTMLforTweet(data));
}

function fetchTweets() {
  const db = getDatabase();
  const tweetsRef = query(
    ref(db, "tweets"),
    orderByChild("userId"),
    startAt(userId),
    endAt(userId + "\uf8ff")
  );
  onChildAdded(tweetsRef, handleOnChildAdded);
  lodingTweets.style.display = "none";
}

function getUserDetails() {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      addTweetsContainer.style.display = "block";
      header.style.display = "flex";
      container.classList.add("containerBg");
      container.classList.remove("containerWithBgImage");
      myProfileContainer.style.display = "block";
      fetchTweets();
      myprofileDetails.innerHTML = getHTMLforMyprofileDetails(snapshot.val());
     
    }
  });
}

getUserDetails();

searchInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    searchTweetByContent(e);
  }
});


