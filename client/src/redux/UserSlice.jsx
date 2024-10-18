import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(state.userData));
    },
    userLogout: (state) => {
      state.userData = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUserInfo, userLogout } = userSlice.actions;
export default userSlice.reducer;
