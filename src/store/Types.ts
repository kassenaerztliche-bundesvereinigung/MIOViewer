/*
 * Copyright (c) 2020 - 2021. Kassenärztliche Bundesvereinigung, KBV
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

import { ActionType } from "typesafe-actions";

import * as Actions from "./Actions";
import { KBVResource, KBVBundleResource, MIOEntry, MIOError } from "@kbv/mioparser";

export type MIOActions = ActionType<typeof Actions>;

export type SettingsActions = ActionType<typeof Actions.setShowIntro>;

export interface MIOState {
    mios: KBVBundleResource[];
    mio?: KBVBundleResource;
    entry?: MIOEntry<KBVResource>;
    loading: boolean;
}

export type MIOFile = {
    file: string;
    mio: KBVBundleResource;
    errors: MIOError[];
};

export interface SettingsState {
    showIntro: boolean;
    cookiesAccepted: boolean;
}

export enum Constants {
    ADD_MIO = "ADD_MIO",
    SET_LOADING = "SET_LOADING",
    PARSE_MIO = "PARSE_MIO",
    PARSE_MIOS = "PARSE_MIOS",
    SHOW_INTRO = "SHOW_INTRO",
    ACCEPT_COOKIES = "ACCEPT_COOKIES"
}
