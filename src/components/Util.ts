/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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
    ZAEB
} from "@kbv/mioparser";
import { UI } from "./index";
import { DetailListContentPart } from "./UI";
import * as IM from "./IM";
import * as ZB from "./ZB";

type patientType = Vaccination.V1_00_000.Profile.Patient | ZAEB.V1_00_000.Profile.Patient;

export function checkIfVaccinationPatient(
    patient: patientType
): patient is Vaccination.V1_00_000.Profile.Patient {
    if (patient as Vaccination.V1_00_000.Profile.Patient) return true;
    else return false;
}

export function checkIfZAEBPatient(
    patient: patientType
): patient is ZAEB.V1_00_000.Profile.Patient {
    if (patient as ZAEB.V1_00_000.Profile.Patient) return true;
    else return false;
}

export function getPatientName(patient: patientType): string {
    if (checkIfVaccinationPatient(patient)) return IM.Util.getPatientName(patient);
    else if (checkIfZAEBPatient(patient)) return ZB.Util.getPatientName(patient);
    else return "";
}

/**
 *
 * @param date
 */
export function formatDate(date: string | undefined, time = false): string {
    return date
        ? moment(new Date(date).toISOString()).format("DD.MM.YYYY") +
              (time ? moment(new Date(date).toISOString()).format(" - HH:mm:ss") : "")
        : "-";
}

export function toEntry(
    history: History | undefined,
    mio: KBVBundleResource,
    entry: MIOEntry<KBVResource> | undefined,
    sub = false
): (() => void) | undefined {
    if (history && entry) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        const resourceRef = ParserUtil.getUuidFromEntry(entry);
        return () =>
            history.push(`${sub ? "/subEntry/" : "/entry/"}${mioRef}/${resourceRef}`);
    }

    return undefined;
}

export function toEntryByRef(
    history: History | undefined,
    mio: KBVBundleResource,
    resourceRef: string | undefined
): (() => void) | undefined {
    if (history && resourceRef) {
        const mioRef = ParserUtil.getUuidFromBundle(mio);
        return () => history.push(`/entry/${mioRef}/${resourceRef}`);
    }

    return undefined;
}

export function getTelecom(
    entry:
        | Vaccination.V1_00_000.Profile.Practitioner
        | Vaccination.V1_00_000.Profile.PractitionerAddendum
        | Vaccination.V1_00_000.Profile.Organization
        | ZAEB.V1_00_000.Profile.Organization
): UI.DetailListContentPart[] {
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
        return entry.telecom.map((t) => {
            return {
                value: t.value,
                label: mapLabel(t.system)
            };
        });
    } else {
        return [];
    }
}

export function mapIdentifier(identifier: {
    value: string;
    name: string;
}): UI.DetailListContentPart {
    const name = identifier.name;
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
    patient: Vaccination.V1_00_000.Profile.Patient | ZAEB.V1_00_000.Profile.Patient
): DetailListContentPart[] {
    const identifier: {
        value: string;
        name: string;
    }[] = [];

    patient.identifier.forEach((i) => {
        const coding = i.type?.coding;
        if (coding) {
            const codingString = (coding as { code: string }[])
                .map((c) => c.code)
                .join(", ");
            identifier.push({ name: codingString, value: i.value });
        } else {
            if (i.system === "http://fhir.de/NamingSystem/gkv/kvid-10") {
                identifier.push({ name: "GKV", value: i.value });
            }
        }
    });

    return identifier.map((i) => mapIdentifier(i));
}
