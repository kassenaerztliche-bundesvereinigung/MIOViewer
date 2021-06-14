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

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type SpecialCompositionType =
    | CMR.V1_00_000.Profile.CMRCompositionCysticFibrosisScreening
    | CMR.V1_00_000.Profile.CMRCompositionExtendedNewbornScreening
    | CMR.V1_00_000.Profile.CMRCompositionHipScreening
    | CMR.V1_00_000.Profile.CMRCompositionNeonatalHearscreening
    | CMR.V1_00_000.Profile.CMRCompositionPulseOxymetryScreening
    | CMR.V1_00_000.Profile.CMRCompositionPercentileCurve;

export default class SpecialCompositionModel extends BaseModel<SpecialCompositionType> {
    constructor(
        value: SpecialCompositionType,
        fullUrl: string,
        parent: CMR.V1_00_000.Profile.CMRBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.noHeadline = true;

        const encounterRef = this.value.encounter.reference;

        this.values = [
            Util.UH.getEncounterModelValue(encounterRef, parent, history),
            {
                value: Util.Misc.formatDate(this.value.date),
                label: "Dokumentiert am"
            },
            ...this.getAuthors()
        ];
    }

    protected getAuthors(): ModelValue[] {
        const result: ModelValue[] = [];
        const refs = this.value.author.map((author) => author.reference);

        refs.forEach((ref) => {
            const author = ParserUtil.getEntryWithRef<
                | CMR.V1_00_000.Profile.CMRPractitioner
                | CMR.V1_00_000.Profile.CMROrganization
            >(
                this.parent,
                [
                    CMR.V1_00_000.Profile.CMRPractitioner,
                    CMR.V1_00_000.Profile.CMROrganization
                ],
                ref
            )?.resource;

            if (author) {
                let name = "-";
                if (CMR.V1_00_000.Profile.CMRPractitioner.is(author)) {
                    name = Util.UH.getPractitionerName(author);
                } else if (author.name) {
                    name = author.name;
                }

                result.push({
                    value: name,
                    label: "Dokumentiert durch",
                    onClick: Util.Misc.toEntryByRef(this.history, this.parent, ref)
                });
            }
        });

        return result;
    }

    getCoding(): string {
        return "";
    }

    // TODO:
    public getMainValue(): ModelValue {
        throw new Error("Method not implemented.");
    }
}
