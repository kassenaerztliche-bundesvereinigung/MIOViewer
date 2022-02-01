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

import { ParserUtil, MR } from "@kbv/mioparser";

import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import { ModelValue } from "../../Types";

export default class PractitionerModel extends MPBaseModel<MR.V1_1_0.Profile.Practitioner> {
    constructor(
        value: MR.V1_1_0.Profile.Practitioner,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

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
        return Util.Misc.getQualification(
            this.value.qualification,
            [MR.V1_1_0.ConceptMap.PractitionerFunctionGerman],
            [
                MR.V1_1_0.ValueSet.IHEXDSAuthorSpecialityRestrictedValueSet,
                MR.V1_1_0.ValueSet.PractitionerFunctionAddendumValueSet
            ]
        );
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const ANR = ParserUtil.getSlice<MR.V1_1_0.Profile.PractitionerANR>(
                MR.V1_1_0.Profile.PractitionerANR,
                this.value.identifier
            );

            if (ANR)
                return {
                    value: ANR.value,
                    label: "Lebenslange Arztnummer (LANR)"
                };

            const EFN = ParserUtil.getSlice<MR.V1_1_0.Profile.PractitionerEFN>(
                MR.V1_1_0.Profile.PractitionerEFN,
                this.value.identifier
            );

            if (EFN)
                return {
                    value: EFN.value,
                    label: "Einheitliche Fortbildungsnummer (EFN)"
                };

            const IK = ParserUtil.getSlice<MR.V1_1_0.Profile.PractitionerHebammenIK>(
                MR.V1_1_0.Profile.PractitionerHebammenIK,
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

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Behandelnde Person"
        };
    }
}
