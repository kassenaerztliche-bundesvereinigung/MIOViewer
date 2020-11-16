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

import { Vaccination, ZAEB } from "@kbv/mioparser";

import * as Util from "../Util";

import DetailList from "../UI/DetailList";

class PatientDetailList extends DetailList<
    Vaccination.V1_00_000.Profile.Patient | ZAEB.V1_00_000.Profile.Patient
> {
    getHeadline(): string {
        return "Patientendaten";
    }

    getContentParts(): Readonly<{ label: string; value: string }>[] {
        const parts = [
            {
                value: Util.getPatientName(this.getDetailEntry()),
                label: "Name"
            }
        ];

        if (Util.checkIfVaccinationPatient(this.getDetailEntry())) {
            parts.push({
                value: Util.formatDate(this.getDetailEntry().birthDate),
                label: "Geburtsdatum"
            });
        }

        Util.getPatientIdentifier(this.getDetailEntry()).forEach((identifier) => {
            parts.push(identifier);
        });

        return parts;
    }
}

export default PatientDetailList;
