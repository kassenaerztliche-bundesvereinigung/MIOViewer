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

import { MR, MIOEntry, ParserUtil } from "@kbv/mioparser";
import { ModelValue } from "../../models";

type Bundle = MR.V1_00_000.Profile.Bundle;

export function getPatientMother(
    mio: Bundle
): MIOEntry<MR.V1_00_000.Profile.PatientMother> | undefined {
    return ParserUtil.getEntry<MR.V1_00_000.Profile.PatientMother>(mio, [
        MR.V1_00_000.Profile.PatientMother
    ]);
}

/**
 *
 * @param patient
 */
export function getPatientMotherName(
    patient: MR.V1_00_000.Profile.PatientMother
): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherName>(
            MR.V1_00_000.Profile.PatientMotherName,
            patient.name
        );

        if (nameSlice) {
            const parts = [];

            if (nameSlice.prefix) {
                parts.push(nameSlice.prefix);
            }

            parts.push(nameSlice.given.join(" "));

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherNameFamilyNamenszusatz>(
                    MR.V1_00_000.Profile.PatientMotherNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherNameFamilyVorsatzwort>(
                    MR.V1_00_000.Profile.PatientMotherNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherNameFamilyNachname>(
                    MR.V1_00_000.Profile.PatientMotherNameFamilyNachname,
                    nameSlice._family.extension
                )?.valueString;

                if (family) partsFamily.push(family);

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

export function getPatientChildName(patient: MR.V1_00_000.Profile.PatientChild): string {
    const id = patient.identifier.map((i) => {
        return i.extension?.map((e) => e.valueInteger).flat();
    });

    return `${id}. Kind`;
}

export function getPatientName(
    patient: MR.V1_00_000.Profile.PatientMother | MR.V1_00_000.Profile.PatientChild
): string {
    if (MR.V1_00_000.Profile.PatientMother.is(patient)) {
        return getPatientMotherName(patient);
    } else {
        return getPatientChildName(patient);
    }
}

export function getPatientMotherMaidenName(
    patient: MR.V1_00_000.Profile.PatientMother
): string {
    if (patient && patient.name) {
        let maidenStr = "-";
        const maidenSlice = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherGeburtsname>(
            MR.V1_00_000.Profile.PatientMotherGeburtsname,
            patient.name
        );

        if (maidenSlice) {
            if (maidenSlice.family) {
                maidenStr = maidenSlice.family;
            } else if (maidenSlice._family) {
                const parts = [];

                const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyNamenszusatz>(
                    MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyNamenszusatz,
                    maidenSlice._family.extension
                )?.valueString;

                if (addition) parts.push(addition);

                const pre = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyVorsatzwort>(
                    MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyVorsatzwort,
                    maidenSlice._family.extension
                )?.valueString;

                if (pre) parts.push(pre);

                const family = ParserUtil.getSlice<MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyNachname>(
                    MR.V1_00_000.Profile.PatientMotherGeburtsnameFamilyNachname,
                    maidenSlice._family.extension
                )?.valueString;

                if (family) parts.push(family);

                maidenStr = parts.join(" ");
            }
        }

        return maidenStr;
    }

    return "-";
}

export function getPractitionerName(
    practitioner: MR.V1_00_000.Profile.Practitioner | undefined
): string {
    if (practitioner && practitioner.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerName>(
            MR.V1_00_000.Profile.PractitionerName,
            practitioner.name
        );

        if (nameSlice) {
            const parts = [];

            if (nameSlice.prefix) {
                parts.push(nameSlice.prefix);
            } else if (nameSlice._prefix) {
                parts.push(nameSlice._prefix.map((p) => p.value).join(" "));
            }

            parts.push(nameSlice.given.join(" "));

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerNameFamilyNamenszusatz>(
                    MR.V1_00_000.Profile.PractitionerNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerNameFamilyVorsatzwort>(
                    MR.V1_00_000.Profile.PractitionerNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<MR.V1_00_000.Profile.PractitionerNameFamilyNachname>(
                    MR.V1_00_000.Profile.PractitionerNameFamilyNachname,
                    nameSlice._family.extension
                )?.valueString;

                if (family) partsFamily.push(family);

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

// TODO: define Types
// eslint-disable-next-line
export function getPregnancyWeekValue(entry: any): ModelValue {
    let value = "-";
    const resource = entry;
    if (Object.prototype.hasOwnProperty.call(resource, "_effectiveDateTime")) {
        const pregnancyAndWeekdayExtension = resource._effectiveDateTime?.extension?.find(
            (e: { url: string }) =>
                e.url ===
                "https://fhir.kbv.de/StructureDefinition/KBV_EX_MIO_MR_Pregnancy_Week_And_Day"
        );
        if (pregnancyAndWeekdayExtension) {
            const schwangerschaftswocheExtension = pregnancyAndWeekdayExtension.extension?.find(
                (e: { url: string }) => e.url === "schwangerschaftszeitpunkt"
            );

            if (schwangerschaftswocheExtension) {
                const schwangerschaftswoche = schwangerschaftswocheExtension.extension?.find(
                    (e: { url: string }) => e.url === "schwangerschaftswoche"
                );
                const ergaenzendeTage = schwangerschaftswocheExtension.extension?.find(
                    (e: { url: string }) => e.url === "ergaenzendeTage"
                );

                if (schwangerschaftswoche) {
                    value = schwangerschaftswoche.valueQuantity.value;
                    value = ergaenzendeTage
                        ? value + "+" + ergaenzendeTage.valueQuantity.value
                        : value + " Wochen";
                }
            }
        }
    }

    const label = "Schwangerschaftswoche";

    return {
        value,
        label
    };
}

export function getAuthor(
    mio: Bundle,
    ref?: string
):
    | MIOEntry<MR.V1_00_000.Profile.Practitioner | MR.V1_00_000.Profile.Organization>
    | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<
            MR.V1_00_000.Profile.Practitioner | MR.V1_00_000.Profile.Organization
        >(
            mio,
            [MR.V1_00_000.Profile.Practitioner, MR.V1_00_000.Profile.Organization],
            ref
        );
    }
}
