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

import { CMR, KBVBundleResource, MIOEntry, ParserUtil, Reference } from "@kbv/mioparser";
import { ModelValue } from "../../models";
import { Util } from "../index";
import { History } from "history";

export function isBundle(mio: KBVBundleResource): boolean {
    return (
        CMR.V1_0_1.Profile.CMRBundle.is(mio) ||
        CMR.V1_0_1.Profile.PCBundle.is(mio) ||
        CMR.V1_0_1.Profile.PNBundle.is(mio)
    );
}

export function countBundles(mios: KBVBundleResource[]): number {
    return mios.filter((mio) => isBundle(mio)).length;
}

export function getSpecialComposition(
    mio: CMR.V1_0_1.Profile.CMRBundle
):
    | MIOEntry<
          | CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening
          | CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening
          | CMR.V1_0_1.Profile.CMRCompositionHipScreening
          | CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening
          | CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
      >
    | undefined {
    return ParserUtil.getEntry<
        | CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening
        | CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening
        | CMR.V1_0_1.Profile.CMRCompositionHipScreening
        | CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening
        | CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
    >(mio, [
        CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening,
        CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening,
        CMR.V1_0_1.Profile.CMRCompositionHipScreening,
        CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening,
        CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
    ]);
}

export function getPercentileComposition(
    mio: CMR.V1_0_1.Profile.CMRBundle
): MIOEntry<CMR.V1_0_1.Profile.CMRCompositionPercentileCurve> | undefined {
    return ParserUtil.getEntry<CMR.V1_0_1.Profile.CMRCompositionPercentileCurve>(mio, [
        CMR.V1_0_1.Profile.CMRCompositionPercentileCurve
    ]);
}

export function translateQualification(qualificationCoding: {
    code: string;
    system: string;
}): string {
    const results: Set<string> = new Set<string>();
    CMR.V1_0_1.ValueSet.CMRPractitionerSpecialityValueSet.forEach((vs) => {
        const result = vs.concept.filter(
            (concept) => qualificationCoding.code === concept.code
        );

        if (result.length) {
            if (qualificationCoding.code === "309343006") {
                const translatedCode = ParserUtil.translateCode(
                    qualificationCoding.code,
                    CMR.V1_0_1.ConceptMap.CMRPractitionerSpecialityGerman
                );
                results.add(translatedCode.length ? translatedCode[0] : "-");
            } else {
                results.add(result[0].display ?? "-");
            }
        }
    });
    if (results.size) {
        return Array.from(results).join(", ");
    } else {
        return qualificationCoding.code;
    }
}

export function getUComposition(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle
):
    | MIOEntry<
          | CMR.V1_0_1.Profile.CMRCompositionU1
          | CMR.V1_0_1.Profile.CMRCompositionU2
          | CMR.V1_0_1.Profile.CMRCompositionU3
          | CMR.V1_0_1.Profile.CMRCompositionU4
          | CMR.V1_0_1.Profile.CMRCompositionU5
          | CMR.V1_0_1.Profile.CMRCompositionU6
          | CMR.V1_0_1.Profile.CMRCompositionU7
          | CMR.V1_0_1.Profile.CMRCompositionU7a
          | CMR.V1_0_1.Profile.CMRCompositionU8
          | CMR.V1_0_1.Profile.CMRCompositionU9
      >
    | undefined {
    return ParserUtil.getEntry<
        | CMR.V1_0_1.Profile.CMRCompositionU1
        | CMR.V1_0_1.Profile.CMRCompositionU2
        | CMR.V1_0_1.Profile.CMRCompositionU3
        | CMR.V1_0_1.Profile.CMRCompositionU4
        | CMR.V1_0_1.Profile.CMRCompositionU5
        | CMR.V1_0_1.Profile.CMRCompositionU6
        | CMR.V1_0_1.Profile.CMRCompositionU7
        | CMR.V1_0_1.Profile.CMRCompositionU7a
        | CMR.V1_0_1.Profile.CMRCompositionU8
        | CMR.V1_0_1.Profile.CMRCompositionU9
    >(mio, [
        CMR.V1_0_1.Profile.CMRCompositionU1,
        CMR.V1_0_1.Profile.CMRCompositionU2,
        CMR.V1_0_1.Profile.CMRCompositionU3,
        CMR.V1_0_1.Profile.CMRCompositionU4,
        CMR.V1_0_1.Profile.CMRCompositionU5,
        CMR.V1_0_1.Profile.CMRCompositionU6,
        CMR.V1_0_1.Profile.CMRCompositionU7,
        CMR.V1_0_1.Profile.CMRCompositionU7a,
        CMR.V1_0_1.Profile.CMRCompositionU8,
        CMR.V1_0_1.Profile.CMRCompositionU9
    ]);
}

export function getComposition(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle
):
    | MIOEntry<
          | CMR.V1_0_1.Profile.CMRCompositionU1
          | CMR.V1_0_1.Profile.CMRCompositionU2
          | CMR.V1_0_1.Profile.CMRCompositionU3
          | CMR.V1_0_1.Profile.CMRCompositionU4
          | CMR.V1_0_1.Profile.CMRCompositionU5
          | CMR.V1_0_1.Profile.CMRCompositionU6
          | CMR.V1_0_1.Profile.CMRCompositionU7
          | CMR.V1_0_1.Profile.CMRCompositionU7a
          | CMR.V1_0_1.Profile.CMRCompositionU8
          | CMR.V1_0_1.Profile.CMRCompositionU9
          | CMR.V1_0_1.Profile.PCCompositionExaminationParticipation
          | CMR.V1_0_1.Profile.PNCompositionParentalNotes
          | CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening
          | CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening
          | CMR.V1_0_1.Profile.CMRCompositionHipScreening
          | CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening
          | CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
          | CMR.V1_0_1.Profile.CMRCompositionPercentileCurve
      >
    | undefined {
    const composition = getUComposition(mio);
    if (composition) {
        return composition;
    } else if (CMR.V1_0_1.Profile.CMRBundle.is(mio)) {
        const special = getSpecialComposition(mio);
        if (special) {
            return special;
        } else {
            return getPercentileComposition(mio);
        }
    } else {
        return ParserUtil.getEntry<
            | CMR.V1_0_1.Profile.PCCompositionExaminationParticipation
            | CMR.V1_0_1.Profile.PNCompositionParentalNotes
        >(mio, [
            CMR.V1_0_1.Profile.PCCompositionExaminationParticipation,
            CMR.V1_0_1.Profile.PNCompositionParentalNotes
        ]);
    }
}

export function getCompositionEncounter(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle
):
    | MIOEntry<
          | CMR.V1_0_1.Profile.CMREncounter
          | CMR.V1_0_1.Profile.PCEncounter
          | CMR.V1_0_1.Profile.PNEncounter
      >
    | undefined {
    const composition = getComposition(mio);

    if (composition) {
        const ref = composition.resource.encounter.reference;

        return ParserUtil.getEntryWithRef<
            | CMR.V1_0_1.Profile.CMREncounter
            | CMR.V1_0_1.Profile.PCEncounter
            | CMR.V1_0_1.Profile.PNEncounter
        >(
            mio,
            [
                CMR.V1_0_1.Profile.CMREncounter,
                CMR.V1_0_1.Profile.PCEncounter,
                CMR.V1_0_1.Profile.PNEncounter
            ],
            new Reference(ref, composition.fullUrl)
        );
    }
}

export function getType(
    value:
        | CMR.V1_0_1.Profile.CMREncounter
        | CMR.V1_0_1.Profile.PCEncounter
        | CMR.V1_0_1.Profile.PNEncounter
        | CMR.V1_0_1.Profile.CMRCompositionU1
        | CMR.V1_0_1.Profile.CMRCompositionU2
        | CMR.V1_0_1.Profile.CMRCompositionU3
        | CMR.V1_0_1.Profile.CMRCompositionU4
        | CMR.V1_0_1.Profile.CMRCompositionU5
        | CMR.V1_0_1.Profile.CMRCompositionU6
        | CMR.V1_0_1.Profile.CMRCompositionU7
        | CMR.V1_0_1.Profile.CMRCompositionU7a
        | CMR.V1_0_1.Profile.CMRCompositionU8
        | CMR.V1_0_1.Profile.CMRCompositionU9
        | CMR.V1_0_1.Profile.PCCompositionExaminationParticipation
        | CMR.V1_0_1.Profile.PNCompositionParentalNotes
        | CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening
        | CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening
        | CMR.V1_0_1.Profile.CMRCompositionHipScreening
        | CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening
        | CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
        | CMR.V1_0_1.Profile.CMRCompositionPercentileCurve,
    full?: boolean
): string {
    const type = value.type;

    const coding = [];

    if (
        CMR.V1_0_1.Profile.PCCompositionExaminationParticipation.is(value) ||
        CMR.V1_0_1.Profile.PNCompositionParentalNotes.is(value) ||
        CMR.V1_0_1.Profile.CMRCompositionPercentileCurve.is(value)
    ) {
        return value.title;
    } else if (
        CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening.is(value) ||
        CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening.is(value) ||
        CMR.V1_0_1.Profile.CMRCompositionHipScreening.is(value) ||
        CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening.is(value) ||
        CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening.is(value)
    ) {
        const values: string[] = [];
        value.section.forEach((s: { title: string }) => values.push(s.title));
        return values.length
            ? values.join(", ")
            : "Spezielle Früherkennungsuntersuchungen";
    }

    if (Array.isArray(type)) {
        type.forEach((t) => coding.push(t.coding));
    } else {
        coding.push(type.coding);
    }

    const codes: string[] = [];
    coding.flat().forEach((c) => codes.push(c.code));

    const cm = [
        CMR.V1_0_1.ConceptMap.CMRExaminationNumberGerman,
        CMR.V1_0_1.ConceptMap.PCPNExaminationNumberGerman
    ];

    const translated = new Set<string>();

    if (codes.length === 1) {
        cm.forEach((c) => {
            const code = ParserUtil.translateCode(codes[0], c);
            if (code.length && code[0] !== codes[0]) {
                translated.add(code[0]);
            }
        });

        const result = Array.from(translated).join(" ");
        const parts = result.split(" ");
        return full ? result : parts.length ? parts[0] : "";
    }

    return "";
}

export function getEncounterTypeFromBundle(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    full?: boolean
): string {
    const encounter = getCompositionEncounter(mio);

    if (encounter) {
        return getType(encounter.resource, full);
    }

    return "";
}

export function getTypeFromBundle(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    full?: boolean
): string {
    const composition = getComposition(mio);

    if (composition) {
        return getType(composition.resource, full);
    }

    return "";
}

export function getUCompositionTitle(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle
): string {
    if (CMR.V1_0_1.Profile.CMRBundle) {
        const composition = getComposition(mio)?.resource;
        if (
            CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening.is(composition) ||
            CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening.is(composition) ||
            CMR.V1_0_1.Profile.CMRCompositionHipScreening.is(composition) ||
            CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening.is(composition) ||
            CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening.is(composition)
        ) {
            return composition.title;
        } else {
            return getEncounterTypeFromBundle(mio);
        }
    } else {
        return getEncounterTypeFromBundle(mio);
    }
}

export function getPatient(
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    ref?: string
): MIOEntry<CMR.V1_0_1.Profile.CMRPatient> | undefined {
    let patient = undefined;

    const composition = getComposition(mio);
    const usedRef = ref ?? composition?.resource.subject.reference;

    if (usedRef) {
        patient = ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRPatient>(
            mio,
            [CMR.V1_0_1.Profile.CMRPatient],
            new Reference(usedRef, composition?.fullUrl)
        );
    }

    return patient;
}

export function getPatientName(
    patient: CMR.V1_0_1.Profile.CMRPatient | undefined
): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientName>(
            CMR.V1_0_1.Profile.CMRPatientName,
            patient.name
        );

        if (nameSlice) {
            const parts = [];

            parts.push(nameSlice.given.join(" "));

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientNameFamilyNamenszusatz>(
                        CMR.V1_0_1.Profile.CMRPatientNameFamilyNamenszusatz,
                        nameSlice._family.extension
                    )?.valueString;

                if (addition) {
                    partsFamily.push(addition);
                }

                const pre =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientNameFamilyVorsatzwort>(
                        CMR.V1_0_1.Profile.CMRPatientNameFamilyVorsatzwort,
                        nameSlice._family.extension
                    )?.valueString;

                if (pre) {
                    partsFamily.push(pre);
                }

                const family =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientNameFamilyNachname>(
                        CMR.V1_0_1.Profile.CMRPatientNameFamilyNachname,
                        nameSlice._family.extension
                    )?.valueString;

                if (family) {
                    partsFamily.push(family);
                }

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

export function getPatientBirthName(
    patient: CMR.V1_0_1.Profile.CMRPatient | undefined
): string {
    if (patient && patient.name) {
        let nameStr = "-";
        const nameSlice = ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientGeburtsname>(
            CMR.V1_0_1.Profile.CMRPatientGeburtsname,
            patient.name
        );

        if (nameSlice) {
            const parts = [];

            if (nameSlice.family) {
                parts.push(nameSlice.family);
            } else if (nameSlice._family) {
                const partsFamily = [];

                const addition =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientGeburtsnameFamilyNamenszusatz>(
                        CMR.V1_0_1.Profile.CMRPatientGeburtsnameFamilyNamenszusatz,
                        nameSlice._family.extension
                    )?.valueString;

                if (addition) {
                    partsFamily.push(addition);
                }

                const pre =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientGeburtsnameFamilyVorsatzwort>(
                        CMR.V1_0_1.Profile.CMRPatientNameFamilyVorsatzwort,
                        nameSlice._family.extension
                    )?.valueString;

                if (pre) {
                    partsFamily.push(pre);
                }

                const family =
                    ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRPatientGeburtsnameFamilyNachname>(
                        CMR.V1_0_1.Profile.CMRPatientNameFamilyNachname,
                        nameSlice._family.extension
                    )?.valueString;

                if (family) {
                    partsFamily.push(family);
                }

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

export function getPractitionerName(
    practitioner: CMR.V1_0_1.Profile.CMRPractitioner | undefined
): string {
    if (practitioner && practitioner.name) {
        let nameStr = "-";
        const nameSlices = ParserUtil.getSlices<CMR.V1_0_1.Profile.CMRPractitionerName>(
            [CMR.V1_0_1.Profile.CMRPractitionerName],
            practitioner.name
        );

        if (nameSlices.length) {
            const nameSlice = nameSlices[0];
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

                const addition =
                    ParserUtil.getSlices<CMR.V1_0_1.Profile.CMRPractitionerNameFamilyNamenszusatz>(
                        [CMR.V1_0_1.Profile.CMRPractitionerNameFamilyNamenszusatz],
                        nameSlice._family.extension
                    );

                if (addition.length) {
                    partsFamily.push(addition[0].valueString);
                }

                const pre =
                    ParserUtil.getSlices<CMR.V1_0_1.Profile.CMRPractitionerNameFamilyVorsatzwort>(
                        [CMR.V1_0_1.Profile.CMRPractitionerNameFamilyVorsatzwort],
                        nameSlice._family.extension
                    );

                if (pre.length) {
                    partsFamily.push(pre[0].valueString);
                }

                const family =
                    ParserUtil.getSlices<CMR.V1_0_1.Profile.CMRPractitionerNameFamilyNachname>(
                        [CMR.V1_0_1.Profile.CMRPractitionerNameFamilyNachname],
                        nameSlice._family.extension
                    );

                if (family.length) {
                    partsFamily.push(family[0].valueString);
                }

                parts.push(partsFamily.join(" "));
            }

            nameStr = parts.join(" ");
        }

        return nameStr;
    }

    return "-";
}

export function getPatientModelValue(
    patientRef: Reference,
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    history?: History,
    label = "Patient/-in"
): ModelValue {
    const patient = ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRPatient>(
        mio,
        [CMR.V1_0_1.Profile.CMRPatient],
        patientRef
    )?.resource;

    return {
        value: patient ? Util.UH.getPatientName(patient) : "-",
        label: label,
        onClick: patient ? Util.Misc.toEntryByRef(history, mio, patientRef) : undefined
    };
}

export function getEncounterModelValue(
    encounterRef: Reference,
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    history?: History
): ModelValue {
    const encounter = ParserUtil.getEntryWithRef<
        | CMR.V1_0_1.Profile.CMREncounter
        | CMR.V1_0_1.Profile.PCEncounter
        | CMR.V1_0_1.Profile.PNEncounter
    >(
        mio,
        [
            CMR.V1_0_1.Profile.CMREncounter,
            CMR.V1_0_1.Profile.PCEncounter,
            CMR.V1_0_1.Profile.PNEncounter
        ],
        encounterRef
    )?.resource;

    return {
        value: encounter ? Util.Misc.formatDate(encounter.period.start) : "-",
        label: "Untersuchung",
        onClick: Util.Misc.toEntryByRef(history, mio, encounterRef)
    };
}

export function getPerformerModelValues(
    refs: Reference[] | undefined,
    mio:
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle,
    history?: History,
    label = "Durchgeführt durch"
): ModelValue[] {
    const modelValues: ModelValue[] = [];
    if (refs) {
        refs.forEach((ref) => {
            const val = ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRPractitioner>(
                mio,
                [CMR.V1_0_1.Profile.CMRPractitioner],
                ref
            );

            modelValues.push({
                value: val?.resource ? getPractitionerName(val.resource) : "-",
                label: label,
                onClick: Util.Misc.toEntryByRef(history, mio, ref),
                subEntry: val
            });
        });
    }

    return modelValues;
}
