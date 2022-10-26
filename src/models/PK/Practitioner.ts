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

import { PKA, KBVBundleResource, ParserUtil } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";

export default class PractitionerModel extends BaseModel<
    PKA.V1_0_0.Profile.NFDPractitioner | PKA.V1_0_0.Profile.NFDPractitionerPhysician
> {
    constructor(
        value:
            | PKA.V1_0_0.Profile.NFDPractitioner
            | PKA.V1_0_0.Profile.NFDPractitionerPhysician,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent as PKA.V1_0_0.Profile.NFDxDPEBundle, history);

        this.headline = Util.PK.getPractitionerName(this.value);
        this.values = [];

        if (PKA.V1_0_0.Profile.NFDPractitioner.is(value)) {
            this.values.push(this.getIdentifier());
        } else {
            this.noHeadline = true;
            this.values.push({
                value: Util.PK.getPractitionerName(this.value),
                label: "Name"
            });
        }
    }

    protected getQualification(): string {
        return "-";
    }

    protected getIdentifier(): ModelValue {
        if (PKA.V1_0_0.Profile.NFDPractitioner.is(this.value) && this.value.identifier) {
            const ANR = ParserUtil.getSlice<PKA.V1_0_0.Profile.NFDPractitionerANR>(
                PKA.V1_0_0.Profile.NFDPractitionerANR,
                this.value.identifier
            );

            if (ANR) {
                return {
                    value: ANR.value,
                    label: "Lebenslange Arztnummer (LANR)"
                };
            }

            const EFN = ParserUtil.getSlice<PKA.V1_0_0.Profile.NFDPractitionerEFN>(
                PKA.V1_0_0.Profile.NFDPractitionerEFN,
                this.value.identifier
            );

            if (EFN) {
                return {
                    value: EFN.value,
                    label: "Einheitliche Fortbildungsnummer (EFN)"
                };
            }

            const ZANR = ParserUtil.getSlice<PKA.V1_0_0.Profile.NFDPractitionerZANR>(
                PKA.V1_0_0.Profile.NFDPractitionerZANR,
                this.value.identifier
            );

            if (ZANR) {
                return {
                    value: ZANR.value,
                    label: "Lebenslangen Zahnarztnummer (ZANR)"
                };
            }
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
