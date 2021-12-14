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

import { ParserUtil, CMR } from "@kbv/mioparser";
import { UI, Util } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";
import * as Models from "../../index";
import OrganizationModel from "./OrganizationModel";
import { AdditionalCommentModel, AddressModel, TelecomModel } from "../../index";

export type ProcedureType =
    | CMR.V1_0_1.Profile.CMRProcedureConsultationAnnotation
    | CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreening
    | CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreening
    | CMR.V1_0_1.Profile.CMRProcedureU2Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU3Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU4Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU5Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU6Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU7aConsultation
    | CMR.V1_0_1.Profile.CMRProcedureU7Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU8Consultation
    | CMR.V1_0_1.Profile.CMRProcedureU9Consultation;

export default class ProcedureModel extends BaseModel<ProcedureType> {
    private absent: boolean;

    constructor(
        value: ProcedureType,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.CMRBundle,
        history?: History,
        codeConceptMaps?: ParserUtil.ConceptMap[]
    ) {
        super(value, fullUrl, parent, history, codeConceptMaps);

        if (
            CMR.V1_0_1.Profile.CMRProcedureU2Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU3Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU4Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU5Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU6Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU7aConsultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU7Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU8Consultation.is(value) ||
            CMR.V1_0_1.Profile.CMRProcedureU9Consultation.is(value)
        ) {
            this.headline = "Beratung";
            this.values.push({
                value: this.getCoding(this.value, "\n"),
                label: "Beratungsgegenstand",
                renderAs: UI.ListItem.Bullet
            });
        } else {
            this.headline = this.getCoding();
        }

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.encounter.reference;
        const asserterRef = this.value.asserter?.reference;

        this.absent = this.value.status === "not-done";

        if (this.absent) {
            this.values.push({
                value: "Nicht durchgeführt",
                label: "Status der Untersuchung"
            });
            this.values.push({
                value: this.getStatusReason(),
                label: "Grund"
            });
        }

        this.values.push(
            Util.UH.getPatientModelValue(patientRef, parent, history),
            Util.UH.getEncounterModelValue(encounterRef, parent, history),
            {
                value: Util.Misc.formatDate(this.value.performedDateTime),
                label: "Durchgeführt am"
            },
            ...Util.UH.getPerformerModelValues([asserterRef ?? ""], parent, history).map(
                (v) => {
                    v.subModels = [
                        OrganizationModel,
                        AddressModel,
                        TelecomModel,
                        AdditionalCommentModel
                    ];
                    return v;
                }
            )
        );

        const partOf = this.getPartOf();
        if (partOf) {
            this.values.push(...partOf);
        }

        const laboratory = this.getScreeningLaboratory();
        if (laboratory) {
            this.values.push(laboratory);
        }

        const extension = this.getExtension();
        if (extension) {
            this.values.push(extension);
        }

        const note = this.getNote();
        if (note) this.values.push(note);
    }

    protected getStatusReason(): string {
        let result = "-";

        if (
            (CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreening.is(
                this.value
            ) ||
                CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreening.is(
                    this.value
                )) &&
            this.value.statusReason
        ) {
            this.value.statusReason.coding.forEach(
                // eslint-disable-next-line
                (c: { _display?: { extension?: any[] } }) => {
                    const slices = ParserUtil.getSlices<
                        | CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreeningStatusReasonCodingDisplayAnzeigenameStatusReasonSnomed
                        | CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreeningStatusReasonCodingDisplayAnzeigenameStatusReasonSnomed
                    >(
                        [
                            CMR.V1_0_1.Profile
                                .CMRProcedureU1U3NewbornBloodSpotScreeningStatusReasonCodingDisplayAnzeigenameStatusReasonSnomed,
                            CMR.V1_0_1.Profile
                                .CMRProcedureU1U3CysticFibrosisScreeningStatusReasonCodingDisplayAnzeigenameStatusReasonSnomed
                        ],
                        c._display?.extension
                    );
                    if (slices) {
                        slices.forEach((slice) =>
                            slice.extension?.forEach((e) => {
                                result = e.valueString ?? "-";
                            })
                        );
                    }
                }
            );
        }

        return result;
    }

    protected getScreeningLaboratory(): ModelValue | undefined {
        let slice = undefined;
        if (CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreening.is(this.value)) {
            slice =
                ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreeningScreeninglabor>(
                    CMR.V1_0_1.Profile
                        .CMRProcedureU1U3CysticFibrosisScreeningScreeninglabor,
                    this.value.extension
                );
        } else if (
            CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreening.is(this.value)
        ) {
            slice =
                ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreeningScreeninglabor>(
                    CMR.V1_0_1.Profile
                        .CMRProcedureU1U3NewbornBloodSpotScreeningScreeninglabor,
                    this.value.extension
                );
        }

        if (slice) {
            let subEntry = undefined;
            if (slice.valueReference.reference) {
                subEntry =
                    ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory>(
                        this.parent,
                        [CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory],
                        slice.valueReference.reference
                    );
            }

            return {
                value: slice.valueReference.display,
                label: "Untersuchendes Labor",
                onClick: Util.Misc.toEntryByRef(
                    this.history,
                    this.parent,
                    slice.valueReference.reference,
                    true
                ),
                subEntry: subEntry,
                subModels: [
                    Models.UH.Basic.OrganizationModel,
                    Models.AddressModel,
                    Models.ContactModel
                ]
            };
        }
    }

    protected getPartOf(): ModelValue[] {
        if (CMR.V1_0_1.Profile.CMRProcedureU1U3CysticFibrosisScreening.is(this.value)) {
            const renderAs = UI.ListItem.MultilineLabel;

            type Part = { reference: string; display?: string };
            const label = "Teil von";

            const partOf = this.value.partOf?.filter(
                (p) => p.reference || p.display
            ) as Part[];
            const parts = partOf?.map((p) => {
                return { reference: p.reference, display: p.display };
            });

            if (parts && parts.length) {
                return parts.map((part) => {
                    const procedure =
                        ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreening>(
                            this.parent,
                            [
                                CMR.V1_0_1.Profile
                                    .CMRProcedureU1U3NewbornBloodSpotScreening
                            ],
                            part.reference
                        )?.resource;

                    if (procedure) {
                        const codes = Util.FHIR.handleCode(
                            procedure.code,
                            this.codeConceptMaps
                        );

                        return {
                            value: codes.join(", "),
                            label: part.display ?? label,
                            onClick: Util.Misc.toEntryByRef(
                                this.history,
                                this.parent,
                                part.reference,
                                true
                            ),
                            renderAs
                        };
                    } else {
                        return {
                            value: "-",
                            label: part.display ?? label,
                            renderAs
                        };
                    }
                });
            } else {
                return [{ value: "-", label, renderAs }];
            }
        }

        return [];
    }

    protected getExtension(): ModelValue | undefined {
        if (CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreening.is(this.value)) {
            const slice =
                ParserUtil.getSlice<CMR.V1_0_1.Profile.CMRProcedureU1U3NewbornBloodSpotScreeningErstabnahmeVorVollendeter36Lebensstunde>(
                    CMR.V1_0_1.Profile
                        .CMRProcedureU1U3NewbornBloodSpotScreeningErstabnahmeVorVollendeter36Lebensstunde,
                    this.value.extension
                );
            if (!slice) return;

            return {
                value: "Erstabnahme vor der vollendeten 36. Lebensstunde bei einer Entbindung vor der vollendeten 32. Schwangerschaftswoche",
                label: "Hinweis"
            };
        }
    }

    public getNote(): ModelValue | undefined {
        if (CMR.V1_0_1.Profile.CMRProcedureConsultationAnnotation.is(this.value)) {
            return {
                value: this.value.note.map((note) => note.text).join(", "),
                label: this.getCoding()
            };
        }
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }, separator?: string): string {
        if (!resource) resource = this.value;
        return Util.FHIR.getCoding(resource, this.codeConceptMaps, separator);
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: this.absent
                ? "Nicht durchgeführt"
                : Util.Misc.formatDate(this.value.performedDateTime),
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, this.fullUrl),
            sortBy: this.value.performedDateTime
                ? new Date(this.value.performedDateTime).getTime().toString()
                : undefined
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
