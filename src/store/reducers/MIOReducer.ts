/*
 * Copyright (c) 2020 - 2022. Kassenärztliche Bundesvereinigung, KBV
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

import { Constants, MIOActions, MIOState } from "../Types";

import { KBVBundleResource } from "@kbv/mioparser";

import Examples from "../examples";

const initialMIOState: MIOState = {
    mios: [],
    examples: Examples,
    loading: false
};

export { initialMIOState };

export function mioReducer(
    state: MIOState = initialMIOState,
    action: MIOActions
): MIOState {
    // To avoiding mutations in Redux use Object.assign and Arrays concat, slice and spread
    const payload = action.payload;

    switch (action.type) {
        case Constants.ADD_MIO: {
            return {
                ...state,
                mios: [...state.mios, payload.value as KBVBundleResource]
            };
        }
        case Constants.SET_LOADING: {
            return { ...state, loading: payload.value as boolean };
        }
        case Constants.PARSE_MIO: {
            return { ...state, ...payload };
        }
        case Constants.PARSE_MIOS: {
            return { ...state, ...payload };
        }
        default: {
            return state;
        }
    }
}
