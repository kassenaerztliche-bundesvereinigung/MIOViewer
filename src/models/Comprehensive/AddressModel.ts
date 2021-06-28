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

import {
    ParserUtil,
    KBVBundleResource,
    Vaccination,
    ZAEB,
    MR,
    CMR
} from "@kbv/mioparser";
import { UI } from "../../components/";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export default class AddressModel<
    T extends
        | Vaccination.V1_1_0.Profile.Organization
        // ZB
        | ZAEB.V1_1_0.Profile.Patient
        | ZAEB.V1_1_0.Profile.Organization
        // MR
        | MR.V1_0_0.Profile.Organization
        | MR.V1_0_0.Profile.PatientMother
        | MR.V1_0_0.Profile.Practitioner
        // UH
        | CMR.V1_0_0.Profile.CMRPractitioner
        | CMR.V1_0_0.Profile.PCPractitioner
        | CMR.V1_0_0.Profile.CMROrganization
        | CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratory
        | CMR.V1_0_0.Profile.PCOrganization
> extends BaseModel<T> {
    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);

        this.headline = "Anschrift";

        if (Vaccination.V1_1_0.Profile.Organization.is(value)) {
            this.values = [...this.getAddressIMOrganization()];
        } else if (ZAEB.V1_1_0.Profile.Patient.is(value)) {
            this.values = [...this.getAddressZBPatient()];
        } else if (ZAEB.V1_1_0.Profile.Organization.is(value)) {
            this.values = [...this.getAddressZBOrganization()];
        } else if (MR.V1_0_0.Profile.Organization.is(value)) {
            this.values = [...this.getAddressMROrganization()];
        } else if (MR.V1_0_0.Profile.PatientMother.is(value)) {
            this.values = [...this.getAddressMRPatientMother()];
        } else if (MR.V1_0_0.Profile.Practitioner.is(value)) {
            this.values = [...this.getAddressMRPractitioner()];

            // CMR
        } else if (CMR.V1_0_0.Profile.CMRPractitioner.is(value)) {
            this.values = [...this.getAddressCMRPractitioner()];
        } else if (CMR.V1_0_0.Profile.PCPractitioner.is(value)) {
            this.values = [...this.getAddressPCPractitioner()];
        } else if (CMR.V1_0_0.Profile.CMROrganization.is(value)) {
            this.values = [...this.getAddressCMROrganization()];
        } else if (CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratory.is(value)) {
            this.values = [...this.getAddressCMROrganizationScreeningLaboratory()];
        } else if (CMR.V1_0_0.Profile.PCOrganization.is(value)) {
            this.values = [...this.getAddressPCOrganization()];
        } else {
            this.values = [
                {
                    value: `Unter „${this.headline}“ sind derzeit keine Inhalte vorhanden.`,
                    label: "Hinweis",
                    renderAs: UI.ListItem.Hint
                }
            ];
        }
    }

    protected getAddressIMOrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationStrassenanschrift>(
            Vaccination.V1_1_0.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLine>(
                Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse>(
                Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer>(
                Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
                Vaccination.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz,
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
            const postbox = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationPostfach>(
                Vaccination.V1_1_0.Profile.OrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationPostfachLine>(
                Vaccination.V1_1_0.Profile.OrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.OrganizationPostfachLinePostfach>(
                Vaccination.V1_1_0.Profile.OrganizationPostfachLinePostfach,
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
        const address = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientStrassenanschrift>(
            ZAEB.V1_1_0.Profile.PatientStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientStrassenanschriftLine>(
            ZAEB.V1_1_0.Profile.PatientStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineStrasse>(
            ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineHausnummer>(
            ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineAdresszusatz>(
            ZAEB.V1_1_0.Profile.PatientStrassenanschriftLineAdresszusatz,
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
        const address = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.OrganizationStrassenanschrift>(
            ZAEB.V1_1_0.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLine>(
            ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse>(
            ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer>(
            ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
            ZAEB.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz,
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
        const address = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationStrassenanschrift>(
            MR.V1_0_0.Profile.OrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationStrassenanschriftLine>(
                MR.V1_0_0.Profile.OrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationStrassenanschriftLineStrasse>(
                MR.V1_0_0.Profile.OrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationStrassenanschriftLineHausnummer>(
                MR.V1_0_0.Profile.OrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationStrassenanschriftLineAdresszusatz>(
                MR.V1_0_0.Profile.OrganizationStrassenanschriftLineAdresszusatz,
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
            const postbox = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationPostfach>(
                MR.V1_0_0.Profile.OrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationPostfachLine>(
                MR.V1_0_0.Profile.OrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<MR.V1_0_0.Profile.OrganizationPostfachLinePostfach>(
                MR.V1_0_0.Profile.OrganizationPostfachLinePostfach,
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
        const address = ParserUtil.getSlice<MR.V1_0_0.Profile.PatientMotherStrassenanschrift>(
            MR.V1_0_0.Profile.PatientMotherStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<MR.V1_0_0.Profile.PatientMotherStrassenanschriftLine>(
            MR.V1_0_0.Profile.PatientMotherStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineStrasse>(
            MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineHausnummer>(
            MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineAdresszusatz>(
            MR.V1_0_0.Profile.PatientMotherStrassenanschriftLineAdresszusatz,
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
        const address = ParserUtil.getSlice<MR.V1_0_0.Profile.PractitionerStrassenanschrift>(
            MR.V1_0_0.Profile.PractitionerStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<MR.V1_0_0.Profile.PractitionerStrassenanschriftLine>(
            MR.V1_0_0.Profile.PractitionerStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<MR.V1_0_0.Profile.PractitionerStrassenanschriftLineStrasse>(
            MR.V1_0_0.Profile.PractitionerStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<MR.V1_0_0.Profile.PractitionerStrassenanschriftLineHausnummer>(
            MR.V1_0_0.Profile.PractitionerStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<MR.V1_0_0.Profile.PractitionerStrassenanschriftLineAdresszusatz>(
            MR.V1_0_0.Profile.PractitionerStrassenanschriftLineAdresszusatz,
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

    protected getAddressCMRPractitioner(): ModelValue[] {
        const address = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerStrassenanschrift>(
            CMR.V1_0_0.Profile.CMRPractitionerStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLine>(
            CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineStrasse>(
            CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineHausnummer>(
            CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineAdresszusatz>(
            CMR.V1_0_0.Profile.CMRPractitionerStrassenanschriftLineAdresszusatz,
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

    protected getAddressPCPractitioner(): ModelValue[] {
        const address = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCPractitionerStrassenanschrift>(
            CMR.V1_0_0.Profile.PCPractitionerStrassenanschrift,
            this.value.address
        );

        const strassenAnschrift = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLine>(
            CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLine,
            address?._line
        );

        const street = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineStrasse>(
            CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineStrasse,
            strassenAnschrift?.extension
        )?.valueString;

        const number = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineHausnummer>(
            CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineHausnummer,
            strassenAnschrift?.extension
        )?.valueString;

        const addition = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineAdresszusatz>(
            CMR.V1_0_0.Profile.PCPractitionerStrassenanschriftLineAdresszusatz,
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

    protected getAddressCMROrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationStrassenanschrift>(
            CMR.V1_0_0.Profile.CMROrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLine>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineStrasse>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineHausnummer>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineAdresszusatz>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineAdresszusatz,
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
            const postbox = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationPostfach>(
                CMR.V1_0_0.Profile.CMROrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationPostfachLine>(
                CMR.V1_0_0.Profile.CMROrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationPostfachLinePostfach>(
                CMR.V1_0_0.Profile.CMROrganizationPostfachLinePostfach,
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

    protected getAddressCMROrganizationScreeningLaboratory(): ModelValue[] {
        const address = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschrift>(
            CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschriftLine>(
                CMR.V1_0_0.Profile
                    .CMROrganizationScreeningLaboratoryStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschriftLineStrasse>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschriftLineHausnummer>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryStrassenanschriftLineAdresszusatz>(
                CMR.V1_0_0.Profile.CMROrganizationStrassenanschriftLineAdresszusatz,
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
            const postbox = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfach>(
                CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfachLine>(
                CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfachLinePostfach>(
                CMR.V1_0_0.Profile.CMROrganizationScreeningLaboratoryPostfachLinePostfach,
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

    protected getAddressPCOrganization(): ModelValue[] {
        const address = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationStrassenanschrift>(
            CMR.V1_0_0.Profile.PCOrganizationStrassenanschrift,
            this.value.address
        );

        if (address) {
            const strassenAnschrift = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLine>(
                CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLine,
                address?._line
            );

            const street = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineStrasse>(
                CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineStrasse,
                strassenAnschrift?.extension
            )?.valueString;

            const number = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineHausnummer>(
                CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineHausnummer,
                strassenAnschrift?.extension
            )?.valueString;

            const addition = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineAdresszusatz>(
                CMR.V1_0_0.Profile.PCOrganizationStrassenanschriftLineAdresszusatz,
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
            const postbox = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationPostfach>(
                CMR.V1_0_0.Profile.PCOrganizationPostfach,
                this.value.address
            );

            const postfach = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationPostfachLine>(
                CMR.V1_0_0.Profile.PCOrganizationPostfachLine,
                postbox?._line
            );

            const postfachLine = ParserUtil.getSlice<CMR.V1_0_0.Profile.PCOrganizationPostfachLinePostfach>(
                CMR.V1_0_0.Profile.PCOrganizationPostfachLinePostfach,
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

    // TODO:
    public getMainValue(): ModelValue {
        const defaultValue = {
            label: "-",
            value: "-"
        };
        return this.values.length ? this.values[0] : defaultValue;
    }
}
