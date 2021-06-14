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

import { ParserUtil, CMR } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type PatientType =
    | CMR.V1_00_000.Profile.CMRPatient
    | CMR.V1_00_000.Profile.PCPatient
    | CMR.V1_00_000.Profile.PNPatient;

export default class PatientModel extends BaseModel<PatientType> {
    constructor(
        value: PatientType,
        fullUrl: string,
        parent:
            | CMR.V1_00_000.Profile.CMRBundle
            | CMR.V1_00_000.Profile.PCBundle
            | CMR.V1_00_000.Profile.PNBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.UH.getPatientName(this.value);
        this.values = [
            {
                value: Util.UH.getPatientBirthName(this.value),
                label: "Geburtsname"
            },
            this.getBirthDate(),
            ...this.getIdentifier()
        ];
    }

    public getBirthDate(): ModelValue {
        let value = this.value.birthDate;
        if (!value) {
            const absentReason = ParserUtil.getSlice(
                CMR.V1_00_000.Profile.CMRPatientBirthDateDataabsentreason,
                this.value._birthDate?.extension
            );

            if (absentReason) {
                value = "Unbekannt";
            }
        }

        return {
            value: Util.Misc.formatDate(value),
            label: "Geburtsdatum"
        };
    }

    public getIdentifier(): ModelValue[] {
        return Util.Misc.getPatientIdentifier(this.value).map(
            (identifier) => identifier as ModelValue
        );
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Patient/-in"
        };
    }

    public toString(): string {
        return this.values.map((v) => v.label + ": " + v.value).join("\n");
    }
}
