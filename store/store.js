import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {availabilitySlice} from "./availabilitySlice";
import {activitySlice} from "@/store/activitySlice";

const makeStore = () =>
    configureStore({
        reducer: {
            [availabilitySlice.name]: availabilitySlice.reducer,
            [activitySlice.name]: activitySlice.reducer,
        },
        devTools: true,
    });

export const wrapper = createWrapper(makeStore);