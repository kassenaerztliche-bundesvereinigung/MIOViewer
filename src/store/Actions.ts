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

import { action } from "typesafe-actions";
import { Constants, MIOFile } from "./Types";
import { KBVResource, KBVBundleResource } from "@kbv/mioparser";

type ActionResult = {
    type: Constants;
    payload: {
        value: KBVResource | KBVBundleResource | boolean | File | File[] | MIOFile;
    };
};

type ActionErrorResult = {
    type: Constants;
    payload: {
        value: MIOFile | MIOFile[] | boolean;
    };
};

type ActionSettingsResult = {
    type: Constants;
    payload: {
        value: boolean;
    };
};

export function addMIO(value: KBVBundleResource): ActionResult {
    return action(Constants.ADD_MIO, {
        value
    });
}

export function setLoading(value: boolean): ActionResult {
    return action(Constants.SET_LOADING, {
        value
    });
}

export function parseMIO(value: File): ActionResult {
    return action(Constants.PARSE_MIO, {
        value
    });
}

export function parseMIOs(value: File[]): ActionResult {
    return action(Constants.PARSE_MIOS, {
        value
    });
}

export function setShowIntro(value: boolean): ActionSettingsResult {
    return action(Constants.SHOW_INTRO, {
        value
    });
}

export function acceptCookies(value: boolean): ActionSettingsResult {
    return action(Constants.ACCEPT_COOKIES, {
        value
    });
}
