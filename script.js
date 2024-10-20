// -------------------- MY MODULE -------------------- //
// import { chuanHoaTen } from "./chuanHoaTen.helper";

// -------------------- FIREBASE -------------------- //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
const alert = document.querySelector(".alert");


// Thông báo alert
const showAlert = (content = null, state, time) => {
  if(content === null) return; // nếu không có nội dung thì return luôn

  const newAlertItem = document.createElement("div");

  newAlertItem.setAttribute("class", `alert__item alert--${state}`); 
  newAlertItem.innerHTML = `
    <span> ${content} ! </span>
    <span close-alert>
      <i class="fa-solid fa-xmark"></i>
    </span>
  `;
  alert.appendChild(newAlertItem);

  // khi nhấn vào nút close alert thì sẽ tắt alert đó
  const closeAlertItem = newAlertItem.querySelector("[close-alert");
  closeAlertItem.addEventListener("click", (event) => {
    newAlertItem.style.display = "none";
  });

  // sau TIME giây nếu không nhấn vào close alert thì nó sẽ tự tắt
  setTimeout(() => {
    // newAlertItem.style.display = "none";
    newAlertItem.classList.add("hideAlert");
  }, time);
}
// Hết Thông báo alert

// Thông báo confirm
const showConfirm = (type = null, id) => {
  if(type === null) return;

  const typeSelect = {
    "delete":  {
      icon : `<i class="fa-solid fa-circle-exclamation"></i>`,
      query: `Xóa công việc`,
      content: `Bạn có chắc chắn bạn muốn xóa công việc này không`
    }
  }

  const newModalConfirm = document.createElement("div");

  newModalConfirm.setAttribute("class", "modal");

  newModalConfirm.innerHTML = `
    <div class="modal__wrap">
      <span class="modal__icon modal__icon--${type}">
        ${typeSelect[type].icon}
      </span>
      <h3 class="modal__query">${typeSelect[type].query}</h3>
      <span class="modal__content">${typeSelect[type].content}</span>
      <div class="modal__buttons"> 
        <button class="modal__button modal__button--${type}"> 
          Xác nhận
        </button>
        <button class="modal__button modal__button-cancle"> 
          Dừng lại
        </button>
      </div>
    </div>
    <div class="overlay"></div>
  `;

  document.body.appendChild(newModalConfirm);

  // khi nhấn overlay thì close cái này luôn
  const overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", event => {
    document.body.removeChild(newModalConfirm);
  });

  // khi nhấn nút cancle thì cũng close luôn
  const buttonCancle = newModalConfirm.querySelector(".modal__button-cancle");
  buttonCancle.addEventListener("click", (evnet) => {
    document.body.removeChild(newModalConfirm);
  });

  // khi nhấn xác nhận 
  const buttonAccept = newModalConfirm.querySelector(`.modal__button--${type}`);
  buttonAccept.addEventListener("click", event => {
    // nếu kiểu là xóa
    if(type === "delete") {
      remove(ref(db, 'todos/' + id));
      document.body.removeChild(newModalConfirm);
      showAlert("Xóa thành công", "success", 5000);
    }
  });
}
// Hết Thông báo confirm

// Todo App
if(todoApp) {

  // lấy các class todo
  const todoAppCreate = todoApp.querySelector(".todo-app__create");
  const todoAppList = todoApp.querySelector(".todo-app__list");

  // Tạo mới công việc, lắng nghe sự kiện "submit" của form tạo công việc mới
  todoAppCreate.addEventListener("submit", (event) => {
    event.preventDefault(); // ngăn chặn sự kiện mặc định

    if(todoAppCreate.content.value === "") return; // nếu không nhập gì hết thì không tạo

    const content = todoAppCreate.content.value; // .content là . vào thuộc tính name của trong form todoAppCreate
    todoAppCreate.content.value = ""; 

    const record  = {
      title: content,
      complete: false, // chưa hoàn thành công việc (việc mới tạo)
    }
    const newRecords = push(todoReference); // tạo bản ghi mới có ID riêng biệt

    set(newRecords, record); // tạo bản ghi đưa lên database

    // khi tạo thành công thì hiển thị thông báo đẩy alert
    showAlert("Tạo thành công", "success", 3000);
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
                  todo-delete = ${record.key}
                >
                    <i class="fa-solid fa-trash"></i>  
                </button>
            </div>
        </div>
      ` + htmls;
    });
    todoAppList.innerHTML = htmls;

    // Tính năng xóa công việc
    const listButtonDelete = todoAppList.querySelectorAll("[todo-delete]");
    listButtonDelete.forEach(button => {
      button.addEventListener("click", (event) => {
        const id = button.getAttribute("todo-delete");
        // remove(ref(db, 'todos/' + id));
        showConfirm("delete", id);
      });
    });
    // Hết tính năng xóa công việc
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