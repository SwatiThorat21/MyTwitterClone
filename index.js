// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBNpq_CywhebNsEEMg8cxjNfIHRBQw-ygk",
  authDomain: "mytwitterclone-43c08.firebaseapp.com",
  databaseURL: "https://mytwitterclone-43c08-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytwitterclone-43c08",
  storageBucket: "mytwitterclone-43c08.appspot.com",
  messagingSenderId: "178203321423",
  appId: "1:178203321423:web:9e35de5b8e51458098f63a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

const db = getDatabase();

let postTweetInput = document.getElementById("postTweetInput");
let addTweet = document.getElementById("addTweet");
let tweetsContainer = document.getElementById("tweetsContainer");

function addATweet() {
  if(!postTweetInput.value) alert("Please add a tweet");
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

    renderTweetHTML();
}

function renderTweetHTML() {
  let tweetHTML = `
        <div class="tweet">
        <div class="profileImgTweet"></div>
        <div class="tweetContent">
            <h3>Swati Thorat</h3>
            <p>${postTweetInput.value}</p>
        </div>
        </div> `;
  tweetsContainer.insertAdjacentHTML("beforeend", tweetHTML);
  tweetsContainer.insertAdjacentHTML("beforeend", tweetHTML);
  postTweetInput.value = "";
}

addTweet.addEventListener("click", addATweet);

function fetchTweets() {
  const db = getDatabase();
  const tweetsRef = ref(db, "tweets");
  onChildAdded(tweetsRef, (data) => {
    console.log(data.val().content);
    let tweetHTML = `
    <div class="tweet">
    <div class="profileImgTweet"></div>
    <div class="tweetContent">
        <h3>Swati Thorat</h3>
        <p>${data.val().content}</p>
    </div>
    </div> `;
    tweetsContainer.insertAdjacentHTML("beforeend", tweetHTML);
  });
}

fetchTweets();
