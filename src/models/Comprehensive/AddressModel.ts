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

import { ParserUtil, KBVBundleResource, Vaccination, ZAEB } from "@kbv/mioparser";
import { UI } from "../../components/";

import BaseModel, { ModelValue } from "../BaseModel";

export default class AddressModel<
    T extends
        | Vaccination.V1_00_000.Profile.Organization
        | ZAEB.V1_00_000.Profile.Patient
        | ZAEB.V1_00_000.Profile.Organization
> extends BaseModel<T> {
    constructor(value: T, parent: KBVBundleResource, history?: History) {
        super(value, parent, history);

        this.headline = "Anschrift";

        if (Vaccination.V1_00_000.Profile.Organization.is(value)) {
            this.values = [...this.getAddressIMOrganization()];
        } else if (ZAEB.V1_00_000.Profile.Patient.is(value)) {
            this.values = [...this.getAddressZBPatient()];
        } else if (ZAEB.V1_00_000.Profile.Organization.is(value)) {
            this.values = [...this.getAddressZBOrganization()];
        } else {
            this.values = [
                {
                    value: `Unter „${this.headline}“ sind derzeit keine Inhalte vorhanden.`,
                    label: "Hinweis",
                    renderAs: UI.ListItemHint
                }
            ];
        }
    }

    protected getAddressIMOrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<
            Vaccination.V1_00_000.Profile.OrganizationStrassenanschrift
        >(
            Vaccination.V1_00_000.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLine
            >(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse
            >(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer
            >(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz
            >(
                Vaccination.V1_00_000.Profile
                    .OrganizationStrassenanschriftLineAdresszusatz,
                strassenAnschrift?.extension
            )?.valueString;

            return [
                {
                    value: address.line ? address.line.join(" ") : "-",
                    label: "Adresszeile"
                },
                {
                    value: street ? street : "-",
                    label: "Straße"
                },
                {
                    value: number ? number : "-",
                    label: "Hausnummer"
                },
                {
                    value: addition ? addition : "-",
                    label: "Adresszusatz"
                },
                {
                    value: address ? address.postalCode : "-",
                    label: "Postleitzahl"
                },
                {
                    value: address.city ? address.city : "-",
                    label: "Stadt"
                },
                {
                    value: address.country ? address.country : "-",
                    label: "Land"
                }
            ];
        } else {
            const postbox = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationPostfach
            >(Vaccination.V1_00_000.Profile.OrganizationPostfach, this.value.address);

            const postfach = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationPostfachLine
            >(Vaccination.V1_00_000.Profile.OrganizationPostfachLine, postbox?._line);

            const postfachLine = ParserUtil.getSlice<
                Vaccination.V1_00_000.Profile.OrganizationPostfachLinePostfach
            >(
                Vaccination.V1_00_000.Profile.OrganizationPostfachLinePostfach,
                postfach?.extension
            )?.valueString;

            return [
                {
                    value: postfachLine ? postfachLine : "-",
                    label: "Postfach"
                },
                {
                    value: postbox ? postbox.postalCode : "-",
                    label: "Postleitzahl"
                },
                {
                    value: postbox && postbox.city ? postbox.city : "-",
                    label: "Stadt"
                },
                {
                    value: postbox && postbox.country ? postbox.country : "-",
                    label: "Land"
                }
            ];
        }
    }

    protected getAddressZBPatient(): ModelValue[] {
        const address = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.PatientStrassenanschrift
        >(ZAEB.V1_00_000.Profile.PatientStrassenanschrift, this.value.address);

        const strassenAnschrift = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLine
        >(ZAEB.V1_00_000.Profile.PatientStrassenanschriftLine, address?._line);

        const street = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineStrasse
        >(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineHausnummer
        >(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineAdresszusatz
        >(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return [
            {
                value: address && address.line ? address.line.join(" ") : "-",
                label: "Adresszeile"
            },
            {
                value: street ? street : "-",
                label: "Straße"
            },
            {
                value: number ? number : "-",
                label: "Hausnummer"
            },
            {
                value: addition ? addition : "-",
                label: "Adresszusatz"
            },
            {
                value: address && address.postalCode ? address.postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: address && address.city ? address.city : "-",
                label: "Stadt"
            },
            {
                value: address && address.country ? address.country : "-",
                label: "Land"
            }
        ];
    }

    protected getAddressZBOrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschrift
        >(ZAEB.V1_00_000.Profile.OrganizationStrassenanschrift, this.value.address);

        const strassenAnschrift = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLine
        >(ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLine, address?._line);

        const street = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse
        >(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer
        >(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz
        >(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return [
            {
                value: address && address.line ? address.line.join(" ") : "-",
                label: "Adresszeile"
            },
            {
                value: street ? street : "-",
                label: "Straße"
            },
            {
                value: number ? number : "-",
                label: "Hausnummer"
            },
            {
                value: addition ? addition : "-",
                label: "Adresszusatz"
            },
            {
                value: address ? address.postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: address && address.city ? address.city : "-",
                label: "Stadt"
            },
            {
                value: address && address.country ? address.country : "-",
                label: "Land"
            }
        ];
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
