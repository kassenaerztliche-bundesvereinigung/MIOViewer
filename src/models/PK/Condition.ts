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

import { PKA, ST, Reference, ParserUtil } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

export default class ConditionModel extends BaseModel<
    | PKA.V1_0_0.Profile.NFDCondition
    | PKA.V1_0_0.Profile.NFDConditionRunawayRisk
    | PKA.V1_0_0.Profile.NFDConditionCommunicationDisorder
> {
    protected compositionUrl?: string;

    constructor(
        value:
            | PKA.V1_0_0.Profile.NFDCondition
            | PKA.V1_0_0.Profile.NFDConditionRunawayRisk
            | PKA.V1_0_0.Profile.NFDConditionCommunicationDisorder,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.getCoding();
        this.compositionUrl = Util.PK.getComposition(parent)?.fullUrl;

        const patientRef = new Reference(value.subject?.reference, this.compositionUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },

            ...this.getAsserter()
        ];

        if (PKA.V1_0_0.Profile.NFDCondition.is(value)) {
            this.values.push(
                this.getVerificationStatus(),
                this.getOnSet(),
                this.getBodySite()
            );
        } else {
            this.values.push(this.getEvidence());
        }
    }

    protected getAsserter(): ModelValue[] {
        const values: ModelValue[] = [];
        const ref = this.value.asserter?.reference;

        values.push(
            ...Util.PK.handlePractitionerRoleWithOrganization(
                this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                ref,
                this.compositionUrl,
                this.history,
                "Diagnostizierende Person",
                "Diagnostizierende Institution"
            )
        );

        return values;
    }

    protected getVerificationStatus(): ModelValue {
        let value = "-";

        if (
            PKA.V1_0_0.Profile.NFDCondition.is(this.value) &&
            this.value.verificationStatus
        ) {
            const results = Util.FHIR.handleCode(this.value.verificationStatus, [
                PKA.V1_0_0.ConceptMap.NFDVerificationStatusGerman
            ]);

            value = results.join(", ");
        }

        return {
            value,
            label: "Diagnosesicherheit"
        };
    }

    protected getOnSet(): ModelValue {
        let value = "-";

        if (PKA.V1_0_0.Profile.NFDCondition.is(this.value)) {
            const date = this.value.onsetDateTime;
            if (date) {
                value = Util.Misc.formatDate(date);
            } else if (this.value.onsetString) {
                value = this.value.onsetString;
            }
        }

        return { value, label: "Erstmals aufgetreten am" };
    }

    protected getBodySite(): ModelValue {
        let value = "-";

        if (PKA.V1_0_0.Profile.NFDCondition.is(this.value)) {
            const bodySite = this.value.bodySite;
            if (bodySite) {
                value = bodySite
                    .map((b) => {
                        const r = b.coding.map((c) => {
                            return Util.FHIR.handleCodeVS(c, [
                                ST.V1_0_0.ValueSet.KBVVSSFHIRICDSEITENLOKALISATIONValueSet
                            ]);
                        });

                        return r.join(", ");
                    })
                    .join(", ");
            }
        }

        return { value, label: "Lokalisation" };
    }

    protected getEvidence(): ModelValue {
        let value = "-";
        let onClick = undefined;

        if (PKA.V1_0_0.Profile.NFDConditionRunawayRisk.is(this.value)) {
            value = this.value.evidence
                .map((e) =>
                    e.code
                        ? e.code
                              .map((c) =>
                                  c.text ? c.text : Util.FHIR.handleCodeVS(c, [])
                              )
                              .join(", ")
                        : "-"
                )
                .join(", ");
        } else if (PKA.V1_0_0.Profile.NFDConditionCommunicationDisorder.is(this.value)) {
            value = this.value.evidence
                .map((e) => {
                    if (e.detail) {
                        // is 0..1
                        const refs = e.detail.map((d) => d.reference);
                        if (refs.length) {
                            const ref = new Reference(refs[0], this.compositionUrl);

                            const condition =
                                ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDCondition>(
                                    this.parent,
                                    [PKA.V1_0_0.Profile.NFDCondition],
                                    ref
                                );

                            if (condition) {
                                onClick = Util.Misc.toEntryByRef(
                                    this.history,
                                    this.parent,
                                    ref,
                                    true
                                );

                                value = Util.FHIR.handleCode(
                                    condition.resource.code,
                                    []
                                ).join(", ");
                            }
                        }
                    } else if (e.code) {
                        const text = e.code.map((c) => c.text).join(", ");
                        if (text) {
                            return text;
                        } else {
                            return Util.FHIR.handleCode({ coding: e.code }).join(", ");
                        } // TODO: CM?
                    }
                })
                .filter((e) => e != undefined)
                .join(", ");
        }

        return {
            value,
            label: "Ursache",
            onClick
        };
    }

    public getCoding(): string {
        return Util.FHIR.handleCode(this.value.code, [
            PKA.V1_0_0.ConceptMap.NFDRunawayRiskGerman
        ]).join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: "Diagnose"
        };
    }
}
