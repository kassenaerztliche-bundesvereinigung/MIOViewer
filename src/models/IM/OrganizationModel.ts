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

import BaseModel, { ModelValue } from "../BaseModel";

export default class OrganizationModel extends BaseModel<Vaccination.V1_00_000.Profile.Organization> {
    constructor(
        value: Vaccination.V1_00_000.Profile.Organization,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = this.value.name;
        this.values = [this.getIdentifier()];
    }

    protected getIdentifier(): ModelValue {
        if (this.value.identifier) {
            const iknr = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationInstitutionskennzeichen>(
                Vaccination.V1_00_000.Profile.OrganizationInstitutionskennzeichen,
                this.value.identifier
            );

            if (iknr)
                return {
                    value: iknr.value,
                    label: "Institutionskennzeichen (IKNR)"
                };

            const bsnr = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationBetriebsstaettennummer>(
                Vaccination.V1_00_000.Profile.OrganizationBetriebsstaettennummer,
                this.value.identifier
            );

            if (bsnr)
                return {
                    value: bsnr.value,
                    label: "Betriebsstättennummer (BSNR)"
                };
        }

        return {
            value: "-",
            label: "Identifier"
        };
    }

    public toString(): string {
        return (
            this.headline +
            "\n\n" +
            this.values.map((v) => v.label + ": " + v.value).join("\n") +
            "\n\n"
        );
    }
}
