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

import { KBVBundleResource, ParserUtil, Vaccination, KBVBase } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export type PractitionerType =
    | Vaccination.V1_1_0.Profile.Practitioner
    | Vaccination.V1_1_0.Profile.PractitionerAddendum;

export default class PractitionerModel extends BaseModel<PractitionerType> {
    constructor(
        value: PractitionerType,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.IM.getPractitionerName(this.value);
        this.values = [
            {
                value: Util.IM.getPractitionerMaidenName(this.value),
                label: "Geburtsname"
            },
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
            [KBVBase.V1_1_1.ConceptMap.PractitionerFunctionGerman],
            [
                Vaccination.V1_1_0.ValueSet.IHEXDSAuthorSpecialityRestrictedValueSet,
                Vaccination.V1_1_0.ValueSet.PractitionerSpecialityValueSet,
                Vaccination.V1_1_0.ValueSet.PractitionerSpecialityAddendumValueSet
            ]
        );
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const ANR = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerANR>(
                Vaccination.V1_1_0.Profile.PractitionerANR,
                this.value.identifier
            );

            if (ANR)
                return {
                    value: ANR.value,
                    label: "Lebenslange Arztnummer (LANR)"
                };

            const EFN = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerEFN>(
                Vaccination.V1_1_0.Profile.PractitionerEFN,
                this.value.identifier
            );

            if (EFN)
                return {
                    value: EFN.value,
                    label: "Einheitliche Fortbildungsnummer (EFN)"
                };

            const ID = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerId>(
                Vaccination.V1_1_0.Profile.PractitionerId,
                this.value.identifier
            );

            if (ID)
                return {
                    value: ID.value,
                    label: "Nicht näher spezifizierter Identifikator einer nicht ärztlichen, behandelnden Person"
                };
        }

        return {
            value: "-",
            label: "Identifier"
        };
    }

    public toString(): string {
        return this.values
            .filter((v) => v.value !== "-" && !v.label.includes("Geburtsname"))
            .map((v) => v.label + ": " + v.value)
            .join("\n");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Behandelnde Person"
        };
    }
}
