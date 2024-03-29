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

import MPBaseModel from "./MPBaseModel";
import { ModelValue } from "../Types";

export default class AppointmentPregnancyModel extends MPBaseModel<MR.V1_1_0.Profile.AppointmentPregnancy> {
    constructor(
        value: MR.V1_1_0.Profile.AppointmentPregnancy,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Untersuchungstermin";

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.start, true),
                label: "Terminbeginn"
            },
            {
                value: Util.Misc.formatDate(this.value.end, true),
                label: "Terminende"
            }
        ];
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: Util.Misc.formatDate(this.value.start),
            label: "Untersuchungstermin"
        };
    }
}
