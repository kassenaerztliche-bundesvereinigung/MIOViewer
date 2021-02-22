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

type Bundle = ZAEB.V1_00_000.Profile.Bundle;

export function getPatient(
    mio: Bundle
): MIOEntry<ZAEB.V1_00_000.Profile.Patient> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Patient>(mio, [
        ZAEB.V1_00_000.Profile.Patient
    ]);
}

export function getObservation(
    mio: Bundle
): MIOEntry<ZAEB.V1_00_000.Profile.Observation> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Observation>(mio, [
        ZAEB.V1_00_000.Profile.Observation
    ]);
}

export function getObservations(
    mio: Bundle
): MIOEntry<ZAEB.V1_00_000.Profile.Observation>[] {
    return ParserUtil.getEntries<ZAEB.V1_00_000.Profile.Observation>(mio, [
        ZAEB.V1_00_000.Profile.Observation
    ]);
}

export function getGaplessDocumentation(
    mio: Bundle
): MIOEntry<ZAEB.V1_00_000.Profile.GaplessDocumentation> | undefined {
    return ParserUtil.getEntry<ZAEB.V1_00_000.Profile.GaplessDocumentation>(mio, [
        ZAEB.V1_00_000.Profile.GaplessDocumentation
    ]);
}

export function getOrganization(
    mio: Bundle,
    ref?: string
): MIOEntry<ZAEB.V1_00_000.Profile.Organization> | undefined {
    if (ref) {
        return ParserUtil.getEntryWithRef<ZAEB.V1_00_000.Profile.Organization>(
            mio,
            [ZAEB.V1_00_000.Profile.Organization],
            ref
        );
    } else {
        return ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Organization>(mio, [
            ZAEB.V1_00_000.Profile.Organization
        ]);
    }
}

/**
 *
 * @param patient
 */
export function getPatientName(patient: ZAEB.V1_00_000.Profile.Patient): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientName>(
            ZAEB.V1_00_000.Profile.PatientName,
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

                const addition = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientNameFamilyNamenszusatz>(
                    ZAEB.V1_00_000.Profile.PatientNameFamilyNamenszusatz,
                    nameSlice._family.extension
                )?.valueString;

                if (addition) partsFamily.push(addition);

                const pre = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientNameFamilyVorsatzwort>(
                    ZAEB.V1_00_000.Profile.PatientNameFamilyVorsatzwort,
                    nameSlice._family.extension
                )?.valueString;

                if (pre) partsFamily.push(pre);

                const family = ParserUtil.getSlice<ZAEB.V1_00_000.Profile.PatientNameFamilyNachname>(
                    ZAEB.V1_00_000.Profile.PatientNameFamilyNachname,
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

export function getObservationDisplay(entry: ZAEB.V1_00_000.Profile.Observation): string {
    if (entry.code.text) {
        return entry.code.text;
    } else {
        let result = "-";
        entry.code.coding.forEach((c) => {
            ZAEB.V1_00_000.ConceptMap.PreventiveCheckUpGerman.forEach((cm) => {
                cm.element.forEach((el) => {
                    if (el.code === c.code) {
                        result = el.target.map((t) => t.display).join(", ");
                    }
                });
            });
        });

        return result;
    }
}
