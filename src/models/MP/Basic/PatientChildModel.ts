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

import { MR, Reference } from "@kbv/mioparser";
import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import { AdditionalCommentModel } from "../../Comprehensive";
import { ModelValue } from "../../Types";

export default class PatientChildModel extends MPBaseModel<MR.V1_1_0.Profile.PatientChild> {
    constructor(
        value: MR.V1_1_0.Profile.PatientChild,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Kind"; // (identifier.value ? identifier.value + ". " : "") + "Kind";
        this.values = [
            Util.Misc.getGender(value),
            {
                value: Util.Misc.formatDate(this.value.birthDate),
                label: "Geburtsdatum"
            },
            this.getIdentifier(),
            this.getDeceased()
        ];

        const commentModel = new AdditionalCommentModel(
            this.value,
            this.fullUrl,
            this.parent,
            history,
            "Besonderheiten"
        );
        const comment = commentModel.getValues();
        if (comment.length) {
            this.values.push(...comment);
        }
    }

    public getDeceased(): ModelValue {
        let value = this.value.deceasedBoolean ? "Ja" : "Nein";
        const date = this.value.deceasedDateTime;
        if (date) {
            value += ", " + Util.Misc.formatDate(date);
        }

        return {
            value: value,
            label: "Verstorben"
        };
    }

    public getIdentifier(): ModelValue {
        const identifier: string = this.value.identifier
            .map((pid) => pid.value)
            .join(", ");

        return {
            value: identifier,
            label: "Patientenidentifikationsnummer (PID)"
        };
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const identifier = this.getIdentifier().value;

        return {
            value: Util.Misc.formatDate(this.value.birthDate),
            label: (identifier ? identifier + ". " : "") + "Kind",
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl),
                true
            )
        };
    }
}
