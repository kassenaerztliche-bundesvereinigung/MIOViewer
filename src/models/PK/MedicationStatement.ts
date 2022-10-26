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

import { History } from "history";

import { PKA, ST, ParserUtil, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { UI, Util } from "../../components";

export default class MedicationStatementModel extends BaseModel<PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstruction> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstruction,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Medikationseintrag";

        const patientRef = new Reference(value.subject.reference, this.fullUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            this.getMedication(),
            this.getPeriod(),
            ...this.getDosage(),
            ...this.getInformationSource()
        ];

        const note = this.getNote();
        if (note) {
            this.values.push(note);
        }
    }

    protected getMedication(): ModelValue {
        const medicationReference = this.value.medicationReference.reference;
        const ref = new Reference(medicationReference, this.fullUrl);

        let value = "-";
        let onClick = undefined;

        const medication = ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDMedication>(
            this.parent,
            [PKA.V1_0_0.Profile.NFDMedication],
            ref
        )?.resource;

        if (medication) {
            const name = medication.extension?.map((m) => m.valueString).join(", ");
            value = medication.code.coding?.length
                ? Util.FHIR.handleCode(medication.code).join(", ")
                : name ?? "-";
            onClick = Util.Misc.toEntryByRef(this.history, this.parent, ref, true);
        }

        return {
            value,
            label: "Medikament",
            onClick
        };
    }

    protected getPeriod(): ModelValue {
        let value = "-";
        let label = "Zeitraum";

        const period = this.value.effectivePeriod;
        if (period) {
            const start = period.start;
            const end = period.end;

            const s = Util.Misc.formatDate(start, true);
            const e = Util.Misc.formatDate(end, true);

            if (start && !end) {
                value = s;
                label = "Beginn der Einnahme";
            } else {
                value = e;
                label = "Ende der Einnahme";
            }

            if (start && end) {
                value = `${s} bis ${e}`;
                label = "Einnahme im Zeitraum von";
            }
        }
        return { value, label };
    }

    protected getDosage(): ModelValue[] {
        const values: ModelValue[] = [];
        const dosage = this.value.dosage;

        const defaultValue = "-";
        const defautlLabel = "Dosis";

        dosage.map((d) => {
            let value = defaultValue;
            let label = defautlLabel;

            if (
                PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstructionFreitextDosierung.is(
                    d
                )
            ) {
                value = d.text;
                if (d.patientInstruction) {
                    label = d.patientInstruction;
                }
            }

            if (
                PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstructionVierTeiligesSchema.is(
                    d
                )
            ) {
                const rate = [
                    d.doseAndRate
                        ?.map((r) => {
                            const unit = Util.FHIR.handleCodeVS(r.doseQuantity, [
                                ST.V1_0_0.ValueSet.KBVVSSFHIRBMPDOSIEREINHEITValueSet
                            ]);
                            return `${r.doseQuantity.value} ${unit}`;
                        })
                        .join(", ") ?? "",
                    d.patientInstruction
                ].filter((v) => v && v != "");

                value = rate.join(", ");
                label = Util.FHIR.handleCode(d.timing.code, [
                    PKA.V1_0_0.ConceptMap.NFDDosagePointOfTimeGerman
                ]).join(", ");
            }

            if (
                PKA.V1_0_0.Profile.NFDMedicationStatementAdministrationInstructionFehlendeAngabe.is(
                    d
                ) &&
                d.extension?.length
            ) {
                value = "Keine Angabe";
            }

            values.push({ value, label });
        });

        if (!values.length) {
            values.push({ value: defaultValue, label: defautlLabel });
        }
        return values;
    }

    protected getInformationSource(): ModelValue[] {
        const values: ModelValue[] = [];
        const ref = this.value.informationSource?.reference;

        values.push(
            ...Util.PK.handlePractitionerRoleWithOrganization(
                this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                ref,
                this.fullUrl,
                this.history,
                "Informationsquelle",
                "Informationsquelle"
            )
        );

        return values;
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const period = this.getPeriod().value;
        let renderAs = undefined;
        if (!period || period === "-") {
            renderAs = UI.ListItem.NoLabel;
        }
        return {
            value: this.getMedication().value,
            label: this.getPeriod().value,
            renderAs
        };
    }
}
