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

import React from "react";
import { RouteComponentProps } from "react-router";

import { CMR } from "@kbv/mioparser";

import { UI, Util } from "../../../../components/";
import PatientCard from "../../../../components/PatientCard";
import * as Models from "../../../../models";

type OverviewProps = {
    mio: CMR.V1_0_1.Profile.PNBundle;
} & RouteComponentProps;

export default class Overview extends React.Component<OverviewProps> {
    render(): JSX.Element {
        const { mio, history, location, match } = this.props;

        const composition = Util.UH.getComposition(mio);

        const model = new Models.UH.PN.CompositionModel(
            composition?.resource as CMR.V1_0_1.Profile.PNCompositionParentalNotes,
            composition?.fullUrl ?? "",
            mio,
            history
        );

        const modelNotes = new Models.UH.PN.ParentalNotesModel(
            composition?.resource as CMR.V1_0_1.Profile.PNCompositionParentalNotes,
            composition?.fullUrl ?? "",
            mio,
            history
        );

        const modelHints = new Models.UH.Basic.CompositionHintsModel(
            composition?.resource as CMR.V1_0_1.Profile.PNCompositionParentalNotes,
            composition?.fullUrl ?? "",
            mio
        );

        const patient = Util.UH.getPatient(mio);

        return (
            <div className={"cmr-pn-overview"} data-testid={"cmr-pn-overview"}>
                {patient && (
                    <div
                        className={"ion-padding"}
                        onClick={Util.Misc.toEntry(history, mio, patient)}
                    >
                        <PatientCard patient={patient.resource} />
                    </div>
                )}

                <UI.DetailList.Model
                    mio={mio}
                    model={model}
                    history={history}
                    location={location}
                    match={match}
                />

                <UI.DetailList.Model
                    mio={mio}
                    model={modelNotes}
                    appendItems={modelHints.getValues()}
                    history={history}
                    location={location}
                    match={match}
                />
            </div>
        );
    }
}
