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

import { MIOActions, SettingsState } from "./Types";
import { MIOViewerRootState } from "./Store";
import { Dispatch } from "redux";
import { AsyncAction } from "./index";
import { connect } from "react-redux";

const mapStateToProps = ({ settingsState }: MIOViewerRootState): SettingsState => {
    const { showIntro, cookiesAccepted } = settingsState;
    return { showIntro, cookiesAccepted };
};

const mapDispatcherToProps = (dispatch: Dispatch<MIOActions>) => {
    return {
        setShowIntro: (value: boolean) => AsyncAction.setShowIntro(dispatch, value),
        acceptCookies: (value = true) => AsyncAction.acceptCookies(dispatch, value)
    };
};

export type SettingsConnectorType = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

const SettingsConnector = connect(mapStateToProps, mapDispatcherToProps);
export default SettingsConnector;
