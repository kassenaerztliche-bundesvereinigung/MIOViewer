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

import { CMR, KBVBase, MR, PKA, Vaccination, ZAEB } from "@kbv/mioparser";

export type finalAdressType = {
    line?: string[];
    _line?: string[];
    postalCode: string;
    city: string;
    country: string;
    use?: string;
    extension?: any[];
};

export type typesWithAdress =
    // IM
    | Vaccination.V1_1_0.Profile.Organization
    // ZB
    | ZAEB.V1_1_0.Profile.Patient
    | ZAEB.V1_1_0.Profile.Organization
    // MR
    | MR.V1_1_0.Profile.Organization
    | MR.V1_1_0.Profile.PatientMother
    | MR.V1_1_0.Profile.Practitioner
    // UH
    | CMR.V1_0_1.Profile.CMRPractitioner
    | CMR.V1_0_1.Profile.CMROrganization
    | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory
    // PKA
    | PKA.V1_0_0.Profile.NFDPractitioner
    | PKA.V1_0_0.Profile.NFDPractitionerPhysician
    | PKA.V1_0_0.Profile.NFDOrganization
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPerson;

export const codecsWithAddressArray = [
    // IM
    Vaccination.V1_1_0.Profile.Organization,
    // ZB
    ZAEB.V1_1_0.Profile.Patient,
    ZAEB.V1_1_0.Profile.Organization,
    // MR
    MR.V1_1_0.Profile.Organization,
    MR.V1_1_0.Profile.PatientMother,
    MR.V1_1_0.Profile.Practitioner,
    // UH
    CMR.V1_0_1.Profile.CMRPractitioner,
    CMR.V1_0_1.Profile.CMROrganization,
    CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory,
    // PKA
    PKA.V1_0_0.Profile.NFDPractitioner,
    PKA.V1_0_0.Profile.NFDPractitionerPhysician,
    PKA.V1_0_0.Profile.NFDOrganization,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPerson
];

export type addressTypes =
    | KBVBase.V1_0_2.Profile.OrganizationStrassenanschrift
    | KBVBase.V1_0_2.Profile.PractitionerStrassenanschrift
    | KBVBase.V1_0_2.Profile.PatientStrassenanschrift
    | KBVBase.V1_1_0.Profile.OrganizationStrassenanschrift
    | KBVBase.V1_1_0.Profile.PractitionerStrassenanschrift
    | KBVBase.V1_1_0.Profile.PatientStrassenanschrift
    | KBVBase.V1_1_1.Profile.OrganizationStrassenanschrift
    | KBVBase.V1_1_1.Profile.PractitionerStrassenanschrift
    | KBVBase.V1_1_1.Profile.PatientStrassenanschrift
    | KBVBase.V1_1_3.Profile.OrganizationStrassenanschrift
    | KBVBase.V1_1_3.Profile.PractitionerStrassenanschrift
    | KBVBase.V1_1_3.Profile.PatientStrassenanschrift
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschrift;

export const addressTypeArray = [
    KBVBase.V1_0_2.Profile.OrganizationStrassenanschrift,
    KBVBase.V1_0_2.Profile.PractitionerStrassenanschrift,
    KBVBase.V1_0_2.Profile.PatientStrassenanschrift,
    KBVBase.V1_1_0.Profile.OrganizationStrassenanschrift,
    KBVBase.V1_1_0.Profile.PractitionerStrassenanschrift,
    KBVBase.V1_1_0.Profile.PatientStrassenanschrift,
    KBVBase.V1_1_1.Profile.OrganizationStrassenanschrift,
    KBVBase.V1_1_1.Profile.PractitionerStrassenanschrift,
    KBVBase.V1_1_1.Profile.PatientStrassenanschrift,
    KBVBase.V1_1_3.Profile.OrganizationStrassenanschrift,
    KBVBase.V1_1_3.Profile.PractitionerStrassenanschrift,
    KBVBase.V1_1_3.Profile.PatientStrassenanschrift,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschrift
];

export type addressLineTypes =
    | KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLine
    | KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLine
    | KBVBase.V1_0_2.Profile.PatientStrassenanschriftLine
    | KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLine
    | KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLine
    | KBVBase.V1_1_0.Profile.PatientStrassenanschriftLine
    | KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLine
    | KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLine
    | KBVBase.V1_1_1.Profile.PatientStrassenanschriftLine
    | KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLine
    | KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLine
    | KBVBase.V1_1_3.Profile.PatientStrassenanschriftLine
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLine;

export const addressTypeLineArray = [
    KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLine,
    KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLine,
    KBVBase.V1_0_2.Profile.PatientStrassenanschriftLine,
    KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLine,
    KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLine,
    KBVBase.V1_1_0.Profile.PatientStrassenanschriftLine,
    KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLine,
    KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLine,
    KBVBase.V1_1_1.Profile.PatientStrassenanschriftLine,
    KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLine,
    KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLine,
    KBVBase.V1_1_3.Profile.PatientStrassenanschriftLine,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLine
];

export type addressLineStrasseTypes =
    | KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineStrasse
    | KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineStrasse
    | KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineStrasse
    | KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse
    | KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineStrasse
    | KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineStrasse
    | KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineStrasse
    | KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineStrasse
    | KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineStrasse
    | KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineStrasse
    | KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineStrasse
    | KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineStrasse
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineStrasse;

export const addressTypeLineStrasseArray = [
    KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineStrasse,
    KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineStrasse,
    KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineStrasse,
    KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineStrasse,
    KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineStrasse,
    KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineStrasse,
    KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineStrasse,
    KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineStrasse,
    KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineStrasse,
    KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineStrasse,
    KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineStrasse,
    KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineStrasse,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineStrasse
];

export type addressLineHausnummerTypes =
    | KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineHausnummer
    | KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineHausnummer
    | KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineHausnummer
    | KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer
    | KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineHausnummer
    | KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineHausnummer
    | KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineHausnummer
    | KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineHausnummer
    | KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineHausnummer
    | KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineHausnummer
    | KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineHausnummer
    | KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineHausnummer
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineHausnummer;

export const addressTypeLineHausnummerArray = [
    KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineHausnummer,
    KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineHausnummer,
    KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineHausnummer,
    KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineHausnummer,
    KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineHausnummer,
    KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineHausnummer,
    KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineHausnummer,
    KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineHausnummer,
    KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineHausnummer,
    KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineHausnummer,
    KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineHausnummer,
    KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineHausnummer,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineHausnummer
];

export type addressLineAdresszusatzTypes =
    | KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineAdresszusatz
    | KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineAdresszusatz
    | KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineAdresszusatz
    | KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineAdresszusatz
    | PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineAdresszusatz;

export const addressTypeLineAdresszusatzArray = [
    KBVBase.V1_0_2.Profile.OrganizationStrassenanschriftLineAdresszusatz,
    KBVBase.V1_0_2.Profile.PractitionerStrassenanschriftLineAdresszusatz,
    KBVBase.V1_0_2.Profile.PatientStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_0.Profile.OrganizationStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_0.Profile.PractitionerStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_0.Profile.PatientStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_1.Profile.OrganizationStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_1.Profile.PractitionerStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_1.Profile.PatientStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_3.Profile.OrganizationStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_3.Profile.PractitionerStrassenanschriftLineAdresszusatz,
    KBVBase.V1_1_3.Profile.PatientStrassenanschriftLineAdresszusatz,
    PKA.V1_0_0.Profile.DPERelatedPersonContactPersonStrassenanschriftLineAdresszusatz
];

export type postfachTypes =
    | KBVBase.V1_0_2.Profile.OrganizationPostfach
    | KBVBase.V1_0_2.Profile.PractitionerPostfach
    | KBVBase.V1_0_2.Profile.PatientPostfach
    | KBVBase.V1_1_0.Profile.OrganizationPostfach
    | KBVBase.V1_1_0.Profile.PractitionerPostfach
    | KBVBase.V1_1_0.Profile.PatientPostfach
    | KBVBase.V1_1_1.Profile.OrganizationPostfach
    | KBVBase.V1_1_1.Profile.PractitionerPostfach
    | KBVBase.V1_1_1.Profile.PatientPostfach
    | KBVBase.V1_1_3.Profile.OrganizationPostfach
    | KBVBase.V1_1_3.Profile.PractitionerPostfach
    | KBVBase.V1_1_3.Profile.PatientPostfach;

export const postfachTypeArray = [
    KBVBase.V1_0_2.Profile.OrganizationPostfach,
    KBVBase.V1_0_2.Profile.PractitionerPostfach,
    KBVBase.V1_0_2.Profile.PatientPostfach,
    KBVBase.V1_1_0.Profile.OrganizationPostfach,
    KBVBase.V1_1_0.Profile.PractitionerPostfach,
    KBVBase.V1_1_0.Profile.PatientPostfach,
    KBVBase.V1_1_1.Profile.OrganizationPostfach,
    KBVBase.V1_1_1.Profile.PractitionerPostfach,
    KBVBase.V1_1_1.Profile.PatientPostfach,
    KBVBase.V1_1_3.Profile.OrganizationPostfach,
    KBVBase.V1_1_3.Profile.PractitionerPostfach,
    KBVBase.V1_1_3.Profile.PatientPostfach
];

export type postfachLineTypes =
    | KBVBase.V1_0_2.Profile.OrganizationPostfachLine
    | KBVBase.V1_0_2.Profile.PractitionerPostfachLine
    | KBVBase.V1_0_2.Profile.PatientPostfachLine
    | KBVBase.V1_1_0.Profile.OrganizationPostfachLine
    | KBVBase.V1_1_0.Profile.PractitionerPostfachLine
    | KBVBase.V1_1_0.Profile.PatientPostfachLine
    | KBVBase.V1_1_1.Profile.OrganizationPostfachLine
    | KBVBase.V1_1_1.Profile.PractitionerPostfachLine
    | KBVBase.V1_1_1.Profile.PatientPostfachLine
    | KBVBase.V1_1_3.Profile.OrganizationPostfachLine
    | KBVBase.V1_1_3.Profile.PractitionerPostfachLine
    | KBVBase.V1_1_3.Profile.PatientPostfachLine;

export const postfachTypeLineArray = [
    KBVBase.V1_0_2.Profile.OrganizationPostfachLine,
    KBVBase.V1_0_2.Profile.PractitionerPostfachLine,
    KBVBase.V1_0_2.Profile.PatientPostfachLine,
    KBVBase.V1_1_0.Profile.OrganizationPostfachLine,
    KBVBase.V1_1_0.Profile.PractitionerPostfachLine,
    KBVBase.V1_1_0.Profile.PatientPostfachLine,
    KBVBase.V1_1_1.Profile.OrganizationPostfachLine,
    KBVBase.V1_1_1.Profile.PractitionerPostfachLine,
    KBVBase.V1_1_1.Profile.PatientPostfachLine,
    KBVBase.V1_1_3.Profile.OrganizationPostfachLine,
    KBVBase.V1_1_3.Profile.PractitionerPostfachLine,
    KBVBase.V1_1_3.Profile.PatientPostfachLine
];
