import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
import {
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

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

const db = getFirestore(app);

let postTweetInput = document.getElementById("postTweetInput");
let addTweet = document.getElementById("addTweet");
let tweetsContainer = document.getElementById("tweetsContainer");

function addATweet() {
  addDoc(collection(db, "tweets"), {
    content: postTweetInput.value,
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
  let tweetHTML = `
        <div class="tweet">
        <div class="profileImgTweet"></div>
        <div class="tweetContent">
        <h3>Swati Thorat</h3>
        <p>${postTweetInput.value}</p>
        </div>
        </div> `;
  tweetsContainer.insertAdjacentHTML("beforeend", tweetHTML);
  postTweetInput.value = "";
}

addTweet.addEventListener("click", addATweet);

// async function fetchAllTweets() {
//   const dbref = ref(db);
//   let allTweets = await get(child(dbref, "Tweets/"));
//   console.log(allTweets.val());

// }

// fetchAllTweets();
