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

import { ParserUtil, CMR, Reference } from "@kbv/mioparser";
import { Util } from "../../../components";

import BaseModel from "./CMRBaseModel";

import ObservationModel from "./ObservationModel";
import { ModelValue } from "../../Types";
import OrganizationModel from "./OrganizationModel";
import { AdditionalCommentModel, AddressModel, TelecomModel } from "../../Comprehensive";

type DiagnosticReportType =
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU3U4HipScreening
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU1U5NeonatalHearscreening
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU1U5PediatricDiagnosticAudiologyService
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU1U3PulseOxymetry
    | CMR.V1_0_1.Profile.CMRDiagnosticReportPercentileValues
    // U2
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2PhysicalExamSkin
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U4PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U3PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U6PhysicalExamHeartBloodCirculation
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U3PhysicalExamEars
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U3PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU2U6BodyMeasures
    // U3
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU3PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU3PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU3U4PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU3U4PhysicalExamSkin
    // U4
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU4PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU4PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU4PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU4U5PhysicalExamEyes
    // U5
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5U6PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5U6PhysicalExamHead
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU5U9PhysicalExamSkin
    // U6
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU6PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU6PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU6PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU6U7PhysicalExamChestLungRespiratoryTract
    // U7
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7aandU9PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7aandU9PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7aPhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7aU9PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7PhysicalExamEyes
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7PhysicalExamMouthNose
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7U7aPhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7U9BodyMeasures
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU7U9PhysicalExamHeartBloodCirculation
    // U8
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU8PhysicalExamAbdomenGenitals
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU8PhysicalExamChestLungRespiratoryTract
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU8PhysicalExamEars
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU8PhysicalExamMusculoskeletalSystem
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU8U9PhysicalExamMouthNose
    // U9
    | CMR.V1_0_1.Profile.CMRDiagnosticReportU9PhysicalExamAbdomenGenitals;

export default class DiagnosticReportModel extends BaseModel<DiagnosticReportType> {
    constructor(
        value: DiagnosticReportType,
        fullUrl: string,
        parent: CMR.V1_0_1.Profile.CMRBundle,
        history?: History,
        codeConceptMaps?: ParserUtil.ConceptMap[],
        valueConceptMaps?: ParserUtil.ConceptMap[]
    ) {
        super(value, fullUrl, parent, history, codeConceptMaps, valueConceptMaps);

        this.headline = this.getCoding();

        const patientRef = this.value.subject.reference;
        const encounterRef = this.value.encounter.reference;
        const performerRefs: string[] =
            this.value.performer?.map((performer) => performer.reference) ?? [];

        this.values = [
            ...this.getResults(),
            Util.UH.getPatientModelValue(
                new Reference(patientRef, this.fullUrl),
                parent,
                history
            ),
            Util.UH.getEncounterModelValue(
                new Reference(encounterRef, this.fullUrl),
                parent,
                history
            ),
            {
                value: Util.Misc.formatDate(this.value.effectiveDateTime),
                label: "Durchgeführt am"
            },
            ...Util.UH.getPerformerModelValues(
                performerRefs.map((r) => new Reference(r, this.fullUrl)),
                parent,
                history
            ).map((v) => {
                v.subModels = [
                    OrganizationModel,
                    AddressModel,
                    TelecomModel,
                    AdditionalCommentModel
                ];
                return v;
            })
        ];
    }

    protected getResults(): ModelValue[] {
        const values: ModelValue[] = [];

        this.value.result?.map((result: { reference: string }) => {
            const ref = result.reference;
            const PR = CMR.V1_0_1.Profile;
            const entry = ParserUtil.getEntryWithRef<
                | CMR.V1_0_1.Profile.CMRObservationPercentileValues
                // U1
                | CMR.V1_0_1.Profile.CMRObservationHeadCircumference
                | CMR.V1_0_1.Profile.CMRObservationU1EdemaOfNewborn
                | CMR.V1_0_1.Profile.CMRObservationU1NeonatalJaundice
                | CMR.V1_0_1.Profile.CMRObservationU1BirthTraumaOfFetus
                | CMR.V1_0_1.Profile.CMRObservationU1CongenitalMalformation
                | CMR.V1_0_1.Profile.CMRObservationU1TermInfant
                | CMR.V1_0_1.Profile.CMRObservationU1ApgarScore
                | CMR.V1_0_1.Profile.CMRObservationU1BirthLength
                | CMR.V1_0_1.Profile.CMRObservationU1BirthWeight
                | CMR.V1_0_1.Profile.CMRObservationU1U3PulseOxymetryMeasurement
                | CMR.V1_0_1.Profile.CMRObservationU1U5NeonatalHearscreening
                | CMR.V1_0_1.Profile.CMRObservationU1U5CounselingAboutHearscreening
                | CMR.V1_0_1.Profile.CMRObservationU1U5PediatricDiagnosticAudiologyService
                // U2
                | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamSkin
                | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamHead
                | CMR.V1_0_1.Profile.CMRObservationU2PhysicalExamMouthNose
                | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamAbdomenGenitals
                | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamEars
                | CMR.V1_0_1.Profile.CMRObservationU2U3PhysicalExamEyes
                | CMR.V1_0_1.Profile.CMRObservationU2U4PhysicalExamChestLungRespiratoryTract
                | CMR.V1_0_1.Profile.CMRObservationU2U6PhysicalExamHeartBloodCirculation
                | CMR.V1_0_1.Profile.CMRObservationU2U6BodyWeight
                | CMR.V1_0_1.Profile.CMRObservationU2U9BodyHeightMeasure
                // U3
                | CMR.V1_0_1.Profile.CMRObservationU3U4PhysicalExamSkin
                | CMR.V1_0_1.Profile.CMRObservationU3PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU3PhysicalExamHead
                | CMR.V1_0_1.Profile.CMRObservationU3U4HipScreeningResult
                | CMR.V1_0_1.Profile.CMRObservationU3U4PhysicalExamMouthNose
                // U4
                | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamAbdomenGenitals
                | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU4PhysicalExamHead
                | CMR.V1_0_1.Profile.CMRObservationU4U5PhysicalExamEyes
                // U5
                | CMR.V1_0_1.Profile.CMRObservationU5U9PhysicalExamSkin
                | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamChestLungRespiratoryTract
                | CMR.V1_0_1.Profile.CMRObservationU5U6PhysicalExamAbdomenGenitals
                | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU5U6PhysicalExamHead
                | CMR.V1_0_1.Profile.CMRObservationU5PhysicalExamMouthNose
                // U6
                | CMR.V1_0_1.Profile.CMRObservationU6U7PhysicalExamChestLungRespiratoryTract
                | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamMouthNose
                | CMR.V1_0_1.Profile.CMRObservationU6PhysicalExamEyes
                // U7
                | CMR.V1_0_1.Profile.CMRObservationU7U7aPhysicalExamAbdomenGenitals
                | CMR.V1_0_1.Profile.CMRObservationU7U9PhysicalExamHeartBloodCirculation
                | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamMouthNose
                | CMR.V1_0_1.Profile.CMRObservationU7PhysicalExamEyes
                | CMR.V1_0_1.Profile.CMRObservationU7U9BMI
                | CMR.V1_0_1.Profile.CMRObservationU7U9BodyWeight
                // U7a
                | CMR.V1_0_1.Profile.CMRObservationU7aandU9PhysicalExamChestLungRespiratoryTract
                | CMR.V1_0_1.Profile.CMRObservationU7aandU9PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU7aPhysicalExamMouthNose
                | CMR.V1_0_1.Profile.CMRObservationU7aU9PhysicalExamEyes
                // U8
                | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamChestLungRespiratoryTract
                | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamAbdomenGenitals
                | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamEars
                | CMR.V1_0_1.Profile.CMRObservationU8PhysicalExamMusculoskeletalSystem
                | CMR.V1_0_1.Profile.CMRObservationU8U9PhysicalExamMouthNose
                // U9
                | CMR.V1_0_1.Profile.CMRObservationU9PhysicalExamAbdomenGenitals
            >(
                this.parent,
                [
                    PR.CMRObservationPercentileValues,
                    // U1
                    PR.CMRObservationHeadCircumference,
                    PR.CMRObservationU1EdemaOfNewborn,
                    PR.CMRObservationU1NeonatalJaundice,
                    PR.CMRObservationU1BirthTraumaOfFetus,
                    PR.CMRObservationU1CongenitalMalformation,
                    PR.CMRObservationU1TermInfant,
                    PR.CMRObservationU1ApgarScore,
                    PR.CMRObservationU1BirthLength,
                    PR.CMRObservationU1BirthWeight,
                    PR.CMRObservationU1U3PulseOxymetryMeasurement,
                    PR.CMRObservationU1U5NeonatalHearscreening,
                    PR.CMRObservationU1U5CounselingAboutHearscreening,
                    PR.CMRObservationU1U5PediatricDiagnosticAudiologyService,
                    // U2
                    PR.CMRObservationU2PhysicalExamSkin,
                    PR.CMRObservationU2PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU2PhysicalExamHead,
                    PR.CMRObservationU2PhysicalExamMouthNose,
                    PR.CMRObservationU2U3PhysicalExamAbdomenGenitals,
                    PR.CMRObservationU2U3PhysicalExamEars,
                    PR.CMRObservationU2U3PhysicalExamEyes,
                    PR.CMRObservationU2U4PhysicalExamChestLungRespiratoryTract,
                    PR.CMRObservationU2U6PhysicalExamHeartBloodCirculation,
                    PR.CMRObservationU2U6BodyWeight,
                    PR.CMRObservationU2U9BodyHeightMeasure,
                    // U3
                    PR.CMRObservationU3U4PhysicalExamSkin,
                    PR.CMRObservationU3PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU3PhysicalExamHead,
                    PR.CMRObservationU3U4HipScreeningResult,
                    PR.CMRObservationU3U4PhysicalExamMouthNose,
                    // U4
                    PR.CMRObservationU4PhysicalExamAbdomenGenitals,
                    PR.CMRObservationU4PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU4PhysicalExamHead,
                    PR.CMRObservationU4U5PhysicalExamEyes,
                    // U5
                    PR.CMRObservationU5U9PhysicalExamSkin,
                    PR.CMRObservationU5PhysicalExamChestLungRespiratoryTract,
                    PR.CMRObservationU5U6PhysicalExamAbdomenGenitals,
                    PR.CMRObservationU5PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU5U6PhysicalExamHead,
                    PR.CMRObservationU5PhysicalExamMouthNose,
                    // U6
                    PR.CMRObservationU6U7PhysicalExamChestLungRespiratoryTract,
                    PR.CMRObservationU6PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU6PhysicalExamMouthNose,
                    PR.CMRObservationU6PhysicalExamEyes,
                    // U7
                    PR.CMRObservationU7U7aPhysicalExamAbdomenGenitals,
                    PR.CMRObservationU7U9PhysicalExamHeartBloodCirculation,
                    PR.CMRObservationU7PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU7PhysicalExamMouthNose,
                    PR.CMRObservationU7PhysicalExamEyes,
                    PR.CMRObservationU7U9BMI,
                    PR.CMRObservationU7U9BodyWeight,
                    // U7a
                    PR.CMRObservationU7aandU9PhysicalExamChestLungRespiratoryTract,
                    PR.CMRObservationU7aandU9PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU7aPhysicalExamMouthNose,
                    PR.CMRObservationU7aU9PhysicalExamEyes,
                    // U8
                    PR.CMRObservationU8PhysicalExamChestLungRespiratoryTract,
                    PR.CMRObservationU8PhysicalExamAbdomenGenitals,
                    PR.CMRObservationU8PhysicalExamEars,
                    PR.CMRObservationU8PhysicalExamMusculoskeletalSystem,
                    PR.CMRObservationU8U9PhysicalExamMouthNose,
                    // U9
                    PR.CMRObservationU9PhysicalExamAbdomenGenitals
                ],
                new Reference(ref, this.fullUrl)
            );

            if (entry) {
                const model = new ObservationModel(
                    entry.resource,
                    entry.fullUrl,
                    this.parent as CMR.V1_0_1.Profile.CMRBundle,
                    this.history,
                    this.codeConceptMaps,
                    this.valueConceptMaps
                );

                values.push(model.getMainValue());
            }
        });

        return values;
    }

    public getCoding(resource?: { code?: Util.FHIR.Code }): string {
        if (!resource) resource = this.value;
        return Util.FHIR.getCoding(resource /*, this.codeConceptMap*/);
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(), // .replace(/:$/, ""),
            label: Util.Misc.formatDate(this.value.effectiveDateTime),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl)
            ),
            sortBy: new Date(this.value.effectiveDateTime).getTime().toString()
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }
}
