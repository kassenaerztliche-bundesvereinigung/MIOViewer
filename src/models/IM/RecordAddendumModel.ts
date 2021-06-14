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

import { ParserUtil, KBVBundleResource, Vaccination } from "@kbv/mioparser";

import RecordModel from "./RecordModel";

export default class RecordAddendumModel extends RecordModel<Vaccination.V1_00_000.Profile.RecordAddendum> {
    constructor(
        value: Vaccination.V1_00_000.Profile.RecordAddendum,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.values.push({
            value: this.value.reportOrigin.text,
            label: "Informationsquelle"
        });

        this.values.push({
            value:
                this.value.note && this.value.note.length
                    ? this.value.note.map((note) => note.text).join(", ")
                    : "-",
            label: "Anmerkungen zur durchgeführten Impfung"
        });

        let entryTypeStr = "-";
        const entryType = ParserUtil.getSlice<Vaccination.V1_00_000.Extension.EntryType>(
            Vaccination.V1_00_000.Extension.EntryType,
            this.value.extension
        );
        if (entryType && entryType.valueCodeableConcept) {
            entryTypeStr = entryType.valueCodeableConcept.coding
                .map((c) => c.display)
                .join(", ");
        }

        this.values.push({
            value: entryTypeStr,
            label: "Typ des Eintrages"
        });
    }
}
