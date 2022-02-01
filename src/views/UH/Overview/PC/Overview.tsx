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

import { MIOEntry, CMR } from "@kbv/mioparser";

import { UI, Util } from "../../../../components/";
import PatientCard from "../../../../components/PatientCard";

import * as Models from "../../../../models";

type OverviewProps = {
    mio: CMR.V1_0_1.Profile.PCBundle;
} & RouteComponentProps;

export default class Overview extends React.Component<OverviewProps> {
    render(): JSX.Element {
        const { mio, history, location, match } = this.props;

        const encounter = Util.UH.getCompositionEncounter(mio);
        const model = new Models.UH.PC.ParticipationCardModel(
            encounter?.resource as CMR.V1_0_1.Profile.PCEncounter,
            encounter?.fullUrl ?? "",
            mio,
            history
        );

        const patient = Util.UH.getPatient(mio);

        const composition = Util.UH.getComposition(
            mio
        ) as MIOEntry<CMR.V1_0_1.Profile.PCCompositionExaminationParticipation>;

        const hints: Models.ModelValue[] = [];

        if (composition) {
            const hintsModel = new Models.UH.Basic.CompositionHintsModel(
                composition.resource,
                composition.fullUrl,
                mio
            );

            hints.push(...hintsModel.getValues());
        }

        return (
            <div className={"cmr-pc-overview"} data-testid={"cmr-pc-overview"}>
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
                    appendItems={hints}
                />
            </div>
        );
    }
}
