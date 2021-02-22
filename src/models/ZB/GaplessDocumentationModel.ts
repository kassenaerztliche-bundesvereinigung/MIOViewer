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
import { Util, UI } from "../../components";

import { AddressModel, BaseModel, TelecomModel } from "../";
import { OrganizationModel } from "./";

export default class GaplessDocumentationModel extends BaseModel<ZAEB.V1_00_000.Profile.GaplessDocumentation> {
    constructor(
        value: ZAEB.V1_00_000.Profile.GaplessDocumentation,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = this.value.code.text;

        const composition = ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Composition>(
            this.parent,
            [ZAEB.V1_00_000.Profile.Composition]
        )?.resource;

        const authorRef = composition?.author[0].reference;

        const organization = Util.ZB.getOrganization(
            this.parent as ZAEB.V1_00_000.Profile.Bundle,
            authorRef
        );

        const disclaimer = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.GaplessDocumentationDisclaimer>(
            ZAEB.V1_00_000.Profile.GaplessDocumentationDisclaimer,
            value.extension
        )?.valueString;

        this.values = [
            {
                value: Util.Misc.formatDate(this.value.valueDateTime),
                label: "Datum"
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
            },
            {
                label: "Allgemeiner Hinweis",
                value: disclaimer ? disclaimer : "-",
                renderAs: UI.ListItemExpandable
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
}
