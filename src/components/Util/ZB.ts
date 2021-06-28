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

import { ZAEB, MIOEntry, ParserUtil } from "@kbv/mioparser";
import { Util } from "../index";
import { FHIR } from "./index";

type Bundle = ZAEB.V1_1_0.Profile.Bundle;

export function getComposition(
    mio: Bundle
): MIOEntry<ZAEB.V1_1_0.Profile.Composition> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Composition>(mio, [
        ZAEB.V1_1_0.Profile.Composition
    ]);
}

export function getPatient(
    mio: Bundle
): MIOEntry<ZAEB.V1_1_0.Profile.Patient> | undefined {
    const subject = Util.ZB.getComposition(mio)?.resource.subject.reference;
    return Util.ZB.getPatientByRef(mio, subject);
}

export function getPatientByRef(
    mio: Bundle,
    ref?: string
): MIOEntry<ZAEB.V1_1_0.Profile.Patient> | undefined {
    if (!ref) return;
    return ParserUtil.getEntryWithRef<ZAEB.V1_1_0.Profile.Patient>(
        mio,
        [ZAEB.V1_1_0.Profile.Patient],
        ref
    );
}

export function getEntries(
    mio: Bundle
): MIOEntry<
    | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
    | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
>[] {
    const entries: MIOEntry<
        | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
        | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
    >[] = [];

    const composition = Util.ZB.getComposition(mio)?.resource;
    if (composition) {
        const refs = composition.section
            .map((s) => s.entry.map((e) => e.reference))
            .flat();

        refs.forEach((ref) => {
            const resource = ParserUtil.getEntryWithRef<
                | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
                | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
            >(
                mio,
                [
                    ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
                    ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
                ],
                ref
            );
            if (resource) entries.push(resource);
        });
    }

    return entries;
}

export function getObservationDentalCheckUp(
    mio: Bundle
): MIOEntry<ZAEB.V1_1_0.Profile.ObservationDentalCheckUp> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_1_0.Profile.ObservationDentalCheckUp>(mio, [
        ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
    ]);
}

export function getObservationGaplessDocumentation(
    mio: Bundle
): MIOEntry<ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation>(mio, [
        ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
    ]);
}

export function getOrganization(
    mio: Bundle,
    ref?: string
): MIOEntry<ZAEB.V1_1_0.Profile.Organization> | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<ZAEB.V1_1_0.Profile.Organization>(
            mio,
            [ZAEB.V1_1_0.Profile.Organization],
            ref
        );
    } else {
        return ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Organization>(mio, [
            ZAEB.V1_1_0.Profile.Organization
        ]);
    }
}

/**
 *
 * @param patient
 */
export function getPatientName(patient: ZAEB.V1_1_0.Profile.Patient): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientName>(
            ZAEB.V1_1_0.Profile.PatientName,
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

                const addition = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientNameFamilyNamenszusatz>(
                    ZAEB.V1_1_0.Profile.PatientNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientNameFamilyVorsatzwort>(
                    ZAEB.V1_1_0.Profile.PatientNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<ZAEB.V1_1_0.Profile.PatientNameFamilyNachname>(
                    ZAEB.V1_1_0.Profile.PatientNameFamilyNachname,
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

export function getObservationDisplay(
    entry: ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
): string {
    return FHIR.handleCode(entry.code, [
        ZAEB.V1_1_0.ConceptMap.PreventiveCheckUpGerman
    ]).join(", ");
}
