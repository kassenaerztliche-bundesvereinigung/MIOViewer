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

import { PKA, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

const PR = PKA.V1_0_0.Profile;

export type ObservationType =
    | PKA.V1_0_0.Profile.NFDObservationNote
    | PKA.V1_0_0.Profile.NFDObservationPregnancyStatus
    | PKA.V1_0_0.Profile.NFDObservationPregnancyCalculatedDeliveryDate
    | PKA.V1_0_0.Profile.NFDObservationVoluntaryAdditionalInformation;

export default class ObservationModel extends BaseModel<ObservationType> {
    constructor(
        value: ObservationType,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.noHeadline = true;

        const patientRef = new Reference(value.subject.reference, this.fullUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            }
        ];

        const dateTime = this.getDateTime();
        if (dateTime) {
            this.values.push(dateTime);
        }

        this.values.push(...this.getPerformer());

        this.values.push(this.getValueX());
    }

    protected getDateTime(): ModelValue | undefined {
        if (!PR.NFDObservationNote.is(this.value)) {
            return {
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: "Dokumentiert am"
            };
        }
    }

    protected getPerformer(): ModelValue[] {
        const values: ModelValue[] = [];

        if (!PR.NFDObservationVoluntaryAdditionalInformation.is(this.value)) {
            if (this.value.performer?.length) {
                this.value.performer?.forEach((performer) => {
                    values.push(
                        ...Util.PK.handlePractitionerRoleWithOrganization(
                            this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                            performer.reference,
                            this.fullUrl,
                            this.history
                        )
                    );
                });
            } else {
                values.push(
                    ...Util.PK.handlePractitionerRoleWithOrganization(
                        this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                        undefined,
                        this.fullUrl,
                        this.history
                    )
                );
            }
        }

        return values;
    }

    protected getValueX(): ModelValue {
        let value = "-";
        if (PR.NFDObservationNote.is(this.value)) {
            value = this.value.valueString ?? "-";
            if (this.value.valueCodeableConcept) {
                value = Util.FHIR.handleCode(this.value.valueCodeableConcept).join(", ");
            }
        } else if (PR.NFDObservationPregnancyCalculatedDeliveryDate.is(this.value)) {
            value = Util.Misc.formatDate(this.value.valueDateTime);
        } else if (PR.NFDObservationPregnancyStatus.is(this.value)) {
            value = Util.FHIR.handleCode(this.value.valueCodeableConcept, [
                PKA.V1_0_0.ConceptMap.NFDPregnancyStatusGerman
            ]).join(", ");
        } else if (PR.NFDObservationVoluntaryAdditionalInformation.is(this.value)) {
            value = this.value.valueString;
        }

        return {
            value,
            label: this.getCoding() ?? "Wert"
        };
    }

    public getCoding(): string {
        return Util.FHIR.handleCode(this.value.code).join(", ");
    }

    public getMainValue(): ModelValue {
        return this.getValueX();
    }
}
