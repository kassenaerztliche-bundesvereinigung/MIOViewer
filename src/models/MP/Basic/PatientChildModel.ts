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

import MPBaseModel from "../MPBaseModel";
import { AdditionalCommentModel } from "../../Comprehensive";
import { ModelValue } from "../../Types";

export default class PatientChildModel extends MPBaseModel<MR.V1_0_0.Profile.PatientChild> {
    constructor(
        value: MR.V1_0_0.Profile.PatientChild,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const identifier = this.getIdentifier();

        this.headline = (identifier.value ? identifier.value + ". " : "") + "Kind";
        this.values = [
            {
                value: Util.Misc.formatDate(this.value.birthDate),
                label: "Geburtsdatum"
            },
            {
                value: this.value.gender ? this.translateGender(this.value.gender) : "-",
                label: "Geschlecht"
            },
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
        if (comment.length) this.values.push(...comment);
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
            .map((i) => {
                return i.extension?.map((e) => e.valueInteger?.toString()).join(", ");
            })
            .join(", ");

        return {
            value: identifier,
            label: "Identifier"
        };
    }

    getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const identifier = this.value.identifier.map((i) => {
            return i.extension?.map((e) => e.valueInteger);
        });

        return {
            value: Util.Misc.formatDate(this.value.birthDate),
            label: (identifier ? identifier + ". " : "") + "Kind",
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                this.value.id,
                true
            )
        };
    }

    protected translateGender(gender: string): string {
        const values = [
            {
                in: "male",
                out: "männlich"
            },
            {
                in: "female",
                out: "weiblich"
            },
            {
                in: "other",
                out: "andere"
            },
            {
                in: "unknown",
                out: "unbekannt"
            }
        ];

        const result = values.filter((v) => v.in === gender);
        return result.length ? result[0].out : gender;
    }
}
