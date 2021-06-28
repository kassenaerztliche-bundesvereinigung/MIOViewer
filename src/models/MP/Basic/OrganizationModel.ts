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

import MPBaseModel from "../MPBaseModel";
import { ModelValue } from "../../Types";

export default class OrganizationModel extends MPBaseModel<MR.V1_0_0.Profile.Organization> {
    constructor(
        value: MR.V1_0_0.Profile.Organization,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.value.name ? this.value.name : "-";
        this.values = [this.getIdentifier()];
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const iknr = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationInstitutionskennzeichen>(
                MR.V1_0_0.Profile.OrganizationInstitutionskennzeichen,
                this.value.identifier
            );

            if (iknr)
                return {
                    value: iknr.value,
                    label: "Institutionskennzeichen (IKNR)"
                };

            const bsnr = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationBetriebsstaettennummer>(
                MR.V1_0_0.Profile.OrganizationBetriebsstaettennummer,
                this.value.identifier
            );

            if (bsnr) {
                return {
                    value: bsnr.value,
                    label: "Betriebsstättennummer (BSNR)"
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
            label: "Organisation"
        };
    }
}
