import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import _ from "lodash";

const initialState = {
    selected: []
};

// Actual Slice
export const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {
        // Action to update availability
        updateAvailability: (state, action) => {
            if (action.payload.checked) {
                if (!state.selected.some(item => containsRole(item, action.payload))) {
                    state.selected = [...state.selected, action.payload];
                }
            } else {
                state.selected = [...state.selected.filter(item => !containsRole(item, action.payload))]
            }
        }
    },
    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.availability,
            };
        },
    },
});

const containsRole = (source, target) => source.groupId === target.groupId && source.demandId === target.demandId && source.name === target.name;

const selectAvailabilitiesAndSortedByGroup = (state) => {
    const source = state.availability?.selected;
    return _.orderBy(source, ['groupId'], ['asc']);
};

export const { updateAvailability } = availabilitySlice.actions;
export const selectAvailabilities = (state) => { return selectAvailabilitiesAndSortedByGroup(state) };
export default availabilitySlice.reducer;
