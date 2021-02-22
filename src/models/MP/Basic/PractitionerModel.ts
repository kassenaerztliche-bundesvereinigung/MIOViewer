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
import {
    IHEXDSAuthorSpecialityRestrictedValueSet,
    PractitionerFunctionAddendumValueSet
} from "@kbv/mioparser/dist/Definitions/KBV/MR/1.00.000/ValueSet";

import { Util } from "../../../components";

import { ModelValue } from "../../BaseModel";
import MPBaseModel from "../MPBaseModel";

export default class PractitionerModel extends MPBaseModel<MR.V1_00_000.Profile.Practitioner> {
    constructor(
        value: MR.V1_00_000.Profile.Practitioner,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, parent, history);
        this.headline = Util.MP.getPractitionerName(this.value);
        this.values = [
            {
                value: this.getQualification(),
                label: "Funktionsbezeichnung"
            },
            this.getIdentifier()
        ];
    }

    protected getQualification(): string {
        if (this.value.qualification) {
            return this.value.qualification
                .map((q) => {
                    return q.code.coding
                        .map((c) => {
                            if (c.display) return c.display;
                            else {
                                const results: Set<string> = new Set<string>();

                                IHEXDSAuthorSpecialityRestrictedValueSet.forEach((vs) => {
                                    const result = vs.concept.filter(
                                        (concept) => c.code === concept.code
                                    );

                                    if (result.length) results.add(result[0].display);
                                });

                                PractitionerFunctionAddendumValueSet.forEach((vs) => {
                                    const result = vs.concept.filter(
                                        (concept) => c.code === concept.code
                                    );

                                    if (result.length) results.add(result[0].display);
                                });

                                if (c.code) {
                                    const result = ParserUtil.translateCode(
                                        c.code,
                                        MR.V1_00_000.ConceptMap.PractitionerFunctionGerman
                                    );

                                    if (result.length && c.code !== result[0]) {
                                        result.forEach((r) => results.add(r));
                                    }
                                }

                                const arr = Array.from(results);
                                return arr.length ? arr.join(", ") : c.code;
                            }
                        })
                        .join(", ");
                })
                .join(", ");
        }

        return "-";
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const ANR = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerANR>(
                MR.V1_00_000.Profile.PractitionerANR,
                this.value.identifier
            );

            if (ANR)
                return {
                    value: ANR.value,
                    label: "Lebenslange Arztnummer (LANR)"
                };

            const EFN = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerEFN>(
                MR.V1_00_000.Profile.PractitionerEFN,
                this.value.identifier
            );

            if (EFN)
                return {
                    value: EFN.value,
                    label: "Einheitliche Fortbildungsnummer (EFN)"
                };

            const IK = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerHebammenIK>(
                MR.V1_00_000.Profile.PractitionerHebammenIK,
                this.value.identifier
            );

            if (IK)
                return {
                    value: IK.value,
                    label: "Hebammen Institutionskennzeichen (IK)"
                };
        }

        return {
            value: "-",
            label: "Identifier"
        };
    }

    getCoding(): string {
        return "This profile has no coding";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }
}
