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

import { ParserUtil, KBVBundleResource, CMR } from "@kbv/mioparser";

import { Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type PractitionerType =
    | CMR.V1_0_0.Profile.CMRPractitioner
    | CMR.V1_0_0.Profile.PCPractitioner;

export default class PractitionerModel extends BaseModel<PractitionerType> {
    constructor(
        value: PractitionerType,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent as CMR.V1_0_0.Profile.CMRBundle, history);
        this.headline = Util.UH.getPractitionerName(this.value);
        this.values = [...this.getQualification(), this.getIdentifier()];
    }

    protected getQualification(): ModelValue[] {
        const modelValueArray: ModelValue[] = [];

        if (this.value.qualification) {
            const qualificationCodings = this.value.qualification.map((q) => {
                return q.code.coding[0];
            });
            qualificationCodings.forEach((qualificationCoding) => {
                modelValueArray.push({
                    value: Util.UH.translateQualification(qualificationCoding),
                    label: "Funktionsbezeichnung",
                    onClick: Util.Misc.toEntryByRef(
                        this.history,
                        this.parent,
                        this.fullUrl,
                        true,
                        "qualification",
                        qualificationCoding.code
                    )
                });
            });
        }

        return modelValueArray;
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const ANR = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerANR>(
                CMR.V1_0_0.Profile.CMRPractitionerANR,
                this.value.identifier
            );

            if (ANR)
                return {
                    value: ANR.value,
                    label: "Lebenslange Arztnummer (LANR)"
                };

            const EFN = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerEFN>(
                CMR.V1_0_0.Profile.CMRPractitionerEFN,
                this.value.identifier
            );

            if (EFN)
                return {
                    value: EFN.value,
                    label: "Einheitliche Fortbildungsnummer (EFN)"
                };

            const IK = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerHebammenIK>(
                CMR.V1_0_0.Profile.CMRPractitionerHebammenIK,
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

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
