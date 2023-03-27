// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

import {
  getDatabase,
  set,
  get,
  update,
  remove,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";

const db = getDatabase();

let postTweetInput = document.getElementById("postTweetInput");
let addTweet = document.getElementById("addTweet");
let tweetContent = document.querySelector(".tweetContent");

function addATweet() {
  set(ref(db, "Tweets/" + postTweetInput.value), {
    tweet: postTweetInput.value,
  })
    .then(() => {
      alert("Data added sucessfully!");
    })
    .catch((error) => {
      alert(error);
    });

  postATweet();
}

function postATweet() {
    const dbref = ref(db);
    
    get(child(dbref, "Tweets/" + postTweetInput.value))
    .then((snapshot) => {
        if (snapshot.exists()) {
            tweetContent.innerHTML = `
            <h3>Swati Thorat</h3>
            <p>${snapshot.val().tweet}</p> `;
        } else {
            alert("Please add a tweet");
        }
    })
    .catch((error) => {
        alert(error);
    });
}

addTweet.addEventListener("click", addATweet);