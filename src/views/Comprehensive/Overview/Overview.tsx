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

import React from "react";

import { RouteComponentProps } from "react-router";

import { MIOConnector, MIOConnectorType } from "../../../store";
import { Vaccination, ZAEB } from "@kbv/mioparser";

import { UI } from "../../../components";

import OverviewIM from "../../IM/Overview";
import OverviewZAEB from "../../ZB/Overview";

class Overview extends React.Component<MIOConnectorType & RouteComponentProps> {
    render(): JSX.Element {
        const { mio, history, makePDF } = this.props;

        let headline = "Übersicht";
        let mioClass: UI.MIOClassName = undefined;
        let component = undefined;

        if (mio) {
            if (Vaccination.V1_00_000.Profile.BundleEntry.is(mio)) {
                headline = "Impfpass";
                mioClass = "impfpass";
                component = <OverviewIM mio={mio} history={history} />;
            } else if (ZAEB.V1_00_000.Profile.Bundle.is(mio)) {
                headline = "Zahnärztliches Bonusheft";
                mioClass = "zaeb";
                component = <OverviewZAEB mio={mio} history={history} />;
            }
        }

        if (component) {
            return (
                <UI.BasicView
                    headline={headline}
                    headerClass={mioClass}
                    padding={false}
                    back={() => history.goBack()}
                    pdfDownload={() => makePDF(mio)}
                    id={mio?.identifier.value ?? ""}
                >
                    {component}
                </UI.BasicView>
            );
        } else {
            const errors = [
                !mio ? "MIO nicht gefunden" : "Für dieses MIO gibt es noch keine Ansicht"
            ];
            return <UI.Error errors={errors} backClick={() => history.push("/main")} />;
        }
    }
}

export default MIOConnector(Overview);
