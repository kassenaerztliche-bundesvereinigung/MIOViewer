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

import { KBVBundleResource, Vaccination, ZAEB, MR, CMR } from "@kbv/mioparser";
import { UI, Util } from "../../components/";

import BaseModel from "../BaseModel";
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../Types";

export default class TelecomModel<
    T extends
        | Vaccination.V1_1_0.Profile.Practitioner
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
        | Vaccination.V1_1_0.Profile.Organization
        | ZAEB.V1_1_0.Profile.Organization
        | MR.V1_0_0.Profile.Organization
        | MR.V1_0_0.Profile.Practitioner
        | CMR.V1_0_1.Profile.CMRPractitioner
        | CMR.V1_0_1.Profile.CMROrganization
> extends BaseModel<T> {
    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);

        this.headline = "Kontaktinformationen";
        const telecom = Util.Misc.getTelecom(this.value);
        this.values = telecom.length
            ? telecom.map((t) => {
                  return {
                      value: t.value,
                      href: t.href,
                      label: t.label,
                      renderAs: UI.ListItem.Link
                  } as ModelValue;
              })
            : [
                  {
                      value: `Unter „${this.headline}“ sind derzeit keine Inhalte vorhanden.`,
                      label: "Hinweis",
                      renderAs: UI.ListItem.Hint
                  }
              ];
    }

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean
    ): Content {
        return super.toPDFContent(styles, subTable, removeHTML ?? true);
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.length ? this.values.map((v) => v.value).join(", ") : "-",
            label: this.headline
        };
    }
}
