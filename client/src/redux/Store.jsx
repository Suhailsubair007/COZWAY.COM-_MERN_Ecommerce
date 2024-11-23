import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import adminReducer from "./AdminSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export default store;
