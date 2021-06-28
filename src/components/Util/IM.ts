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

import { Vaccination, MIOEntry, ParserUtil } from "@kbv/mioparser";
import { Util } from "../index";

type Bundle = Vaccination.V1_1_0.Profile.BundleEntry;

export function getComposition(
    mio: Bundle
):
    | MIOEntry<
          | Vaccination.V1_1_0.Profile.CompositionPrime
          | Vaccination.V1_1_0.Profile.CompositionAddendum
      >
    | undefined {
    return ParserUtil.getEntry<
        | Vaccination.V1_1_0.Profile.CompositionPrime
        | Vaccination.V1_1_0.Profile.CompositionAddendum
    >(mio, [
        Vaccination.V1_1_0.Profile.CompositionPrime,
        Vaccination.V1_1_0.Profile.CompositionAddendum
    ]);
}

export function getPatient(
    mio: Bundle
): MIOEntry<Vaccination.V1_1_0.Profile.Patient> | undefined {
    const ref = getComposition(mio)?.resource.subject.reference;
    if (!ref) return;
    return ParserUtil.getEntryWithRef<Vaccination.V1_1_0.Profile.Patient>(
        mio,
        [Vaccination.V1_1_0.Profile.Patient],
        ref
    );
}

export function getEntries(
    mio: Bundle
): MIOEntry<
    | Vaccination.V1_1_0.Profile.Condition
    | Vaccination.V1_1_0.Profile.ObservationImmunizationStatus
    | Vaccination.V1_1_0.Profile.RecordPrime
    | Vaccination.V1_1_0.Profile.RecordAddendum
>[] {
    const entries: MIOEntry<
        | Vaccination.V1_1_0.Profile.Condition
        | Vaccination.V1_1_0.Profile.ObservationImmunizationStatus
        | Vaccination.V1_1_0.Profile.RecordPrime
        | Vaccination.V1_1_0.Profile.RecordAddendum
    >[] = [];

    const composition = Util.IM.getComposition(mio)?.resource;
    if (composition) {
        if (Vaccination.V1_1_0.Profile.CompositionPrime.is(composition)) {
            const refs = composition.section
                .map((s) => s.entry.map((e) => e.reference))
                .flat();

            refs.forEach((ref) => {
                const resource = ParserUtil.getEntryWithRef<
                    | Vaccination.V1_1_0.Profile.Condition
                    | Vaccination.V1_1_0.Profile.ObservationImmunizationStatus
                    | Vaccination.V1_1_0.Profile.RecordPrime
                >(
                    mio,
                    [
                        Vaccination.V1_1_0.Profile.Condition,
                        Vaccination.V1_1_0.Profile.ObservationImmunizationStatus,
                        Vaccination.V1_1_0.Profile.RecordPrime
                    ],
                    ref
                );
                if (resource) entries.push(resource);
            });
        } else {
            const refs = composition.section
                .map((s) => s.entry.map((e) => e.reference))
                .flat();

            refs.forEach((ref) => {
                const resource = ParserUtil.getEntryWithRef<Vaccination.V1_1_0.Profile.RecordAddendum>(
                    mio,
                    [Vaccination.V1_1_0.Profile.RecordAddendum],
                    ref
                );
                if (resource) entries.push(resource);
            });
        }
    }

    return entries;
}

export function getRecordPrime(
    mio: Bundle
): MIOEntry<Vaccination.V1_1_0.Profile.RecordPrime> | undefined {
    return ParserUtil.getEntry<Vaccination.V1_1_0.Profile.RecordPrime>(mio, [
        Vaccination.V1_1_0.Profile.RecordPrime
    ]);
}

export function getProvenance(
    mio: Bundle
): MIOEntry<Vaccination.V1_1_0.Profile.Provenance> | undefined {
    return ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Provenance>(mio, [
        Vaccination.V1_1_0.Profile.Provenance
    ]);
}

export function getRecordAddendum(
    mio: Bundle
): MIOEntry<Vaccination.V1_1_0.Profile.RecordAddendum> | undefined {
    return ParserUtil.getEntry<Vaccination.V1_1_0.Profile.RecordAddendum>(mio, [
        Vaccination.V1_1_0.Profile.RecordAddendum
    ]);
}

export function getRecord(
    mio: Bundle
):
    | MIOEntry<
          | Vaccination.V1_1_0.Profile.RecordAddendum
          | Vaccination.V1_1_0.Profile.RecordPrime
      >[]
    | undefined {
    return ParserUtil.getEntries<
        Vaccination.V1_1_0.Profile.RecordAddendum | Vaccination.V1_1_0.Profile.RecordPrime
    >(mio, [
        Vaccination.V1_1_0.Profile.RecordAddendum,
        Vaccination.V1_1_0.Profile.RecordPrime
    ]);
}

export function getPractitioner(
    mio: Bundle,
    ref?: string
):
    | MIOEntry<
          | Vaccination.V1_1_0.Profile.PractitionerAddendum
          | Vaccination.V1_1_0.Profile.Practitioner
      >
    | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<
            | Vaccination.V1_1_0.Profile.PractitionerAddendum
            | Vaccination.V1_1_0.Profile.Practitioner
        >(
            mio,
            [
                Vaccination.V1_1_0.Profile.PractitionerAddendum,
                Vaccination.V1_1_0.Profile.Practitioner
            ],
            ref
        );
    } else {
        let result:
            | MIOEntry<Vaccination.V1_1_0.Profile.PractitionerAddendum>
            | MIOEntry<Vaccination.V1_1_0.Profile.Practitioner>
            | undefined = ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Practitioner>(
            mio,
            [Vaccination.V1_1_0.Profile.Practitioner]
        );

        if (!result) {
            result = ParserUtil.getEntry<Vaccination.V1_1_0.Profile.PractitionerAddendum>(
                mio,
                [Vaccination.V1_1_0.Profile.PractitionerAddendum]
            );
        }

        return result;
    }
}

export function getPractitioners(
    mio: Bundle
): MIOEntry<
    | Vaccination.V1_1_0.Profile.PractitionerAddendum
    | Vaccination.V1_1_0.Profile.Practitioner
>[] {
    return ParserUtil.getEntries<
        | Vaccination.V1_1_0.Profile.Practitioner
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
    >(mio, [
        Vaccination.V1_1_0.Profile.Practitioner,
        Vaccination.V1_1_0.Profile.PractitionerAddendum
    ]);
}

export function getOrganization(
    mio: Bundle,
    ref?: string
): MIOEntry<Vaccination.V1_1_0.Profile.Organization> | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<Vaccination.V1_1_0.Profile.Organization>(
            mio,
            [Vaccination.V1_1_0.Profile.Organization],
            ref
        );
    } else {
        return ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Organization>(mio, [
            Vaccination.V1_1_0.Profile.Organization
        ]);
    }
}

export function getOrganizations(
    mio: Bundle
): MIOEntry<Vaccination.V1_1_0.Profile.Organization>[] {
    return ParserUtil.getEntries<Vaccination.V1_1_0.Profile.Organization>(mio, [
        Vaccination.V1_1_0.Profile.Organization
    ]);
}

export function getPractitionerrole(
    mio: Bundle,
    ref?: string
): MIOEntry<Vaccination.V1_1_0.Profile.Practitionerrole> | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<Vaccination.V1_1_0.Profile.Practitionerrole>(
            mio,
            [Vaccination.V1_1_0.Profile.Practitionerrole],
            ref
        );
    } else {
        return ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Practitionerrole>(mio, [
            Vaccination.V1_1_0.Profile.Practitionerrole
        ]);
    }
}

/**
 *
 * @param mio
 * @param value
 */
export function getPractitionerroleByExtension(
    mio: Bundle,
    value:
        | Vaccination.V1_1_0.Extension.Attester
        | Vaccination.V1_1_0.Extension.AttesterAddendum
        | Vaccination.V1_1_0.Extension.Enterer
        | undefined
): MIOEntry<Vaccination.V1_1_0.Profile.Practitionerrole> | undefined {
    let ref = undefined;
    if (value && value.extension) {
        const party = ParserUtil.getSlices<
            | Vaccination.V1_1_0.Extension.AttesterParty
            | Vaccination.V1_1_0.Extension.AttesterAddendumParty
        >(
            [
                Vaccination.V1_1_0.Extension.AttesterParty,
                Vaccination.V1_1_0.Extension.AttesterAddendumParty
            ],
            value.extension
        );

        if (party && party.length) ref = party[0].valueReference.reference;
    }

    return getPractitionerrole(mio, ref);
}

/**
 *
 * @param practitioner
 */
export function getPractitionerName(
    practitioner:
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
        | Vaccination.V1_1_0.Profile.Practitioner
        | undefined
): string {
    if (practitioner && practitioner.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerName>(
            Vaccination.V1_1_0.Profile.PractitionerName,
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

                const addition = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerNameFamilyNamenszusatz>(
                    Vaccination.V1_1_0.Profile.PractitionerNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerNameFamilyVorsatzwort>(
                    Vaccination.V1_1_0.Profile.PractitionerNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerNameFamilyNachname>(
                    Vaccination.V1_1_0.Profile.PractitionerNameFamilyNachname,
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

export function getPractitionerMaidenName(
    practitioner:
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
        | Vaccination.V1_1_0.Profile.Practitioner
        | undefined
): string {
    if (practitioner && practitioner.name) {
        let maidenStr = "-";
        const maidenSlice = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerGeburtsname>(
            Vaccination.V1_1_0.Profile.PractitionerGeburtsname,
            practitioner.name
        );

        if (maidenSlice) {
            if (maidenSlice.family) {
                maidenStr = maidenSlice.family;
            } else if (maidenSlice._family) {
                const parts = [];

                const addition = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyNamenszusatz>(
                    Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyNamenszusatz,
                    maidenSlice._family.extension
                )?.valueString;

                if (addition) parts.push(addition);

                const pre = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyVorsatzwort>(
                    Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyVorsatzwort,
                    maidenSlice._family.extension
                )?.valueString;

                if (pre) parts.push(pre);

                const family = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyNachname>(
                    Vaccination.V1_1_0.Profile.PractitionerGeburtsnameFamilyNachname,
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

/**
 *
 * @param patient
 */
export function getPatientName(patient: Vaccination.V1_1_0.Profile.Patient): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientName>(
            Vaccination.V1_1_0.Profile.PatientName,
            patient.name
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

                const addition = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientNameFamilyNamenszusatz>(
                    Vaccination.V1_1_0.Profile.PatientNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientNameFamilyVorsatzwort>(
                    Vaccination.V1_1_0.Profile.PatientNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientNameFamilyNachname>(
                    Vaccination.V1_1_0.Profile.PatientNameFamilyNachname,
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

export function getPatientMaidenName(
    patient: Vaccination.V1_1_0.Profile.Patient
): string {
    if (patient && patient.name) {
        let maidenStr = "-";
        const maidenSlice = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientGeburtsname>(
            Vaccination.V1_1_0.Profile.PatientGeburtsname,
            patient.name
        );

        if (maidenSlice) {
            if (maidenSlice.family) {
                maidenStr = maidenSlice.family;
            } else if (maidenSlice._family) {
                const parts = [];

                const addition = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyNamenszusatz>(
                    Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyNamenszusatz,
                    maidenSlice._family.extension
                )?.valueString;

                if (addition) parts.push(addition);

                const pre = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyVorsatzwort>(
                    Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyVorsatzwort,
                    maidenSlice._family.extension
                )?.valueString;

                if (pre) parts.push(pre);

                const family = ParserUtil.getSlice<Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyNachname>(
                    Vaccination.V1_1_0.Profile.PatientGeburtsnameFamilyNachname,
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
