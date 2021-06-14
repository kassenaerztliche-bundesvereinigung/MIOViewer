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

import { ParserUtil, MR } from "@kbv/mioparser";
import { Util } from "../../components";

import { EncounterModel } from "./Basic";
import { ModelValue } from "../Types";

export default class EncounterInpatientTreatmentModel extends EncounterModel<MR.V1_00_000.Profile.EncounterInpatientTreatment> {
    constructor(
        value: MR.V1_00_000.Profile.EncounterInpatientTreatment,
        fullUrl: string,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history, "Zeitraum");

        this.headline = this.getCoding();

        this.values = [
            ...this.values,
            {
                value: this.value.diagnosis
                    ? this.value.diagnosis.map((d) => d.condition.display).join(", ")
                    : "-",
                label: "Diagnose"
            },
            {
                value: this.value.extension
                    ? this.value.extension.map((e) => e.valueString).join(", ")
                    : "-",
                label: "Therapie"
            }
        ];
    }

    protected getPeriod(): string {
        const period = this.value.period as { extension?: { valueString: string }[] };
        if (Object.prototype.hasOwnProperty.call(period, "extension")) {
            return (
                period.extension
                    ?.map((e) => Util.Misc.formatDate(e.valueString))
                    .join(" - ") ?? "-"
            );
        }
        return "-";
    }

    getCoding(): string {
        return Array.from(
            new Set(
                this.value.type.map((t) =>
                    t.coding.map((c) => {
                        const slice = ParserUtil.getSlice<MR.V1_00_000.Profile.EncounterInpatientTreatmentTypeCodingDisplayAnzeigenameCodeSnomed>(
                            MR.V1_00_000.Profile
                                .EncounterInpatientTreatmentTypeCodingDisplayAnzeigenameCodeSnomed,
                            c._display?.extension
                        );

                        return slice?.extension?.map((e) => e.valueString).join(", ");
                    })
                )
            )
        ).join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.value.diagnosis
                ? this.value.diagnosis.map((d) => d.condition.display).join(", ")
                : "Stationäre Behandlung",
            label: this.getPeriod()
        };
    }
}
