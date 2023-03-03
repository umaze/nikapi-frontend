import { configureStore } from "@reduxjs/toolkit";
import { availabilitySlice } from "./availabilitySlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [availabilitySlice.name]: availabilitySlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);