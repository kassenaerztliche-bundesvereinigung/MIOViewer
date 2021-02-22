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

import { MR } from "@kbv/mioparser";
import { Util } from "../../../components";

import { ModelValue } from "../../BaseModel";
import MPBaseModel from "../MPBaseModel";

export default class PatientMotherModel extends MPBaseModel<MR.V1_00_000.Profile.PatientMother> {
    constructor(
        value: MR.V1_00_000.Profile.PatientMother,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = Util.MP.getPatientMotherName(this.value);
        this.values = [
            {
                value: Util.MP.getPatientMotherMaidenName(this.value),
                label: "Geburtsname"
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

    getCoding(): string {
        return "";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }
}
