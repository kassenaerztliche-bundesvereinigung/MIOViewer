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

import moment from "moment";
import purify from "dompurify";
import { History } from "history";

import {
    KBVBundleResource,
    KBVResource,
    MIOEntry,
    ParserUtil,
    Vaccination,
    ZAEB,
    MR,
    CMR,
    PKA,
    FHIR,
    HL7DE,
    Reference
} from "@kbv/mioparser";

import { EXAMPLE_PREFIX } from "../../store/examples";

import { UI, Util } from "../index";

import * as IM from "./IM";
import * as ZB from "./ZB";
import * as MP from "./MP";
import { ModelValue } from "../../models";

type patientType =
    | Vaccination.V1_1_0.Profile.Patient
    | ZAEB.V1_1_0.Profile.Patient
    | MR.V1_1_0.Profile.PatientMother
    | CMR.V1_0_1.Profile.CMRPatient
    | PKA.V1_0_0.Profile.DPEPatientDPE
    | PKA.V1_0_0.Profile.NFDPatientNFD;

export function checkIfVaccinationPatient(
    patient: patientType
): patient is Vaccination.V1_1_0.Profile.Patient {
    return !!(patient as Vaccination.V1_1_0.Profile.Patient);
}

export function checkIfZAEBPatient(
    patient: patientType
): patient is ZAEB.V1_1_0.Profile.Patient {
    return !!(patient as ZAEB.V1_1_0.Profile.Patient);
}

export function checkIfMRPatient(
    patient: patientType
): patient is MR.V1_1_0.Profile.PatientMother {
    return !!(patient as MR.V1_1_0.Profile.PatientMother);
}

export function getPatientName(patient: patientType): string {
    if (checkIfVaccinationPatient(patient)) {
        return IM.getPatientName(patient);
    } else if (checkIfZAEBPatient(patient)) {
        return ZB.getPatientName(patient);
    } else if (checkIfMRPatient(patient)) {
        return MP.getPatientMotherName(patient);
    } else {
        return "";
    }
}

export function formatDate(date: string | undefined, time = false): string {
    if (date?.includes("SSW")) {
        return date;
    }
    date = date?.replace(":60", ":59");
    const precisionRegex = /(\.[0-9]+)/;
    const precision = precisionRegex.exec(date ?? "");

    if (precision && precision.length && precision[0].length > 3) {
        const precisionNumber = precision[0].replace(".", "").slice(0, 3);
        date = date?.replace(precision[0], "." + precisionNumber);
    }
    try {
        return date
            ? moment(new Date(date)).format("DD.MM.yyyy") +
                  (time
                      ? moment(new Date(date?.replace("Z", "+00:00"))).format(" - HH:mm")
                      : "")
            : "-";
    } catch (err) {
        // console.log(new Error("Fehler beim Formatieren des Datum: '" + date + "'"));
        return date ? date : "-";
    }
}

export function dateYear(date: string | undefined): string {
    try {
        return date ? moment(new Date(date).toISOString()).format("YYYY") : "-";
    } catch (err) {
        console.log(new Error("Fehler beim Formatieren des Datum: '" + date + "'"));
        return "-";
    }
}

export function toEntry(
    history: History | undefined,
    mio: KBVBundleResource,
    entry: MIOEntry<KBVResource> | undefined,
    sub = false
): (() => void) | undefined {
    if (history && entry) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        const ref = new Reference(entry.fullUrl).toURL();
        return () => history.push(`${sub ? "/subEntry/" : "/entry/"}${mioRef}/${ref}`);
    }

    return undefined;
}

export function toEntryByRef(
    history: History | undefined,
    mio: KBVBundleResource,
    resourceRef: Reference | undefined,
    sub = false,
    filter?: string,
    filterValue?: string
): (() => void) | undefined {
    if (history && resourceRef) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        const ref = resourceRef?.toURL();
        const path = `${sub ? "/subEntry/" : "/entry/"}${mioRef}/${
            ref ? ref : "undefined"
        }`;
        const filterPath = filter && filterValue ? `/${filter}/${filterValue}` : "";
        return () => history.push(path + filterPath);
    }

    return undefined;
}

export function humanNameToString(
    name: FHIR.V4_0_1.Profile.HumanName | undefined
): string {
    if (!name) {
        return "-";
    }

    const prefix = name.prefix?.join(" ");
    const given = name.given?.join(" ");
    const family = name.family;
    const suffix = name.suffix?.join(" ");

    const nameStr = [prefix, given, family, suffix].join(" ").trim();

    return nameStr ? nameStr : name.text ? name.text : "-";
}

export function getNameFromContact(
    contact?: CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact
): string {
    if (contact) {
        if (contact.id) {
            return contact.id;
        }
        if (contact.name && contact.name.family && contact.name.given) {
            return contact.name.family + contact.name.given;
        }
        if (contact.name && contact.name.family) {
            return contact.name.family;
        } else {
            return "laboratory";
        }
    } else {
        return "laboratory";
    }
}

export function getTelecom(
    entry:
        | Vaccination.V1_1_0.Profile.Practitioner
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
        | Vaccination.V1_1_0.Profile.Organization
        | ZAEB.V1_1_0.Profile.Organization
        | MR.V1_1_0.Profile.Organization
        | MR.V1_1_0.Profile.Practitioner
        | CMR.V1_0_1.Profile.CMRPractitioner
        | CMR.V1_0_1.Profile.CMROrganization
        | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact
        | PKA.V1_0_0.Profile.NFDPatientNFD
        | PKA.V1_0_0.Profile.DPERelatedPersonContactPerson
        | PKA.V1_0_0.Profile.NFDPatientNFDContact
): UI.ListItem.Props[] {
    if (entry.telecom && entry.telecom.length) {
        const mapLabel = (v?: string): string => {
            // phone   | fax | email  | pager | url     | sms   | other
            // Telefon | Fax | E-Mail | Pager | Website | Mobil | Sonstige
            switch (v) {
                case "phone":
                    return "Telefon";
                case "fax":
                    return "Fax";
                case "email":
                    return "E-Mail";
                case "pager":
                    return "Pager";
                case "url":
                    return "Website";
                case "sms":
                    return "Mobil";
                default:
                    return "Sonstige";
            }
        };

        const mapValue = (t: {
            value?: string;
            system?: string;
        }): { value: string; href?: string } => {
            const val = purify.sanitize(t.value ?? "");
            switch (t.system) {
                case "phone":
                case "sms":
                    return {
                        value: val,
                        href: "tel:" + val
                    };
                case "email":
                    return {
                        value: val,
                        href: "mailto:" + val
                    };
                case "url": {
                    let prefix = "";
                    if (
                        !val.startsWith("https://") ||
                        !val.startsWith("http://") ||
                        !val.startsWith("www.")
                    ) {
                        prefix = "//";
                    }

                    return {
                        value: val,
                        href: prefix + val
                    };
                }
                default:
                    return {
                        value: val
                    };
            }
        };

        const results: UI.ListItem.Props[] = [];
        entry.telecom.forEach((t: { system?: string; value?: string }) => {
            results.push({
                value: mapValue(t).value,
                href: mapValue(t).href,
                label: mapLabel(t.system)
            });
        });
        return results;
    } else {
        return [];
    }
}

export function mapIdentifier(identifier: UI.ListItem.Props): UI.ListItem.Props {
    const name = identifier.label;
    let label = "Versichertennummer (" + name + ")";
    if (name === "MR") {
        label = "Patientenidentifikationsnummer (PID)";
    }
    if (name === "PPN") {
        label = "Reisepassnummer";
    }

    return {
        value: identifier.value,
        label: label
    };
}

/**
 *
 * @param patient
 */
export function getPatientIdentifier(
    patient:
        | Vaccination.V1_1_0.Profile.Patient
        | ZAEB.V1_1_0.Profile.Patient
        | MR.V1_1_0.Profile.PatientMother
        | CMR.V1_0_1.Profile.CMRPatient
        | PKA.V1_0_0.Profile.DPEPatientDPE
        | PKA.V1_0_0.Profile.NFDPatientNFD
): UI.ListItem.Props[] {
    const identifier: UI.ListItem.Props[] = [];
    patient.identifier?.forEach(
        (i: {
            type?: { coding: Util.FHIR.CodingEmpty[] };
            value: string;
            system?: string;
        }) => {
            const coding = i.type?.coding;
            if (coding) {
                const codingString = coding.map((c) => c.code).join(", ");
                identifier.push({ value: i.value, label: codingString });
            } else {
                if (i.system === "http://fhir.de/NamingSystem/gkv/kvid-10") {
                    identifier.push({ value: i.value, label: "GKV" });
                }
            }
        }
    );

    return identifier.map((i) => mapIdentifier(i));
}

export function isExample(mio?: KBVBundleResource): boolean {
    return mio?.identifier.value?.startsWith(EXAMPLE_PREFIX) ?? false;
}

export function isExamplePath(path: string): boolean {
    return path.startsWith("/example");
}

export function getQualification(
    qualification:
        | Vaccination.V1_1_0.Profile.PractitionerQualification[]
        | Vaccination.V1_1_0.Profile.PractitionerAddendumPractitionerspeciality[]
        | MR.V1_1_0.Profile.PractitionerQualification[]
        | undefined,
    conceptMaps: ParserUtil.ConceptMap[],
    valueSets: ParserUtil.ValueSet[]
): string {
    if (!qualification) {
        return "-";
    }

    return (qualification as { code: Util.FHIR.CodeEmpty }[])
        .map((q) => {
            const codings = q.code?.coding;
            if (!codings || !codings.length) {
                return "-";
            }
            return codings
                .map((coding) => {
                    const translated = Util.FHIR.translateCode(
                        coding.code ?? "",
                        conceptMaps
                    );

                    if (translated.length) {
                        return translated.join(", ");
                    } else {
                        const translatedVS = Util.FHIR.handleCodeVS(coding, valueSets);

                        return translatedVS.length
                            ? translatedVS.join(", ")
                            : coding.code ?? q.code.text ?? "-";
                    }
                })
                .join(", ");
        })
        .join(", ");
}

// https://simplifier.net/packages/de.basisprofil.r4/0.9.13/files/309987
export type HumanName = {
    use?: string;
    text?: string;
    family?: string;
    _family?: {
        extension?: {
            url?: string;
            valueString?: string;
        }[];
    };
    given?: string[];
    prefix?: string[];
    suffix?: string[];
    period?: {
        start?: string;
        end?: string;
    };
};
export function getHumanName(names: HumanName[]): string {
    const n = names.map((n) => {
        const prefix = n.prefix?.join(" ") ?? "";
        const given = n.given?.join(" ") ?? "";
        const family = n.family
            ? n.family
            : n._family?.extension?.map((e) => e.valueString).join(" ") ?? "";
        const suffix = n.suffix?.join(" ") ?? "";
        return [prefix, given, family, suffix].join(" ");
    });
    return n.join(", ") ?? "-";
}

export function getGender(
    resource:
        | Vaccination.V1_1_0.Profile.Patient
        | MR.V1_1_0.Profile.PatientChild
        | PKA.V1_0_0.Profile.DPEPatientDPE
        | PKA.V1_0_0.Profile.NFDPatientNFD,
    valueSet: ParserUtil.ValueSet[] = [HL7DE.V0_9_12.ValueSet.GenderamtlichdeValueSet],
    conceptMap?: ParserUtil.ConceptMap[]
): ModelValue {
    let g = "-";
    let valueGenderExtension = "";

    const gender = resource.gender;
    const _gender = resource._gender?.extension;

    if (gender) {
        if (conceptMap) {
            g = Util.FHIR.translateCode(gender, conceptMap).join(", ");
        } else {
            const translation = [
                {
                    in: "male",
                    out: "männlich"
                },
                {
                    in: "female",
                    out: "weiblich"
                },
                {
                    in: "other",
                    out: "andere"
                },
                {
                    in: "unknown",
                    out: "unbekannt"
                }
            ];

            const result = translation.filter((v) => v.in === gender);
            g = result.length ? result[0].out : gender;
        }
    }

    if (_gender) {
        const others: string[] = [];
        _gender.forEach((ex) => {
            if (!ex.valueCoding) {
                others.push("");
            } else if (Array.isArray(ex.valueCoding)) {
                ex.valueCoding.map((coding) => {
                    others.push(Util.FHIR.handleCodeVS(coding, valueSet).join(", "));
                });
            } else {
                others.push(Util.FHIR.handleCodeVS(ex.valueCoding, valueSet).join(", "));
            }
        });

        valueGenderExtension = Array.from(new Set(others)).join(", ");
    }

    const _g = valueGenderExtension ? ` (${valueGenderExtension})` : "";

    return {
        value: (g !== "-" ? g + _g : valueGenderExtension) ?? "-",
        label: "Geschlecht"
    };
}
