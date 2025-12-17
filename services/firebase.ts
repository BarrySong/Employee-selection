import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { SeatData, SeatMap } from "../types";

// TODO: 替换为你自己的 Firebase 配置信息
// 1. Go to https://console.firebase.google.com/
// 2. Create a project -> Add Web App
// 3. Copy the config object below
const firebaseConfig = {
  apiKey: "AIzaSyAZNkpuLk1QKY4sKLLSS2Wui6pQkBCvsF4",
  authDomain: "selection-3f597.firebaseapp.com",
  databaseURL: "https://selection-3f597-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "selection-3f597",
  storageBucket: "selection-3f597.firebasestorage.app",
  messagingSenderId: "702855333448",
  appId: "1:702855333448:web:cc5e0eedb3f7b4e04eba7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 监听整个座位图的变化
export const subscribeToSeats = (callback: (seats: SeatMap) => void) => {
  const seatsRef = ref(db, 'office_seats');
  
  // onValue is a real-time listener. Whenever data changes on the server,
  // this callback runs automatically.
  return onValue(seatsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      callback({});
    }
  });
};

// 更新单个座位
export const updateSeatInDb = (seat: SeatData) => {
  // We use the composite ID as the key in the database
  const seatRef = ref(db, 'office_seats/' + seat.id);
  return set(seatRef, seat);
};
