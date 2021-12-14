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

import BaseModel from "../BaseModel";
import { CMR, KBVBundleResource } from "@kbv/mioparser";
import { UI, Util } from "components";
import { ModelValue } from "../Types";

export default class ContactDetailsModel<
    T extends CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory
> extends BaseModel<T> {
    protected contact?: CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact;

    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);
        const contactFindings = value.contact?.filter(
            (c) =>
                Util.Misc.humanNameToString(c.name) ===
                history?.location.pathname.split("/").pop()
        );
        if (contactFindings && contactFindings.length === 1) {
            this.contact = contactFindings[0];
        }
        this.headline = Util.Misc.humanNameToString(this.contact?.name) ?? ""; //Util.Misc.humanNameToString(value);
        if (this.contact) {
            const telecom = Util.Misc.getTelecom(this.contact);
            this.values = telecom.length
                ? telecom.map((t) => {
                      return {
                          value: t.value,
                          href: t.value,
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
