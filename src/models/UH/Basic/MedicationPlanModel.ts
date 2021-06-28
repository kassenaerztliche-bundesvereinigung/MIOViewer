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

import { History } from "history";

import { CMR, ParserUtil } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type MedicationPlanType = CMR.V1_0_0.Profile.CMRMedicationStatementVitamineKProphylaxis;

export default class MedicationPlan extends BaseModel<MedicationPlanType> {
    constructor(
        value: MedicationPlanType,
        fullUrl: string,
        parent: CMR.V1_0_0.Profile.CMRBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.getCoding();

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.context.reference;

        this.values.push(
            Util.UH.getPatientModelValue(patientRef, parent, history),
            Util.UH.getEncounterModelValue(encounterRef, parent, history),
            {
                value: ParserUtil.translateCode(
                    this.value.status,
                    CMR.V1_0_0.ConceptMap.CMRMedicationStatementStatusGerman
                ).join(", "),
                label: "Status"
            },
            {
                value: Util.Misc.formatDate(this.value.effectiveDateTime, true),
                label: "Durchgeführt am"
            },
            ...this.getDosage()
        );
    }

    public getDosage(): ModelValue[] {
        const dosage = this.value.dosage;

        const results: ModelValue[] = [];

        dosage.forEach((d) => {
            const routes = d.route?.coding.map((c) => c.code) ?? [];
            if (routes.length && routes.includes("26643006")) {
                results.push({
                    value: "oral",
                    label: "Applikationsweg"
                });
            }

            const dose = d.doseAndRate;
            dose?.forEach(
                (doseEntity: {
                    doseQuantity: { value: string | number; unit: string };
                }) => {
                    const quantity = doseEntity.doseQuantity;
                    results.push({
                        value: quantity.value + " " + quantity.unit,
                        label: "Dosis"
                    });
                }
            );

            if (d.text) {
                results.push({
                    value: d.text,
                    label: "Dosis"
                });
            }
        });

        return results;
    }

    public getCoding(): string {
        return Util.FHIR.getCoding({ code: this.value.medicationCodeableConcept });
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: Util.Misc.formatDate(this.value.effectiveDateTime, true),
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, this.fullUrl)
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
