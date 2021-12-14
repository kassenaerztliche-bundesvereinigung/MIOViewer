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

import moment from "moment";
import purify from "dompurify";
import { DateTime } from "luxon";
import { History } from "history";

import {
    CMR,
    KBVBundleResource,
    KBVResource,
    MIOEntry,
    MR,
    ParserUtil,
    Vaccination,
    ZAEB,
    FHIR
} from "@kbv/mioparser";

import { EXAMPLE_PREFIX } from "../../store/examples";

import { UI, Util } from "../index";

import * as IM from "./IM";
import * as ZB from "./ZB";
import * as MP from "./MP";

type patientType =
    | Vaccination.V1_1_0.Profile.Patient
    | ZAEB.V1_1_0.Profile.Patient
    | MR.V1_0_0.Profile.PatientMother
    | CMR.V1_0_1.Profile.CMRPatient;

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
): patient is MR.V1_0_0.Profile.PatientMother {
    return !!(patient as MR.V1_0_0.Profile.PatientMother);
}

export function getPatientName(patient: patientType): string {
    if (checkIfVaccinationPatient(patient)) return IM.getPatientName(patient);
    else if (checkIfZAEBPatient(patient)) return ZB.getPatientName(patient);
    else if (checkIfMRPatient(patient)) return MP.getPatientMotherName(patient);
    else return "";
}

export function formatDate(date: string | undefined, time = false): string {
    if (date?.includes("SSW")) return date;
    date = date?.replace(":60", ":59");
    const precisionRegex = /(\.[0-9]+)/;
    const precision = precisionRegex.exec(date ?? "");

    if (precision && precision.length && precision[0].length > 3) {
        const precisionNumber = precision[0].replace(".", "").slice(0, 3);
        date = date?.replace(precision[0], "." + precisionNumber);
    }
    try {
        return date
            ? DateTime.fromJSDate(new Date(date)).toFormat("dd.MM.yyyy") +
                  (time
                      ? DateTime.fromJSDate(
                            new Date(date?.replace("Z", "+00:00"))
                        ).toFormat(" - HH:mm")
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
        const ref = ParserUtil.getUuidFromEntry(entry);
        return () => history.push(`${sub ? "/subEntry/" : "/entry/"}${mioRef}/${ref}`);
    }

    return undefined;
}

export function toEntryByRef(
    history: History | undefined,
    mio: KBVBundleResource,
    resourceRef: string | undefined,
    sub = false,
    filter?: string,
    filterValue?: string
): (() => void) | undefined {
    if (history && resourceRef) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        const ref = ParserUtil.getUuid(resourceRef);
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
    if (!name) return "-";

    const prefix = name.prefix?.join(" ");
    const given = name.given?.join(" ");
    const family = name.family;
    const suffix = name.suffix?.join(" ");

    const nameStr = [prefix, given, family, suffix].join(" ");

    return nameStr ? nameStr : name.text ? name.text : "-";
}

export function getNameFromContact(
    contact?: CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact
): string {
    if (contact) {
        if (contact.id) return contact.id;
        if (contact.name && contact.name.family && contact.name.given)
            return contact.name.family + contact.name.given;
        if (contact.name && contact.name.family) return contact.name.family;
        else return "laboratory";
    } else return "laboratory";
}

export function getTelecom(
    entry:
        | Vaccination.V1_1_0.Profile.Practitioner
        | Vaccination.V1_1_0.Profile.PractitionerAddendum
        | Vaccination.V1_1_0.Profile.Organization
        | ZAEB.V1_1_0.Profile.Organization
        | MR.V1_0_0.Profile.Organization
        | MR.V1_0_0.Profile.Practitioner
        | CMR.V1_0_1.Profile.CMRPractitioner
        | CMR.V1_0_1.Profile.CMROrganization
        | CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratoryContact
): UI.ListItem.Props[] {
    if (entry.telecom && entry.telecom.length) {
        const mapLabel = (v: string): string => {
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
            value: string;
            system: string;
        }): { value: string; href?: string } => {
            const val = purify.sanitize(t.value);
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
        entry.telecom.forEach((t) => {
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
    if (name === "MR") label = "Patientenidentifikationsnummer (PID)";
    if (name === "PPN") label = "Reisepassnummer";

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
        | MR.V1_0_0.Profile.PatientMother
        | CMR.V1_0_1.Profile.CMRPatient
): UI.ListItem.Props[] {
    const identifier: UI.ListItem.Props[] = [];

    // TODO
    // eslint-disable-next-line
    patient.identifier?.forEach((i: any) => {
        const coding = i.type?.coding;
        if (coding) {
            const codingString = coding.map((c: { code: string }) => c.code).join(", ");
            identifier.push({ value: i.value, label: codingString });
        } else {
            if (i.system === "http://fhir.de/NamingSystem/gkv/kvid-10") {
                identifier.push({ value: i.value, label: "GKV" });
            }
        }
    });

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
        | MR.V1_0_0.Profile.PractitionerPractitionerspeciality[]
        | undefined,
    conceptMaps: ParserUtil.ConceptMap[],
    valueSets: ParserUtil.ValueSet[]
): string {
    if (!qualification) return "-";

    return (qualification as { code: Util.FHIR.CodeEmpty }[])
        .map((q) => {
            const codings = q.code?.coding;
            if (!codings || !codings.length) return "-";
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
