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

import { ParserUtil, KBVBundleResource, CMR } from "@kbv/mioparser";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type OrganizationType =
    | CMR.V1_0_1.Profile.CMROrganization
    | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory;

export default class OrganizationModel extends BaseModel<OrganizationType> {
    constructor(
        value: OrganizationType,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(
            value,
            fullUrl,
            parent as
                | CMR.V1_0_1.Profile.CMRBundle
                | CMR.V1_0_1.Profile.PCBundle
                | CMR.V1_0_1.Profile.PNBundle,
            history
        );

        this.headline = this.value.name ? this.value.name : "-";
        this.values = [...this.getIdentifiers()];
    }

    protected getIdentifiers(): ModelValue[] {
        if (this.value.identifier) {
            const values: ModelValue[] = [];

            const iknr =
                ParserUtil.getSlice<CMR.V1_0_1.Profile.CMROrganizationInstitutionskennzeichen>(
                    CMR.V1_0_1.Profile.CMROrganizationInstitutionskennzeichen,
                    this.value.identifier
                );

            if (iknr) {
                values.push({
                    value: iknr.value,
                    label: "Institutionskennzeichen (IKNR)"
                });
            }

            const bsnr =
                ParserUtil.getSlice<CMR.V1_0_1.Profile.CMROrganizationBetriebsstaettennummer>(
                    CMR.V1_0_1.Profile.CMROrganizationBetriebsstaettennummer,
                    this.value.identifier
                );

            if (bsnr) {
                values.push({
                    value: bsnr.value,
                    label: "Betriebsstättennummer (BSNR)"
                });
            }

            return values;
        }

        return [
            {
                value: "-",
                label: "Identifier"
            }
        ];
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Einrichtung"
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
