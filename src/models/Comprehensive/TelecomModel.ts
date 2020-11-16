/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import { KBVBundleResource, Vaccination, ZAEB } from "@kbv/mioparser";
import { UI, Util } from "../../components/";

import BaseModel from "../BaseModel";

export default class TelecomModel<
    T extends
        | Vaccination.V1_00_000.Profile.Practitioner
        | Vaccination.V1_00_000.Profile.PractitionerAddendum
        | Vaccination.V1_00_000.Profile.Organization
        | ZAEB.V1_00_000.Profile.Organization
> extends BaseModel<T> {
    constructor(value: T, parent: KBVBundleResource, history?: History) {
        super(value, parent, history);

        this.headline = "Kontaktinformationen";
        const telecom = Util.getTelecom(this.value);
        this.values = telecom.length
            ? telecom
            : [
                  {
                      value: `Unter „${this.headline}“ sind derzeit keine Inhalte vorhanden.`,
                      label: "Hinweis",
                      renderAs: UI.ListItemHint
                  }
              ];
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
