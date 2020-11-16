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

import { History } from "history";

import { KBVBundleResource, ZAEB } from "@kbv/mioparser";
import { Util, ZB } from "../../components";

import BaseModel, { ModelValue } from "../BaseModel";

export default class PatientModel extends BaseModel<ZAEB.V1_00_000.Profile.Patient> {
    constructor(
        value: ZAEB.V1_00_000.Profile.Patient,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = ZB.Util.getPatientName(this.value);
        this.values = [
            {
                value: Util.formatDate(this.value.birthDate),
                label: "Geburtsdatum"
            },
            ...this.getIdentifier()
        ];
    }

    public getIdentifier(): ModelValue[] {
        return Util.getPatientIdentifier(this.value).map((identifier) => identifier);
    }

    public toString(): string {
        return this.values.map((v) => v.label + ": " + v.value).join("\n");
    }
}
