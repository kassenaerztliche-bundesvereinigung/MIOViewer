/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
 *
 * This file is part of MIO Viewer.
 *
 * MIO Viewer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation version 3 of the License only.
 *
 * MIO Viewer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with MIO Viewer. If not, see <https://www.gnu.org/licenses/>.
 */

import { combineReducers, createStore } from "redux";

import {
    mioReducer,
    initialMIOState,
    settingsReducer,
    initialSettingsState
} from "./reducers";

import { MIOState, SettingsState } from "./Types";

export interface MIOViewerRootState {
    mioState: MIOState;
    settingsState: SettingsState;
}

// Change to persist MIOs in localStorage for development
const useLocalStore = false;

const miosName = "MIO-Viewer-MIOs";
let storedMIOs = undefined;
if (useLocalStore) storedMIOs = localStorage.getItem(miosName);

const settingsName = "MIO-Viewer-Settings";
const storedSettings = localStorage.getItem(settingsName);

const persistedState = {
    mioState: storedMIOs ? JSON.parse(storedMIOs) : initialMIOState,
    settingsState: storedSettings ? JSON.parse(storedSettings) : initialSettingsState
};

// https://github.com/zalmoxisus/redux-devtools-extension#usage
const Store = createStore(
    combineReducers({
        mioState: mioReducer,
        settingsState: settingsReducer
    }),
    persistedState
);

Store.subscribe(() => {
    localStorage.setItem(
        miosName,
        JSON.stringify(useLocalStore ? Store.getState().mioState : initialMIOState)
    );
});

Store.subscribe(() => {
    localStorage.setItem(settingsName, JSON.stringify(Store.getState().settingsState));
});

export default Store;
