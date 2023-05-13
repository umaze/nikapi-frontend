import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    activatedNavMenu: ''
};

// Actual Slice
export const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        // Action to set activated navigation menu
        setActivatedNavMenu(state, action) {
            state.activatedNavMenu = action.payload;
        },
    }
});
export const {
    setActivatedNavMenu
} = applicationSlice.actions;
export const selectActivatedNavMenu = state => state.application.activatedNavMenu;
export default applicationSlice.reducer;
