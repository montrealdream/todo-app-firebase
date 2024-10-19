// -------------------- FIREBASE -------------------- //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlIAhRIl0ulkBn50vZ9H0UqlO7BUkZdlA",
  authDomain: "todo-app-81e37.firebaseapp.com",
  databaseURL: "https://todo-app-81e37-default-rtdb.firebaseio.com",
  projectId: "todo-app-81e37",
  storageBucket: "todo-app-81e37.appspot.com",
  messagingSenderId: "739433229549",
  appId: "1:739433229549:web:6de4130200b0a56bcd30e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);







// dark mode và light mode
const buttonBackgroundMode = document.querySelector(".button-bg-mode");
if(buttonBackgroundMode) {

  // lắng nghe sự kiện nhấn nút chuyển mode
  buttonBackgroundMode.addEventListener("click", (event) => {
    // thêm hoặc xóa class dark 
    document.body.classList.toggle("dark");

    // set local storage
    if(document.body.classList.contains("dark")) 
        localStorage.setItem("lightDarkMode", "dark");

    else 
      localStorage.setItem("lightDarkMode", "");
  });  
}
// hết dark mode và light mode


// check xem trang web có đang ở chế độ dark mode không
const isDarkMode = (localStorage.getItem("lightDarkMode") === "dark");
if(isDarkMode === true) {
  document.body.classList.add("dark");
}
// hết check xem trang web có đang ở chế độ dark mode không
