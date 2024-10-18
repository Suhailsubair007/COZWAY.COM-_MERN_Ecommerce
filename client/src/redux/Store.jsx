import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import AdminSlice from'./AdminSlice';
const Store = configureStore({
  reducer: {
    user: UserSlice,
    admin:AdminSlice,
  },
});
export default Store;
