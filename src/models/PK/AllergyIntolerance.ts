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

import { History } from "history";

import { PKA, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { AllergyIntoleranceReaction } from "./index";
import { ModelValue } from "../Types";
import { Util } from "../../components";

export default class AllergyIntoleranceModel extends BaseModel<PKA.V1_0_0.Profile.NFDAllergyIntolerance> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDAllergyIntolerance,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Allergie/Unverträglichkeit";

        const patientRef = new Reference(value.patient?.reference, this.fullUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            ...this.getRecorder()
        ];
    }

    protected getRecorder(): ModelValue[] {
        const values: ModelValue[] = [];
        const ref = this.value.recorder?.reference;

        values.push(
            ...Util.PK.handlePractitionerRoleWithOrganization(
                this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                ref,
                this.fullUrl,
                this.history,
                "Dokumentierende Person",
                "Dokumentierende Institution"
            )
        );

        return values;
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const reactions = AllergyIntoleranceReaction.getReactions(this.value);
        return {
            value: reactions.map((r) => r.value).join(", "),
            label: reactions.map((r) => r.label).join(", ")
        };
    }
}
