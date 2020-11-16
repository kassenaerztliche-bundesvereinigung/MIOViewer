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

import { Constants, SettingsActions, SettingsState } from "../Types";

const initialSettingsState: SettingsState = {
    showIntro: true,
    cookiesAccepted: false
};

export { initialSettingsState };

export function settingsReducer(
    state: SettingsState = initialSettingsState,
    action: SettingsActions
): SettingsState {
    // To avoiding mutations in Redux use Object.assign and Arrays concat, slice and spread
    const payload = action.payload;

    if (action.type === Constants.SHOW_INTRO) {
        return { ...state, showIntro: payload.value };
    } else if (action.type === Constants.ACCEPT_COOKIES) {
        return { ...state, cookiesAccepted: payload.value };
    } else {
        return state;
    }
}
