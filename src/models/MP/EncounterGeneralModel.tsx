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

import { MR } from "@kbv/mioparser";
import { Util } from "../../components";

import { EncounterModel } from "./Basic";
import * as Models from "../index";
import { ModelValue } from "../index";

export default class EncounterGeneralModel extends EncounterModel<MR.V1_1_0.Profile.EncounterGeneral> {
    constructor(
        value: MR.V1_1_0.Profile.EncounterGeneral,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History,
        customLabel = "Untersucht am"
    ) {
        super(value, fullUrl, parent, history, customLabel);

        this.noHeadline = false;
        this.headline = "Untersuchungsdatum";

        this.values = [...this.values];

        const participants = new Models.MP.ParticipantsModel(
            this.value,
            fullUrl,
            parent,
            history
        );
        this.values.push(...participants.getValues());
    }

    protected getPeriod(): string {
        const period = this.value.period;
        return (
            Util.Misc.formatDate(period.start) +
            (period.end ? " - " + Util.Misc.formatDate(period.end) : "")
        );
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getPeriod(),
            label: "Untersuchungsdatum"
        };
    }
}
