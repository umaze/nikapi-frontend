import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    current: {}
};

// Actual Slice
export const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {
        // Action to update activity
        updateActivity(state, action) {
            state.current = {
                ...state.current,
                ...action.payload
            };
        },
        setDemand(state, action) {
            state.current = {
                ...action.payload
            };
        }
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.activity,
            };
        },
    },
});


export const { setDemand } = activitySlice.actions;
export const selectCurrentActivity = state => state.activity.current;
export default activitySlice.reducer;
