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

import { ParserUtil, KBVBundleResource, ZAEB } from "@kbv/mioparser";
import { Util } from "../../components";

import { AddressModel, BaseModel, ModelValue, TelecomModel } from "../";
import { OrganizationModel } from "./";

export default class ObservationModel extends BaseModel<ZAEB.V1_1_0.Profile.ObservationDentalCheckUp> {
    constructor(
        value: ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        const composition = ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Composition>(
            this.parent,
            [ZAEB.V1_1_0.Profile.Composition]
        )?.resource;

        const authorRef = composition?.author[0].reference;

        const organization = Util.ZB.getOrganization(
            this.parent as ZAEB.V1_1_0.Profile.Bundle,
            authorRef
        );

        this.headline = Util.Misc.formatDate(this.value.effectiveDateTime);
        this.values = [
            {
                value: Util.ZB.getObservationDisplay(this.value),
                label: "Art der Untersuchung"
            },
            {
                value: organization ? organization.resource.name : "-",
                label: "Eintrag durch",
                onClick: Util.Misc.toEntry(history, parent, organization, true),
                subEntry: organization,
                subModels: [OrganizationModel, AddressModel, TelecomModel]
            },
            {
                value: composition ? Util.Misc.formatDate(composition.date) : "-",
                label: "Datum des Eintrags"
            }
        ];
    }

    public toString(): string {
        return (
            this.headline +
            "\n\n" +
            this.values.map((v) => v.label + ": " + v.value).join("\n") +
            "\n\n"
        );
    }

    public getMainValue(): ModelValue {
        return {
            value: Util.ZB.getObservationDisplay(this.value),
            label: Util.Misc.formatDate(this.value.effectiveDateTime)
        };
    }
}
