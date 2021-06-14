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
import { KBVBundleResource, MIOEntry, CMR } from "@kbv/mioparser";
import * as Models from "../../models";
import { DetailMapping } from "../Comprehensive/Detail/Types";

const PR = CMR.V1_00_000.Profile;
const CM = CMR.V1_00_000.ConceptMap;

export default class Mappings {
    static Basic: DetailMapping[] = [
        {
            profile: CMR.V1_00_000.Profile.CMRPatient,
            header: "Patient/-in",
            models: [Models.UH.Basic.PatientModel]
        },
        {
            profile: CMR.V1_00_000.Profile.PCPatient,
            header: "Patient/-in",
            models: [Models.UH.Basic.PatientModel]
        },
        {
            profile: CMR.V1_00_000.Profile.PNPatient,
            header: "Patient/-in",
            models: [Models.UH.Basic.PatientModel]
        },
        {
            profile: CMR.V1_00_000.Profile.CMRPractitioner,
            header: "Behandelnde Person",
            models: [
                Models.UH.Basic.PractitionerModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: CMR.V1_00_000.Profile.PCPractitioner,
            header: "Behandelnde Person",
            models: [
                Models.UH.Basic.PractitionerModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: CMR.V1_00_000.Profile.CMROrganization,
            header: "Details zur Einrichtung",
            models: [
                Models.UH.Basic.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: CMR.V1_00_000.Profile.CMROrganizationScreeningLaboratory,
            header: "Details zur Einrichtung",
            models: [
                Models.UH.Basic.OrganizationModel,
                Models.AddressModel,
                Models.ContactModel
            ]
        },
        {
            profile: CMR.V1_00_000.Profile.PCOrganization,
            header: "Details zur Einrichtung",
            models: [
                Models.UH.Basic.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: CMR.V1_00_000.Profile.CMREncounter,
            header: "Details",
            models: [Models.UH.Basic.EncounterModel]
        },
        {
            profile: CMR.V1_00_000.Profile.PCEncounter,
            header: "Details",
            models: [Models.UH.Basic.EncounterModel]
        },
        {
            profile: CMR.V1_00_000.Profile.PNEncounter,
            header: "Details",
            models: [Models.UH.Basic.EncounterModel]
        }
    ];

    static Observation: DetailMapping[] = [
        {
            profile: PR.CMRObservationU3U4ProblemOfHip,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU3U4HipScreeningResult,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRHipScreeningMethodGerman],
            valueConceptMaps: [CM.CMRGrafHipUltrasoundClassificationGerman]
        },
        {
            profile: PR.CMRObservationU3U4HipScreeningHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRHipHistoryGerman]
        },
        // Percentile Curves
        {
            profile: PR.CMRObservationHeadCircumference,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU7U9BodyWeight,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU7U9BMI,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationPercentileValues,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [
                CM.CMRPercentileBodyMeasureLoincGerman,
                CM.CMRPercentileBodyMeasureSnomedGerman
            ]
        },
        // U1
        {
            profile: PR.CMRObservationU1U3PregnancyHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRPregnancyHistoryGerman]
        },
        {
            profile: PR.CMRObservationU1U3PrenatalFinding,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3GenderBirthHistory,
            models: [Models.UH.Basic.ObservationModel],
            valueConceptMaps: [CM.CMRGenderBirthGerman]
        },
        {
            profile: PR.CMRObservationU1U3BaseExcess,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3pHValue,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3FoetalPosition,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRFoetalPositionGerman]
        },
        {
            profile: PR.CMRObservationU1U3DifferentFoetalPosition,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3Birthmode,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU1U3BirthmodeGerman]
        },
        {
            profile: PR.CMRObservationU1U3DateTimeofBirth,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3LengthGestationAtBirth,
            models: [Models.UH.Basic.ObservationModel],
            noValue: true
        },
        {
            profile: PR.CMRObservationU1FamilyHistory,
            models: [Models.UH.Basic.ObservationModel],
            noValue: true
        },
        {
            profile: PR.CMRObservationU1EdemaofNewborn,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1NeonatalJaundice,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1BirthTraumaOfFetus,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1CongenitalMalformation,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1TermInfant,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1ApgarScore,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU1ApgarScoreIdentifierGerman],
            valueConceptMaps: [CM.CMRU1ApgarScoreValueGerman]
        },
        {
            profile: PR.CMRObservationU1BirthLength,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1BirthWeight,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U3PulseOxymetryMeasurement,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRPulseOxymetryScreeningMeasurementTypeGerman],
            valueConceptMaps: [
                CM.CMRU1U3PulseOxymetryMeasurementGerman,
                CM.CMRPulseOxymetryScreeningDataAbsentReasonGerman
            ]
        },
        {
            profile: PR.CMRObservationU1U5NeonatalHearscreening,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRHearscreeningMethodGerman],
            valueConceptMaps: [CM.CMRHearscreeningResultGerman]
        },
        {
            profile: PR.CMRObservationU1U5CounselingAboutHearscreening,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU1U5PediatricDiagnosticAudiologyService,
            models: [Models.UH.Basic.ObservationModel]
        },
        // U2
        {
            profile: PR.CMRObservationU2CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU2FamilyHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2FamilyHistoryGerman]
        },
        {
            profile: PR.CMRObservationU2SocialHistory,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU2U9RelevantHistoryResults,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationComments,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU2U9NoAbnormalityDetected,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationPhysicalExamParentalAssessment,
            models: [Models.UH.Basic.ObservationModel]
        },
        // U2 - über Diagnostic Report
        {
            profile: PR.CMRObservationU2PhysicalExamSkin,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamSkinGerman]
        },
        {
            profile: PR.CMRObservationU2PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU2PhysicalExamHead,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRObservationU2PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU2U3PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRObservationU2U3PhysicalExamEars,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamEarsGerman]
        },
        {
            profile: PR.CMRObservationU2U3PhysicalExamEyes,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRObservationU2U4PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2U4PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRObservationU2U6PhysicalExamHeartBloodCirculation,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU2U6PhysicalExamHeartBloodCirculationGerman]
        },
        {
            profile: PR.CMRObservationU2U6BodyWeight,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU2U9BodyHeightMeasure,
            models: [Models.UH.Basic.ObservationModel]
        },
        // U3
        {
            profile: PR.CMRObservationU3CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU3FamilyHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3FamilyHistoryGerman]
        },
        {
            profile: PR.CMRObservationU3U9SocialHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3U9SocialHistoryGerman]
        },
        {
            profile: PR.CMRObservationU3PhysicalExamHead,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRObservationU3DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU3PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU3U4PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3U4PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU3U4PhysicalExamSkin,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU3U4PhysicalExamSkinGerman]
        },
        {
            profile: PR.CMRObservationU3U6IndicationforAbnormality,
            models: [Models.UH.Basic.ObservationModel]
        },
        {
            profile: PR.CMRObservationU3U9AgeAppropriateDevelopment,
            models: [Models.UH.Basic.ObservationModel],
            valueConceptMaps: [CM.CMRU3U9AgeAppropriateDevelopmentGerman]
        },
        // U4
        {
            profile: PR.CMRObservationU4CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU4DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU4PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRObservationU4PhysicalExamHead,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRObservationU4PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU4U5PhysicalExamEyes,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU4U5PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRObservationU4U9StatusOfImmunization,
            models: [Models.UH.Basic.ObservationModel]
        },
        // U5
        {
            profile: PR.CMRObservationU5CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU5DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU5PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRObservationU5PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU5PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU5U6PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5U6PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRObservationU5U6PhysicalExamHead,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5U6PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRObservationU5U9PhysicalExamSkin,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU5U9PhysicalExamSkinGerman]
        },
        // U6
        {
            profile: PR.CMRObservationU6CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU6DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU6PhysicalExamEyes,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRObservationU6PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU6PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU6U7PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU6U7PhysicalExamChestLungRespiratoryTractGerman]
        },
        // U7
        {
            profile: PR.CMRObservationU7aandU9PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aandU9PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRObservationU7aandU9PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aandU9PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU7aCurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aCurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU7aDevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aDevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU7aPhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aPhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU7aU9PhysicalExamEyes,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7aU9PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRObservationU7CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU7DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU7PhysicalExamEyes,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRObservationU7PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRObservationU7PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU7U7aPhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7U7aPhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRObservationU7U9PhysicalExamHeartBloodCirculation,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU7U9PhysicalExamHeartBloodCirculationGerman]
        },
        // U8
        {
            profile: PR.CMRObservationU8CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU8DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU8PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRObservationU8PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRObservationU8PhysicalExamEars,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamEarsGerman]
        },
        {
            profile: PR.CMRObservationU8PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRObservationU8U9PhysicalExamMouthNose,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU8U9PhysicalExamMouthNoseGerman]
        },
        // U9
        {
            profile: PR.CMRObservationU9CurrentChildHistory,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU9CurrentChildHistoryGerman]
        },
        {
            profile: PR.CMRObservationU9DevelopmentAssessment,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU9DevelopmentAssessmentGerman]
        },
        {
            profile: PR.CMRObservationU9PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.ObservationModel],
            codeConceptMaps: [CM.CMRU9PhysicalExamAbdomenGenitalsGerman]
        }
    ];

    static DiagnosticReport: DetailMapping[] = [
        {
            profile: PR.CMRDiagnosticReportU3U4HipScreening,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRHipScreeningMethodGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU1U5NeonatalHearscreening,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRHearscreeningMethodGerman],
            valueConceptMaps: [CM.CMRHearscreeningResultGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU1U5PediatricDiagnosticAudiologyService,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1U3PulseOxymetry,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRPulseOxymetryScreeningMeasurementTypeGerman],
            valueConceptMaps: [
                CM.CMRU1U3PulseOxymetryMeasurementGerman,
                CM.CMRPulseOxymetryScreeningDataAbsentReasonGerman
            ]
        },
        // Percentile Curve
        {
            profile: PR.CMRDiagnosticReportPercentileBodyMeasures,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportPercentileValues,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [
                CM.CMRPercentileBodyMeasureLoincGerman,
                CM.CMRPercentileBodyMeasureSnomedGerman
            ]
        },
        // U1
        {
            profile: PR.CMRDiagnosticReportU1EdemaOfNewborn,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1NeonatalJaundice,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1BirthTraumaOfFetus,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1CongenitalMalformation,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1TermInfant,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1ApgarScore,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU1ApgarScoreIdentifierGerman],
            valueConceptMaps: [CM.CMRU1ApgarScoreValueGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU1BirthLength,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU1BirthWeight,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        // U2
        {
            profile: PR.CMRDiagnosticReportU2U6BodyMeasures,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU2PhysicalExamSkin,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamSkinGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2U4PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2U4PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2U3PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2U6PhysicalExamHeartBloodCirculation,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2U6PhysicalExamHeartBloodCirculationGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2U3PhysicalExamEars,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamEarsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2PhysicalExamHead,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU2U3PhysicalExamEyes,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU2U3PhysicalExamEyesGerman]
        },
        // U3
        {
            profile: PR.CMRDiagnosticReportU3PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU3PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU3PhysicalExamHead,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU3PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU3U4PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU3U4PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU3U4PhysicalExamSkin,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU3U4PhysicalExamSkinGerman]
        },
        // U4
        {
            profile: PR.CMRDiagnosticReportU4PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU4PhysicalExamHead,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU4PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU4PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU4U5PhysicalExamEyes,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU4U5PhysicalExamEyesGerman]
        },
        // U5
        {
            profile: PR.CMRDiagnosticReportU5PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU5PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU5PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU5U6PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5U6PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU5U6PhysicalExamHead,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5U6PhysicalExamHeadGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU5U9PhysicalExamSkin,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU5U9PhysicalExamSkinGerman]
        },
        // U6
        {
            profile: PR.CMRDiagnosticReportU6PhysicalExamEyes,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU6PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU6PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU6PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU6U7PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU6U7PhysicalExamChestLungRespiratoryTractGerman]
        },
        // U7
        {
            profile: PR.CMRDiagnosticReportU7aandU9PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7aandU9PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7aandU9PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7aandU9PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7aPhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7aPhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7aU9PhysicalExamEyes,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7aU9PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7PhysicalExamEyes,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamEyesGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamMouthNoseGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7U7aPhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7U7aPhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU7U9BodyMeasures,
            models: [Models.UH.Basic.DiagnosticReportModel]
        },
        {
            profile: PR.CMRDiagnosticReportU7U9PhysicalExamHeartBloodCirculation,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU7U9PhysicalExamHeartBloodCirculationGerman]
        },
        // U8
        {
            profile: PR.CMRDiagnosticReportU8PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamAbdomenGenitalsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU8PhysicalExamChestLungRespiratoryTract,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamChestLungRespiratoryTractGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU8PhysicalExamEars,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamEarsGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU8PhysicalExamMusculoskeletalSystem,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU8PhysicalExamMusculoskeletalSystemGerman]
        },
        {
            profile: PR.CMRDiagnosticReportU8U9PhysicalExamMouthNose,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU8U9PhysicalExamMouthNoseGerman]
        },
        // U9
        {
            profile: PR.CMRDiagnosticReportU9PhysicalExamAbdomenGenitals,
            models: [Models.UH.Basic.DiagnosticReportModel],
            codeConceptMaps: [CM.CMRU9PhysicalExamAbdomenGenitalsGerman]
        }
    ];

    static Procedure: DetailMapping[] = [
        {
            profile: PR.CMRProcedureConsultationAnnotation,
            models: [Models.UH.Basic.ProcedureModel]
        },
        {
            profile: PR.CMRProcedureU1U3CysticFibrosisScreening,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRExaminationNumberGerman]
        },
        {
            profile: PR.CMRProcedureU1U3NewbornBloodSpotScreening,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRNewbornBloodSpotScreeningTypeGerman]
        },
        {
            profile: PR.CMRProcedureU2Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU2ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU3Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU3ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU4Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU4ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU5Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU5ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU6Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU6ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU7aConsultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU7aConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU7Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU7ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU8Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU8ConsultationGerman]
        },
        {
            profile: PR.CMRProcedureU9Consultation,
            models: [Models.UH.Basic.ProcedureModel],
            codeConceptMaps: [CM.CMRU9ConsultationGerman]
        }
    ];

    static ServiceRequest: DetailMapping[] = [
        {
            profile: PR.CMRServiceRequestU1U5ReferralPediatricAudiologyService,
            models: [Models.UH.Basic.ServiceRequestModel]
        },
        {
            profile: PR.CMRServiceRequestU1U3PulseOxymetryClarification,
            models: [Models.UH.Basic.ServiceRequestModel]
        },
        {
            profile: PR.CMRServiceRequestDentalReferral,
            models: [Models.UH.Basic.ServiceRequestModel]
        }
    ];

    static CarePlan: DetailMapping[] = [
        {
            profile: PR.CMRCarePlanU2U9Result,
            models: [Models.UH.Basic.CarePlanModel]
        },
        {
            profile: PR.CMRCarePlanU3U4HipScreeningPlan,
            models: [Models.UH.Basic.CarePlanModel]
        }
    ];

    static MedicationPlan: DetailMapping[] = [
        {
            profile: PR.CMRMedicationStatementVitamineKProphylaxis,
            models: [Models.UH.Basic.MedicationPlanModel]
        }
    ];

    static Appointments: DetailMapping[] = [
        {
            profile: PR.CMRAppointmentNextAppointment,
            models: [Models.UH.Basic.AppointmentModel]
        },
        {
            profile: PR.CMRAppointmentNextImmunizationAppointment,
            models: [Models.UH.Basic.AppointmentModel]
        },
        {
            profile: PR.CMRAppointmentParticipationPeriod,
            models: [Models.UH.Basic.AppointmentModel]
        }
    ];

    static Filterable: DetailMapping[] = [
        {
            profile: CMR.V1_00_000.Profile.CMRPractitioner,
            header: "Qualifikation",
            models: [Models.QualificationModel]
        },
        {
            profile: CMR.V1_00_000.Profile.CMROrganizationScreeningLaboratory,
            header: "Kontaktperson",
            models: [Models.ContactDetailsModel]
        }
    ];

    static All: DetailMapping[] = [
        ...Mappings.Basic,
        ...Mappings.Observation,
        ...Mappings.DiagnosticReport,
        ...Mappings.Procedure,
        ...Mappings.ServiceRequest,
        ...Mappings.CarePlan,
        ...Mappings.MedicationPlan,
        ...Mappings.Appointments
    ];

    static modelFromMapping(
        entry: MIOEntry<any>, // eslint-disable-line
        mio: KBVBundleResource,
        mapping: DetailMapping,
        history?: History
    ): Models.Model {
        return new mapping.models[0](
            entry.resource,
            entry.fullUrl,
            mio,
            history,
            mapping.codeConceptMaps,
            mapping.valueConceptMaps,
            mapping.customLabel,
            mapping.noValue,
            mapping.noHeadline,
            mapping.customHeadline
        );
    }
}
