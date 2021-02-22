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
import { History } from "history";

import {
    ParserUtil,
    KBVBundleResource,
    KBVResource,
    MIOEntry,
    Vaccination,
    ZAEB,
    MR
} from "@kbv/mioparser";

import { UI } from "../index";

import * as IM from "./IM";
import * as ZB from "./ZB";
import * as MP from "./MP";

type patientType =
    | Vaccination.V1_00_000.Profile.Patient
    | ZAEB.V1_00_000.Profile.Patient
    | MR.V1_00_000.Profile.PatientMother;

export function checkIfVaccinationPatient(
    patient: patientType
): patient is Vaccination.V1_00_000.Profile.Patient {
    return !!(patient as Vaccination.V1_00_000.Profile.Patient);
}

export function checkIfZAEBPatient(
    patient: patientType
): patient is ZAEB.V1_00_000.Profile.Patient {
    return !!(patient as ZAEB.V1_00_000.Profile.Patient);
}

export function checkIfMRPatient(
    patient: patientType
): patient is MR.V1_00_000.Profile.PatientMother {
    return !!(patient as MR.V1_00_000.Profile.PatientMother);
}

export function getPatientName(patient: patientType): string {
    if (checkIfVaccinationPatient(patient)) return IM.getPatientName(patient);
    else if (checkIfZAEBPatient(patient)) return ZB.getPatientName(patient);
    else if (checkIfMRPatient(patient)) return MP.getPatientMotherName(patient);
    else return "";
}

export function formatDate(date: string | undefined, time = false): string {
    try {
        return date
            ? moment(new Date(date).toISOString()).format("DD.MM.YYYY") +
                  (time ? moment(new Date(date).toISOString()).format(" - HH:mm") : "")
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
    sub = false
): (() => void) | undefined {
    if (history && resourceRef) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        const ref = ParserUtil.getUuid(resourceRef);
        return () => history.push(`${sub ? "/subEntry/" : "/entry/"}${mioRef}/${ref}`);
    }

    return undefined;
}

export function getTelecom(
    entry:
        | Vaccination.V1_00_000.Profile.Practitioner
        | Vaccination.V1_00_000.Profile.PractitionerAddendum
        | Vaccination.V1_00_000.Profile.Organization
        | ZAEB.V1_00_000.Profile.Organization
        | MR.V1_00_000.Profile.Organization
        | MR.V1_00_000.Profile.Practitioner
): UI.ListItemProps[] {
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

        const mapValue = (t: { value: string; system: string }): string => {
            switch (t.system) {
                case "phone":
                    return `<a href='tel:${t.value}' target='_blank' rel='noopener noreferrer'>${t.value}</a>`;
                case "email":
                    return `<a href='mailto:${t.value}' target='_blank' rel='noopener noreferrer'>${t.value}</a>`;
                case "url": {
                    let prefix = "";
                    if (
                        !t.value.startsWith("https://") ||
                        !t.value.startsWith("http://") ||
                        !t.value.startsWith("www.")
                    ) {
                        prefix = "//";
                    }
                    return `<a href='${
                        prefix + t.value
                    }' target='_blank' rel='noopener noreferrer'>${t.value}</a>`;
                }
                case "sms":
                    return `<a href='tel:${t.value}' target='_blank' rel='noopener noreferrer'>${t.value}</a>`;
                default:
                    return t.value;
            }
        };

        const results: UI.ListItemProps[] = [];
        entry.telecom.forEach((t) => {
            results.push({
                value: mapValue(t),
                label: mapLabel(t.system)
            });
        });
        return results;
    } else {
        return [];
    }
}

export function mapIdentifier(identifier: UI.ListItemProps): UI.ListItemProps {
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
        | Vaccination.V1_00_000.Profile.Patient
        | ZAEB.V1_00_000.Profile.Patient
        | MR.V1_00_000.Profile.PatientMother
): UI.ListItemProps[] {
    const identifier: UI.ListItemProps[] = [];

    patient.identifier.forEach((i) => {
        const coding = i.type?.coding;
        if (coding) {
            const codingString = (coding as { code: string }[])
                .map((c) => c.code)
                .join(", ");
            identifier.push({ value: i.value, label: codingString });
        } else {
            if (i.system === "http://fhir.de/NamingSystem/gkv/kvid-10") {
                identifier.push({ value: i.value, label: "GKV" });
            }
        }
    });

    return identifier.map((i) => mapIdentifier(i));
}
