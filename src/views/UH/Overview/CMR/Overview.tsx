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

import { Util } from "../../../../components/";
import PatientCard from "../../../../components/PatientCard";

import OverviewSpecial from "./OverviewSpecial";
import OverviewU from "./OverviewU";
import OverviewPercentileCurve from "./OverviewPercentileCurve";

type OverviewProps = {
    mio: CMR.V1_0_1.Profile.CMRBundle;
} & RouteComponentProps;

export default class Overview extends React.Component<OverviewProps> {
    protected patient?: MIOEntry<CMR.V1_0_1.Profile.CMRPatient>;

    constructor(props: OverviewProps) {
        super(props);

        this.patient = Util.UH.getPatient(props.mio);
    }

    render(): JSX.Element {
        const { mio, history } = this.props;

        return (
            <div className={"cmr-overview"} data-testid={"cmr-overview"}>
                {this.patient && (
                    <div
                        className={"ion-padding"}
                        onClick={Util.Misc.toEntry(history, mio, this.patient)}
                    >
                        <PatientCard patient={this.patient.resource} />
                    </div>
                )}

                <OverviewSpecial {...this.props} />
                <OverviewU {...this.props} />
                <OverviewPercentileCurve {...this.props} />
            </div>
        );
    }
}
