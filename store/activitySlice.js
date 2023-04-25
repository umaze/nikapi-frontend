import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {getNewSelectables} from "@/helpers/index";

const initialState = {
    current: {},
    availabilities: [],
    orders: [],
    roles: {},
    selectables: [],
    steps: {}
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
        },
        setMatchingOrders(state, action) {
            state.orders = [
                ...action.payload
            ];
        },
        setAvailabilities(state, action) {
            state.availabilities = [
                ...action.payload
            ];
        },
        setRole(state, action) {
            state.roles = {
                ...state.roles,
                ...action.payload
            };
        },
        addSelectable(state, action) {
            const additionals = getNewSelectables([action.payload], state.selectables);
            state.selectables = [
                ...state.selectables,
                ...additionals
            ];
        },
        initSelectables(state) {
            state.selectables = [];
        },
        initSteps(state) {
            state.steps = {};
        },
        updateSteps(state, action) {
            state.steps = {
                ...state.steps,
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

export const selectMatchingAvailabilities = (demandId, rollen) => state => {
    const availabilitiesOfDemand = state.activity.availabilities?.filter(a => +a.demandId === +demandId);
    const matches = {};
    if (availabilitiesOfDemand?.length > 0) {
        rollen.forEach(rolle => {
            matches[rolle.name] = availabilitiesOfDemand
                .filter(a => a.rollen
                    .some(r => r.name === rolle.name)
                );
        });
    }
    return matches;
}

export const selectMatchingNotConnectedOrders = state => {
    return state.activity.orders?.filter(order => !order.attributes.activity?.data);
}
export const {
    setDemand,
    setMatchingOrders,
    setAvailabilities,
    setRole,
    addSelectable,
    initSelectables,
    initSteps,
    updateSteps
} = activitySlice.actions;
export const selectCurrentDemand = state => state.activity.current;
export const selectMatchingOrders = state => state.activity.orders;
export const getRoles = state => state.activity.roles;
export const getSelectables = state => state.activity.selectables;
export const getSteps = state => state.activity.steps;
export const selectAvailabilities = (state) => {
    return selectMatchingAvailabilities(state)
};
export default activitySlice.reducer;
