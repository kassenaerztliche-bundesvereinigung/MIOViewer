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

import { ParserUtil, CMR } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./../Basic/CMRBaseModel";
import { ModelValue } from "../../Types";

export default class ParentalNotesModel extends BaseModel<CMR.V1_0_1.Profile.PNCompositionParentalNotes> {
    constructor(
        value: CMR.V1_0_1.Profile.PNCompositionParentalNotes,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.PNBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const entries = this.value.section.map((s) =>
            s.entry.map(
                (e: CMR.V1_0_1.Profile.PNCompositionParentalNotesSectionEntry) =>
                    e.reference
            )
        );

        entries.flat().forEach((entry) => {
            const parentalNote =
                ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.PNObservationParentalNotes>(
                    this.parent,
                    [CMR.V1_0_1.Profile.PNObservationParentalNotes],
                    entry
                );

            if (parentalNote) {
                const pn = parentalNote.resource;
                this.headline = pn.code.coding
                    .map((c) => {
                        if (c._display?.extension) {
                            const slice =
                                ParserUtil.getSlice<CMR.V1_0_1.Profile.PNObservationParentalNotesCodeCodingDisplayAnzeigenameCodeSnomed>(
                                    CMR.V1_0_1.Profile
                                        .PNObservationParentalNotesCodeCodingDisplayAnzeigenameCodeSnomed,
                                    c._display.extension
                                );

                            const sliceContent =
                                ParserUtil.getSlice<CMR.V1_0_1.Profile.PNObservationParentalNotesCodeCodingDisplayAnzeigenameCodeSnomedContent>(
                                    CMR.V1_0_1.Profile
                                        .PNObservationParentalNotesCodeCodingDisplayAnzeigenameCodeSnomedContent,
                                    slice?.extension
                                );

                            if (sliceContent) return sliceContent.valueString;
                            else return c.display;
                        } else {
                            return c.display;
                        }
                    })
                    .join(", ");

                const patientRef = pn.subject.reference;

                this.values = [
                    {
                        value: Util.Misc.formatDate(pn.effectiveDateTime),
                        label: "Verfasst am"
                    },
                    {
                        value: pn.valueString,
                        label: "Notiz"
                    },
                    Util.UH.getPatientModelValue(patientRef, parent, history)
                ];
            }
        });
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "-"
        };
    }
}
