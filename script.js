// -------------------- MY MODULE -------------------- //
// import { chuanHoaTen } from "./chuanHoaTen.helper";

// -------------------- FIREBASE -------------------- //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

const db = getDatabase();
const todoReference = ref(db, 'todos');

const todoApp = document.querySelector(".todo-app");


if(todoApp) {

  // lấy các class todo
  const todoAppCreate = todoApp.querySelector(".todo-app__create");
  const todoAppList = todoApp.querySelector(".todo-app__list");

  // Tạo mới công việc

  // lắng nghe sự kiện "submit" của form tạo công việc mới
  todoAppCreate.addEventListener("submit", (event) => {
    event.preventDefault(); // ngăn chặn sự kiện mặc định

    const content = todoAppCreate.content.value; // .content là . vào thuộc tính name của trong form todoAppCreate

    todoAppCreate.content.value = ""; 

    const record  = {
      title: content,
      complete: false, // chưa hoàn thành công việc (việc mới tạo)
    }
    const newRecords = push(todoReference); // tạo bản ghi mới có ID riêng biệt

    set(newRecords, record); // tạo bản ghi đưa lên database
  });
  // Hết Tạo mới công việc

  // Hiển thị danh sách công việc (Công việc mới tạo sẽ hiện lên đầu)
  onValue(todoReference, (records) => {
    let htmls = "";

    records.forEach(record => {
      htmls = `
        <div class="todo-app__item">
            <span class="todo-app__item-content">${record.val().title}</span>
            <div class="todo-app__item-actions">
                <button 
                  class="todo-app__item-button todo-app__item-buton--complete"
                  todo-id = ${record.key}
                >
                    <i class="fa-solid fa-check"></i>
                </button>
                <button 
                  class="todo-app__item-button todo-app__item-buton--edit"
                  todo-id = ${record.key} 
                >
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                  class="todo-app__item-button todo-app__item-buton--delete"
                  todo-id = ${record.key}
                >
                    <i class="fa-solid fa-trash"></i>  
                </button>
            </div>
        </div>
      ` + htmls;
    });
    todoAppList.innerHTML = htmls;
  });
  // Hết Hiển thị danh sách công việc

}
// Hết Todo App


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
