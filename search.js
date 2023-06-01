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
const user = auth.currentUser;

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

let tweetsContainer = document.getElementById("tweetsContainer");
const db = getDatabase();

export async function getHTMLforTweet(data) {
  const dbref = ref(db);
  const user = await get(child(dbref, "users/" + data.val().userId));
  if (user.exists()) {
    let tweetCurrentDate = data.val().date;
    let currentDate = new Date(tweetCurrentDate);
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
    let tweetHTML = `
        <div class="tweet" id="tweetData">
              <a class="tweetUserName" href="user.html?user_id=${data.val().userId}"><img src="${user.val().userPhotoURL}" class="profileImgTweet"></img></a>
              <a class="tweetUserName" href="user.html?user_id=${data.val().userId}">${user.val().userName}</a>
              <p class="currentDateTime">${tweetDate}</p>
              <div class="tweetContent">
                  <p>${data.val().content}</p>
             </div>
        </div> `;
    return tweetHTML;
  } else {
    alert("No data found");
  }
}

export function searchTweetByContent(e) {
  let searchInputText = e.target.value;
  if (searchInputText.length === 0) {
    return;
  }
  tweetsContainer.innerHTML = "";
  const db = getDatabase();
  const tweetsRef = query(
    ref(db, "tweets"),
    orderByChild("content"),
    startAt(searchInputText),
    endAt(searchInputText + "\uf8ff")
  );
  onChildAdded(tweetsRef, async function (data) {
    tweetsContainer.insertAdjacentHTML(
      "afterbegin",
      await getHTMLforTweet(data)
    );
  });
}

export function searchTweetByUsername(e) {
  let searchInputText = e.target.value;
  if (searchInputText.length === 0) {
    return;
  }
  tweetsContainer.innerHTML = "";
  const db = getDatabase();
  const userRef = query(
    ref(db, "users/"),
    orderByChild("userName"),
    startAt(searchInputText),
    endAt(searchInputText + "\uf8ff")
  );
  onChildAdded(userRef, async function (data) {
    let userId = data.val().userId;
    const tweetsRef = query(
      ref(db, "tweets"),
      orderByChild("userId"),
      startAt(userId),
      endAt(userId + "\uf8ff")
    );
    onChildAdded(tweetsRef, async function (data) {
      tweetsContainer.insertAdjacentHTML(
        "afterbegin",
        await getHTMLforTweet(data)
      );
    });
  });
}
