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

import { EncounterModel } from "../Basic/";

export default class ParticipationCardModel extends EncounterModel {
    constructor(
        value: CMR.V1_0_1.Profile.PCEncounter,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.PCBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const encounterType = Util.UH.getEncounterTypeFromBundle(
            this.parent as CMR.V1_0_1.Profile.PCBundle,
            true
        );

        this.noHeadline = true;

        this.values = [
            {
                value: encounterType ? encounterType : "-",
                label: "Teilnahmebestätigung für"
            },
            {
                value: Util.Misc.formatDate(this.value.period.start),
                label: "Datum"
            },
            ...this.getParticipants("Behandelnde Person")
        ];

        const provider = this.getServiceProvider();
        if (provider) this.values.push(provider);
    }
}
