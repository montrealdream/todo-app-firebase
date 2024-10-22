// -------------------- FIREBASE -------------------- //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getDatabase, ref, push, set, onValue, remove, update  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

// module alert
import showAlert from "./show-alert.js";

const typeSelect = {
  "delete":  {
    icon : `<i class="fa-solid fa-circle-exclamation"></i>`,
    query: `Xóa công việc`,
    element: '<span class="modal__content">Bạn có chắc chắn bạn muốn xóa công việc này không ?</span>',
    buttonAccept: "Xác nhận"
  },

  "edit" : {
    icon: `<i class="fa-solid fa-pen-to-square"></i>`,
    query: `Chỉnh sửa công việc`,
    element: `<input class="modal__input" name="content">`,
    buttonAccept: "Cập nhật"
  }
}

// close modal
const closeModal = (element) => {
  // khi nhấn overlay thì close cái này luôn
  const overlay = document.querySelector(".overlay");
  overlay.addEventListener("click", event => {
    document.body.removeChild(element);
  });

  // khi nhấn nút cancle thì cũng close luôn
  const buttonCancle = element.querySelector("[button-cancle]");
  buttonCancle.addEventListener("click", event => {
    document.body.removeChild(element);
  });
}
// hết close modal

// khi nhấn nút xác nhận
const acceptModal = (type = null, id, element) => {
  const buttonAccept = element.querySelector(`[button-accept]`);
  buttonAccept.addEventListener("click", event => {
    // nếu kiểu là xóa
    if(type === "delete") {
      remove(ref(db, 'todos/' + id)).then(() => { 
        document.body.removeChild(element);
        showAlert("Xóa thành công", "success", 5000);
      });
    }

    // nếu là cập nhật bản ghi
    else if(type === "edit") {
      const content = element.querySelector(".modal__input").value;
      if(content) {
        const dataUpdate = {
          title: content
        };

        document.body.removeChild(element); 

        update(ref(db, 'todos/' + id), dataUpdate)
        .then(() => {
          showAlert("Cập nhật thành công", "success", "5000");
        })
        .catch(() => {
          showAlert("Cập nhật thất bại", "error", "5000");
        });
      }
    }
  });
}
// hết khi nhấn nút xác nhận

// Thông báo confirm
const showConfirm = (type = null, id) => {
  if(type === null) return;

  const newModal = document.createElement("div");

  newModal.setAttribute("class", "modal");

  newModal.innerHTML = `
    <div class="modal__wrap">
      <span class="modal__icon modal__icon--${type}">
        ${typeSelect[type].icon}
      </span>
      <h3 class="modal__query">${typeSelect[type].query}</h3>
      ${typeSelect[type].element}
      <div class="modal__buttons"> 
        <button 
          class="modal__button modal__button--${type}"
          button-accept  
        > 
          ${typeSelect[type].buttonAccept}
        </button>
        <button 
          class="modal__button modal__button-cancle"
          button-cancle
        > 
          Dừng lại
        </button>
      </div>
    </div>
    <div class="overlay"></div>
  `;
  document.body.appendChild(newModal);

  // đóng modal nếu có nhấn vào overlay hoặc nút cancle
  closeModal(newModal);
  // khi nhấn xác nhận 
  acceptModal(type, id, newModal);

  // nếu là kiểu (type) edit thì sẽ gắn thêm title vào ô input
  if(type === "edit" && newModal) {
    onValue(ref(db, '/todos/' + id), (record) => {
      if(record.val().title) {
        const title = record.val().title || "";
        newModal.querySelector("input[name='content']").value = title;
      }
    });
  }
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
    let htmlsComplete = "";
    let htmlsInComplete = "";

    records.forEach(record => {
      const data = record.val();

      const buttonConfig = {
        true: `
          <button 
              class="todo-app__item-button todo-app__item-buton--delete"
              todo-delete = ${record.key}
            >
                <i class="fa-solid fa-trash"></i>  
          </button>
        `,

        false: `
          <button 
            class="todo-app__item-button todo-app__item-buton--complete"
            todo-complete = ${record.key}
          >
              <i class="fa-solid fa-check"></i>
          </button>
            <button 
              class="todo-app__item-button todo-app__item-buton--edit"
              todo-edit = ${record.key} 
            >
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button 
              class="todo-app__item-button todo-app__item-buton--delete"
              todo-delete = ${record.key}
            >
                <i class="fa-solid fa-trash"></i>  
          </button>
        `
      }
      
      if(data.complete) {
        htmlsComplete = `
          <div class="todo-app__item ${data.complete === true ? "todo-app__item--finish" : ""}">
              <span class="todo-app__item-content">${data.title}</span>
              <div class="todo-app__item-actions">
                ${buttonConfig[data.complete]}
              </div>
          </div>
        ` + htmlsComplete;
      }

      else {
        htmlsInComplete = `
          <div class="todo-app__item ${data.complete === true ? "todo-app__item--finish" : ""}">
              <span class="todo-app__item-content">${data.title}</span>
              <div class="todo-app__item-actions">
                ${buttonConfig[data.complete]}
              </div>
          </div>
        ` + htmlsInComplete;
      }
    });

    // công việc nào hoàn thành sẽ bị đưa xuống dưới
    let htmls = htmlsInComplete + htmlsComplete;
    todoAppList.innerHTML = htmls; 

    // Tính năng xóa công việc
    const listButtonDelete = todoAppList.querySelectorAll("[todo-delete]");
    listButtonDelete.forEach(button => {
      button.addEventListener("click", (event) => {
        const id = button.getAttribute("todo-delete");
        showConfirm("delete", id);
      });
    });
    // Hết tính năng xóa công việc

    // Tính năng chỉnh sửa công việc
    const listButtonEdit = todoAppList.querySelectorAll("[todo-edit]");
    listButtonEdit.forEach(button => {
      button.addEventListener("click", (event) => {
        const id = button.getAttribute("todo-edit");
        showConfirm("edit", id);
      });
    });
    // Hết Tính năng chỉnh sửa công việc

    // Tính năng hoàn thành công việc
    const listButtonComplete = todoAppList.querySelectorAll("[todo-complete]");
    listButtonComplete.forEach(button => {
      button.addEventListener("click", event => {
        const id = button.getAttribute("todo-complete");
        const dataUpdate = {
          complete: true
        };
        
        update(ref(db, 'todos/' + id), dataUpdate).then(() => {
          showAlert("Cập nhật thành công", "success", 3000);
        });
      });
    });
    // Hết Tính năng hoàn thành công việc
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