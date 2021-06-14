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

import { History } from "history";

import { KBVBundleResource, Vaccination, ZAEB, MR, CMR } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export type PatientType =
    | Vaccination.V1_00_000.Profile.Patient
    | ZAEB.V1_00_000.Profile.Patient
    | MR.V1_00_000.Profile.PatientMother
    | CMR.V1_00_000.Profile.CMRPatient
    | CMR.V1_00_000.Profile.PCPatient
    | CMR.V1_00_000.Profile.PNPatient;

export default class PatientSimpleModel extends BaseModel<PatientType> {
    constructor(
        value: PatientType,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Patientendaten";
        this.values = [
            {
                value: Util.Misc.getPatientName(this.value),
                label: "Name"
            },
            {
                value: Util.Misc.formatDate(this.value.birthDate),
                label: "Geburtsdatum"
            },
            ...this.getIdentifier()
        ];
    }

    public getIdentifier(): ModelValue[] {
        return Util.Misc.getPatientIdentifier(this.value).map(
            (identifier) => identifier as ModelValue
        );
    }

    public toString(): string {
        return this.values.map((v) => v.label + ": " + v.value).join("\n");
    }

    public getMainValue(): ModelValue {
        return {
            value: Util.Misc.getPatientName(this.value),
            label: "Patient/-in"
        };
    }
}
