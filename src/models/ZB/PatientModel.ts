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

import { KBVBundleResource, ZAEB } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export default class PatientModel extends BaseModel<ZAEB.V1_00_000.Profile.Patient> {
    constructor(
        value: ZAEB.V1_00_000.Profile.Patient,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.ZB.getPatientName(this.value);
        this.values = [
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
            value: this.headline,
            label: "Patient/-in"
        };
    }
}
