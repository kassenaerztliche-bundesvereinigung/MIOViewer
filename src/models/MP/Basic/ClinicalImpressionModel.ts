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

import { ParserUtil, MR } from "@kbv/mioparser";
import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";

import { getCoding } from "../Util";
import * as Models from "../../index";
import { ModelValue } from "../../index";

export type ClinicalImpressionType =
    | MR.V1_0_0.Profile.ClinicalImpressionInitialExamination
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
    | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
    | MR.V1_0_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirth
    | MR.V1_0_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth
    | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationChildInformation;

export default class ClinicalImpressionModel extends MPBaseModel<ClinicalImpressionType> {
    constructor(
        value: ClinicalImpressionType,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History,
        protected valueConceptMap: ParserUtil.ConceptMap[] | undefined = undefined,
        protected codeConceptMap: ParserUtil.ConceptMap[] | undefined = undefined,
        customHeadline?: string
    ) {
        super(value, fullUrl, parent, history);

        this.headline =
            customHeadline ?? Util.Misc.formatDate(this.value.effectiveDateTime);

        if (MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry.is(this.value)) {
            this.headline = this.getMainValue().value;
        } else {
            this.noHeadline = !customHeadline;
        }

        const subjectRef = this.value.subject.reference;
        const patient = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientMother>(
            this.parent,
            [MR.V1_0_0.Profile.PatientMother],
            subjectRef
        );

        const assessorRef = this.value.assessor?.reference;
        let assessorName = "-";
        let toAssessorEntry = undefined;
        if (assessorRef) {
            // There is only one (0..1)
            const assessor = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.Practitioner>(
                this.parent,
                [MR.V1_0_0.Profile.Practitioner],
                assessorRef
            );

            toAssessorEntry = Util.Misc.toEntry(history, parent, assessor, true);
            assessorName = Util.MP.getPractitionerName(assessor?.resource);
        }

        const encounterRef = this.value.encounter.reference;
        const encounter = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.EncounterGeneral>(
            this.parent,
            [MR.V1_0_0.Profile.EncounterGeneral],
            encounterRef
        );
        const toEncounterEntry = Util.Misc.toEntry(history, parent, encounter, true);

        this.values = [];

        this.values.push(
            {
                value: patient ? Util.MP.getPatientMotherName(patient.resource) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, subjectRef, true)
            },
            {
                value: encounter
                    ? Util.Misc.formatDate(encounter.resource.period.start)
                    : "-",
                label: "Untersuchungsdatum",
                onClick: toEncounterEntry
            },
            {
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: "Dokumentiert am"
            },
            {
                value: assessorName,
                label: "Dokumentiert durch",
                onClick: toAssessorEntry
            },
            {
                value: Util.MP.getPregnancyWeekValue(this.value).value,
                label: "Schwangerschaftswoche"
            }
        );

        const note = this.getNote();

        if (
            MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation.is(
                value
            ) ||
            MR.V1_0_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirth.is(
                value
            ) ||
            MR.V1_0_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth.is(value)
        ) {
            if (note) {
                this.values.push({
                    value: note.value,
                    label: "Besonderheiten"
                });
            }
        } else {
            if (note) this.values.push(note);
        }

        if (
            MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation.is(
                value
            )
        ) {
            const investigation = new Models.MP.Basic.ClinicalImpressionInvestigationModel(
                value,
                fullUrl,
                parent,
                history
            );

            this.values.push(...investigation.getInvestigations());
        }
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }): string {
        if (!resource) resource = this.value;
        return getCoding(resource, this.codeConceptMap);
    }

    public getMainValue(): ModelValue {
        if (MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry.is(this.value)) {
            const identifier =
                this.value.identifier && this.value.identifier.length
                    ? this.value.identifier
                          .map((i) => i.extension?.map((e) => e.valueString))
                          .join(", ") + ". "
                    : "";

            return {
                value: identifier + "Gravidogrammeintrag",
                label: Util.Misc.formatDate(this.value.effectiveDateTime),
                onClick: Util.Misc.toEntryByRef(
                    this.history,
                    this.parent,
                    this.value.id,
                    true
                )
            };
        } else {
            return {
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: this.getCoding(),
                onClick: Util.Misc.toEntryByRef(
                    this.history,
                    this.parent,
                    this.value.id,
                    true
                )
            };
        }
    }
}
