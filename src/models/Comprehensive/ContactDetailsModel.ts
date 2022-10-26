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

import BaseModel from "../BaseModel";
import { CMR, PKA, FHIR, KBVBundleResource } from "@kbv/mioparser";
import { UI, Util } from "components";
import { ModelValue } from "../Types";

export default class ContactDetailsModel<
    T extends
        | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory
        | PKA.V1_0_0.Profile.NFDPatientNFD
> extends BaseModel<T> {
    protected contacts: (
        | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact
        | PKA.V1_0_0.Profile.NFDPatientNFDContact
    )[] = [];

    constructor(
        value: T,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History,
        contactName?: string
    ) {
        super(value, fullUrl, parent, history);
        const contact = value.contact as {
            name: FHIR.V4_0_1.Profile.HumanName | undefined;
        }[];

        const filter = history?.location.pathname.split("/").pop() ?? contactName;
        const contactFindings = contact
            ? contact.filter((c) => {
                  return filter ? Util.Misc.humanNameToString(c.name) === filter : true;
              })
            : [];

        if (filter && contactFindings && contactFindings.length === 1) {
            this.contacts = [contactFindings[0]];
        } else {
            this.contacts = contactFindings;
        }

        this.contacts.forEach((contact) => {
            this.headline = Util.Misc.humanNameToString(contact.name) ?? ""; //Util.Misc.humanNameToString(value);

            const telecom = Util.Misc.getTelecom(contact);

            this.values = [
                ...telecom.map((t) => {
                    return {
                        value: t.value ?? "-",
                        href: t.value,
                        label: t.label,
                        renderAs: UI.ListItem.Link
                    };
                })
            ];

            if (PKA.V1_0_0.Profile.NFDPatientNFDContact.is(contact)) {
                this.values.push(
                    ...contact.relationship.map((r) => {
                        return {
                            value:
                                Util.FHIR.handleCode(r)
                                    .filter((r) => r != "-")
                                    .join(", ") ??
                                r.text ??
                                "-",
                            label: "Beziehung zum Patienten"
                        };
                    })
                );
            }
        });

        if (!this.values.length) {
            this.values = [
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
