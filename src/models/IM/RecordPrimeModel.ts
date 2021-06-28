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
import { UI } from "../../components";

import RecordModel from "./RecordModel";

export default class RecordPrimeModel extends RecordModel<Vaccination.V1_1_0.Profile.RecordPrime> {
    constructor(
        value: Vaccination.V1_1_0.Profile.RecordPrime,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const disclaimer = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.RecordPrimeNoteHinweis>(
            Vaccination.V1_1_0.Profile.RecordPrimeNoteHinweis,
            this.value.note
        );

        const notes = this.value.note?.filter((note) => note.text !== disclaimer?.text);

        this.values.push({
            value: notes?.length ? notes.map((n) => n.text).join(", ") : "-",
            label: "Anmerkungen zur durchgeführten Impfung"
        });

        let entryTypeStr = "_";
        const entryType = ParserUtil.getSlice<Vaccination.V1_1_0.Extension.EntryType>(
            Vaccination.V1_1_0.Extension.EntryType,
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

        this.values.push({
            value: disclaimer ? disclaimer.text : "-",
            label: "Allgemeiner Hinweis für den Impfling oder Sorgeberechtigten",
            renderAs: UI.ListItem.Collapsible
        });
    }
}
