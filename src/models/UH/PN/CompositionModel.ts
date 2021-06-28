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

import { CMR } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./../Basic/CMRBaseModel";
import { ModelValue } from "../../Types";

export default class CompositionModel extends BaseModel<CMR.V1_0_0.Profile.PNCompositionParentalNotes> {
    constructor(
        value: CMR.V1_0_0.Profile.PNCompositionParentalNotes,
        fullUrl: string,
        parent: CMR.V1_0_0.Profile.PNBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const encounterType = Util.UH.getEncounterTypeFromBundle(
            this.parent as CMR.V1_0_0.Profile.PNBundle,
            true
        );

        this.headline = encounterType ? encounterType : "-";

        const encounterRef = this.value.encounter.reference;

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.date),
                label: "Dokumentiert am"
            },
            {
                value: this.value.author.map((author) => author.display).join(", "),
                label: "Dokumentiert durch"
            },
            Util.UH.getEncounterModelValue(encounterRef, parent, history)
        ];
    }

    getCoding(): string {
        return ""; // Profile has no coding
    }

    getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "-"
        };
    }
}
