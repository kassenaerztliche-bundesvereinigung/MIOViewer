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

import Store, { MIOViewerRootState } from "./Store";
import MIOConnector, { MIOConnectorType } from "./MIOConnector";
import SettingsConnector, { SettingsConnectorType } from "./SettingsConnector";
import { Constants, MIOState, MIOActions } from "./Types";

import * as Actions from "./Actions";
import * as AsyncAction from "./AsyncAction";

export type {
    MIOState,
    MIOViewerRootState,
    MIOActions,
    MIOConnectorType,
    SettingsConnectorType
};

export { MIOConnector, SettingsConnector, Actions, AsyncAction, Constants };

export default Store;
