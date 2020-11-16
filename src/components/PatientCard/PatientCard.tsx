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

import { Vaccination, ZAEB } from "@kbv/mioparser";
import { getPatientName } from "../Util";

import "./PatientCard.scss";

type PatientProps = {
    patient: Vaccination.V1_00_000.Profile.Patient | ZAEB.V1_00_000.Profile.Patient;
};

export default class PatientCard extends React.Component<PatientProps> {
    render(): JSX.Element {
        const patient = this.props.patient;
        const name = getPatientName(patient);

        return (
            <div className={"patient-card"} data-testid={"patient-card"}>
                <div className={"image-container"} />
                <div className={"name-container"}>
                    <h5 className={"green"} data-testid={"headline"}>
                        {name}
                    </h5>
                </div>
            </div>
        );
    }
}
