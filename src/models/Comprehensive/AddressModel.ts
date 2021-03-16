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

import { ParserUtil, KBVBundleResource, Vaccination, ZAEB, MR } from "@kbv/mioparser";
import { UI } from "../../components/";

import BaseModel, { ModelValue } from "../BaseModel";

export default class AddressModel<
    T extends
        | Vaccination.V1_00_000.Profile.Organization
        | ZAEB.V1_00_000.Profile.Patient
        | ZAEB.V1_00_000.Profile.Organization
        | MR.V1_00_000.Profile.Organization
        | MR.V1_00_000.Profile.PatientMother
        | MR.V1_00_000.Profile.Practitioner
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
        } else if (MR.V1_00_000.Profile.Organization.is(value)) {
            this.values = [...this.getAddressMROrganization()];
        } else if (MR.V1_00_000.Profile.PatientMother.is(value)) {
            this.values = [...this.getAddressMRPatientMother()];
        } else if (MR.V1_00_000.Profile.Practitioner.is(value)) {
            this.values = [...this.getAddressMRPractitioner()];
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
        const address = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationStrassenanschrift>(
            Vaccination.V1_00_000.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLine>(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse>(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer>(
                Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
                Vaccination.V1_00_000.Profile
                    .OrganizationStrassenanschriftLineAdresszusatz,
                strassenAnschrift?.extension
            )?.valueString;

            return this.fillValues(
                address?.line,
                street,
                number,
                addition,
                address?.postalCode,
                address?.city,
                address?.country
            );
        } else {
            const postbox = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationPostfach>(
                Vaccination.V1_00_000.Profile.OrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationPostfachLine>(
                Vaccination.V1_00_000.Profile.OrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<Vaccination.V1_00_000.Profile.OrganizationPostfachLinePostfach>(
                Vaccination.V1_00_000.Profile.OrganizationPostfachLinePostfach,
                postfach?.extension
            )?.valueString;

            return this.fillValuesPostBox(
                postfachLine,
                postbox?.postalCode,
                postbox?.city,
                postbox?.country
            );
        }
    }

    protected getAddressZBPatient(): ModelValue[] {
        const address = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientStrassenanschrift>(
            ZAEB.V1_00_000.Profile.PatientStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientStrassenanschriftLine>(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineStrasse>(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineHausnummer>(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineAdresszusatz>(
            ZAEB.V1_00_000.Profile.PatientStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return this.fillValues(
            address?.line,
            street,
            number,
            addition,
            address?.postalCode,
            address?.city,
            address?.country,
            address?.use
        );
    }

    protected getAddressZBOrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.OrganizationStrassenanschrift>(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLine>(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse>(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer>(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
            ZAEB.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return this.fillValues(
            address?.line,
            street,
            number,
            addition,
            address?.postalCode,
            address?.city,
            address?.country,
            address?.use
        );
    }

    protected getAddressMROrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationStrassenanschrift>(
            MR.V1_00_000.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationStrassenanschriftLine>(
                MR.V1_00_000.Profile.OrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse>(
                MR.V1_00_000.Profile.OrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer>(
                MR.V1_00_000.Profile.OrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
                MR.V1_00_000.Profile.OrganizationStrassenanschriftLineAdresszusatz,
                strassenAnschrift?.extension
            )?.valueString;

            return this.fillValues(
                address?.line,
                street,
                number,
                addition,
                address?.postalCode,
                address?.city,
                address?.country,
                address?.use
            );
        } else {
            const postbox = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationPostfach>(
                MR.V1_00_000.Profile.OrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationPostfachLine>(
                MR.V1_00_000.Profile.OrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<MR.V1_00_000.Profile.OrganizationPostfachLinePostfach>(
                MR.V1_00_000.Profile.OrganizationPostfachLinePostfach,
                postfach?.extension
            )?.valueString;

            return this.fillValuesPostBox(
                postfachLine,
                postbox?.postalCode,
                postbox?.city,
                postbox?.country,
                postbox?.use
            );
        }
    }

    protected getAddressMRPatientMother(): ModelValue[] {
        const address = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherStrassenanschrift>(
            MR.V1_00_000.Profile.PatientMotherStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherStrassenanschriftLine>(
            MR.V1_00_000.Profile.PatientMotherStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineStrasse>(
            MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineHausnummer>(
            MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineAdresszusatz>(
            MR.V1_00_000.Profile.PatientMotherStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return this.fillValues(
            address?.line,
            street,
            number,
            addition,
            address?.postalCode,
            address?.city,
            address?.country,
            address?.use
        );
    }

    protected getAddressMRPractitioner(): ModelValue[] {
        const address = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerStrassenanschrift>(
            MR.V1_00_000.Profile.PractitionerStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerStrassenanschriftLine>(
            MR.V1_00_000.Profile.PractitionerStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerStrassenanschriftLineStrasse>(
            MR.V1_00_000.Profile.PractitionerStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerStrassenanschriftLineHausnummer>(
            MR.V1_00_000.Profile.PractitionerStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerStrassenanschriftLineAdresszusatz>(
            MR.V1_00_000.Profile.PractitionerStrassenanschriftLineAdresszusatz,
            strassenAnschrift?.extension
        )?.valueString;

        return this.fillValues(
            address?.line,
            street,
            number,
            addition,
            address?.postalCode,
            address?.city,
            address?.country,
            address?.use
        );
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }

    protected fillValues(
        line?: string[],
        street?: string,
        number?: string,
        addition?: string,
        postalCode?: string,
        city?: string,
        country?: string,
        use?: string
    ): ModelValue[] {
        const values: ModelValue[] = [];

        if (use) {
            values.push({
                value: this.getAddressUse(use),
                label: "Art"
            });
        }

        if (street && number) {
            values.push({
                value: `${street} ${number}` + (addition ? `, ${addition}` : ""),
                label: "Adresszeile"
            });
        } else {
            values.push({
                value: line ? line.join(" ") : "-",
                label: "Adresszeile"
            });
        }

        values.push(
            {
                value: postalCode ? postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: city ? city : "-",
                label: "Stadt"
            },
            {
                value: country ? country : "-",
                label: "Land"
            }
        );

        return values;
    }

    protected fillValuesPostBox(
        line?: string,
        postalCode?: string,
        city?: string,
        country?: string,
        use?: string
    ): ModelValue[] {
        const values: ModelValue[] = [];

        if (use) {
            values.push({
                value: this.getAddressUse(use),
                label: "Art"
            });
        }

        values.push(
            {
                value: line ? line : "-",
                label: "Postfach"
            },
            {
                value: postalCode ? postalCode : "-",
                label: "Postleitzahl"
            },
            {
                value: city ? city : "-",
                label: "Stadt"
            },
            {
                value: country ? country : "-",
                label: "Land"
            }
        );

        return values;
    }

    protected getAddressUse(use: string): string {
        /**
         * https://simplifier.net/packages/hl7.fhir.r4.core/4.0.1/files/79935
         *
         * home (Home): A communication address at a home.
         * work	(Work):	An office address. First choice for business related contacts during business hours.
         * temp	(Temporary): A temporary address. The period can provide more detailed information.
         * old (Old / Incorrect): This address is no longer in use (or was never correct but retained for records).
         * billing (Billing): An address to be used to send bills, invoices, receipts etc.
         *
         * Übersetzungen:
         * Postanschrift, Arbeit, Temporär, Veraltet, Rechnungsanschrift
         */

        const values = [
            {
                in: "home",
                out: "Postanschrift"
            },
            {
                in: "work",
                out: "Arbeit"
            },
            {
                in: "temp",
                out: "Temporär"
            },
            {
                in: "old",
                out: "Veraltet"
            },
            {
                in: "billing",
                out: "Rechnungsanschrift"
            }
        ];
        const result = values.filter((v) => v.in === use);

        if (result.length) return result[0].out;
        return "-";
    }
}
