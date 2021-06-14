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

import { ParserUtil } from "@kbv/mioparser";
import * as TestUtil from "../../../../../test/TestUtil.test";

import IMDetail from "../../../IM/Detail";
import ZBDetail from "../../../ZB/Detail";
import MPDetail from "../../../MP/Detail";
import UHDetail from "../../../UH/Detail";

import { DetailMapping } from "../Types";

// eslint-disable-next-line
const findDuplicates = (arr: any[]): any[] => {
    const sortedArr = arr.slice().sort();
    const results = [];
    for (let i = 0; i < sortedArr.length - 1; i++) {
        if (sortedArr[i + 1] == sortedArr[i]) {
            results.push(sortedArr[i]);
        }
    }
    return results;
};

describe("Detail Coverage", () => {
    TestUtil.mock();

    const allProfilesIM: string[] = [
        "VaccinationBundleEntry",
        "VaccinationCompositionAddendum",
        "VaccinationCompositionPrime",
        "VaccinationCondition",
        "VaccinationObservationImmunizationStatus",
        "VaccinationOrganization",
        "VaccinationPatient",
        "VaccinationPractitioner",
        "VaccinationPractitionerAddendum",
        "VaccinationPractitionerrole",
        "VaccinationPractitionerroleAddendum",
        "VaccinationProvenance",
        "VaccinationRecordAddendum",
        "VaccinationRecordPrime"
    ];

    // VaccinationBundleEntry, VaccinationCompositionAddendum, VaccinationCompositionPrime,
    // VaccinationPractitionerrole, VaccinationPractitionerroleAddendum & VaccinationProvenance braucht kein Detail
    const unusedDetailsIM: string[] = [
        "VaccinationBundleEntry",
        "VaccinationCompositionAddendum",
        "VaccinationCompositionPrime",
        "VaccinationPractitionerrole",
        "VaccinationPractitionerroleAddendum",
        "VaccinationProvenance"
    ];

    const allProfilesZB: string[] = [
        "ZAEBBundle",
        "ZAEBComposition",
        "ZAEBGaplessDocumentation",
        "ZAEBObservation",
        "ZAEBOrganization",
        "ZAEBPatient"
    ];

    const unusedDetailsZB: string[] = ["ZAEBBundle", "ZAEBComposition"];

    const allProfilesMP: string[] = [
        "MRBundle",
        "MRAppointmentPregnancy",
        "MRClinicalImpressionBirthExaminationChildInformation",
        "MRClinicalImpressionBirthExaminationDeliveryInformation",
        "MRClinicalImpressionFirstExaminationAfterChildbirth",
        "MRClinicalImpressionInitialExamination",
        "MRClinicalImpressionPregnancyChartEntry",
        "MRClinicalImpressionPregnancyExaminationDischargeSummary",
        "MRClinicalImpressionSecondExaminationAfterChildbirth",
        "MRComposition",
        "MRDiagnosticReportUltrasoundI",
        "MRDiagnosticReportUltrasoundII",
        "MRDiagnosticReportUltrasoundIII",
        "MREncounterArrivalMaternityHospital",
        "MREncounterGeneral",
        "MREncounterInpatientTreatment",
        "MRObservationAbnormalities",
        "MRObservationAdviceOnIodineIntake",
        "MRObservationAge",
        "MRObservationAntiDProphylaxisPostPartum",
        "MRObservationApgarScore",
        "MRObservationBaselineWeightMother",
        "MRObservationBiometricsI",
        "MRObservationBiometricsII",
        "MRObservationBiometricsIII",
        "MRObservationBirthHeight",
        "MRObservationBirthMode",
        "MRObservationBloodGroupSerology",
        "MRObservationBloodGroupSerologyChild",
        "MRObservationBloodPressure",
        "MRObservationBreastfeedingBehavior",
        "MRObservationCalculatedDeliveryDate",
        "MRObservationCardiotocography",
        "MRObservationCatalogueA",
        "MRObservationChildIsHealthy",
        "MRObservationChildMovement",
        "MRObservationChildPosition",
        "MRObservationConsultationInitiated",
        "MRObservationDateDeterminationChildbirth",
        "MRObservationDateOfConception",
        "MRObservationDeterminationOfPregnancy",
        "MRObservationDirectCoombstest",
        "MRObservationEdema",
        "MRObservationExamination",
        "MRObservationExternalBirth",
        "MRObservationFindingsRequiredControl",
        "MRObservationFundusHeight",
        "MRObservationGeneralInformation",
        "MRObservationGravida",
        "MRObservationGynecologicalFindingNormal",
        "MRObservationHIVTestPerformed",
        "MRObservationHeadCircumference",
        "MRObservationHeartAction",
        "MRObservationHeartSoundsChild",
        "MRObservationHeight",
        "MRObservationImmunizationStatus",
        "MRObservationInpatientStayDuringPregnancy",
        "MRObservationLiveBirth",
        "MRObservationLocalisationPlacenta",
        "MRObservationMalformation",
        "MRObservationMenstrualCycle",
        "MRObservationMorphology",
        "MRObservationNeedOfTreatmentU3",
        "MRObservationNumberOfCheckups",
        "MRObservationOtherBloodGroupSystems",
        "MRObservationOtherUltrasoundStudies",
        "MRObservationPara",
        "MRObservationPercentile",
        "MRObservationPregnancyInformation",
        "MRObservationPregnancyRisk",
        "MRObservationPresentationAtBirthClinic",
        "MRObservationPreviousPregnancy",
        "MRObservationPuerperiumNormal",
        "MRObservationSingletonPregnancy",
        "MRObservationSpecialFindings",
        "MRObservationTimelyDevelopment",
        "MRObservationU3Performed",
        "MRObservationUltrasound",
        "MRObservationUrine",
        "MRObservationUrineBlood",
        "MRObservationUrineNitrite",
        "MRObservationUrineProtein",
        "MRObservationUrineSediment",
        "MRObservationUrineSugar",
        "MRObservationVaginalExamination",
        "MRObservationVaricosis",
        "MRObservationWeightChild",
        "MRObservationWeightMother",
        "MRObservationoGTTDiagnosistest",
        "MRObservationoGTTPretest",
        "MRObservationpHValueUmbilicalArtery",
        "MROrganization",
        "MRPatientChild",
        "MRPatientMother",
        "MRPractitioner",
        "MRProcedureAntiDProphylaxis",
        "MRProcedureCounselling"
    ];

    // MRBundle & MRComposition braucht kein Detail
    // MRObservationUltrasound - Siehe SectionUltrasound
    const unusedDetailsMP: string[] = ["MRBundle", "MRComposition"];

    const allProfilesUH: string[] = [
        "CMRAppointmentNextAppointment",
        "CMRAppointmentNextImmunizationAppointment",
        "CMRAppointmentParticipationPeriod",
        "CMRBundle",
        "CMRCarePlanU2U9Result",
        "CMRCarePlanU3U4HipScreeningPlan",
        "CMRCompositionCysticFibrosisScreening",
        "CMRCompositionExtendedNewbornScreening",
        "CMRCompositionHipScreening",
        "CMRCompositionNeonatalHearscreening",
        "CMRCompositionPercentileCurve",
        "CMRCompositionPulseOxymetryScreening",
        "CMRCompositionU1",
        "CMRCompositionU2",
        "CMRCompositionU3",
        "CMRCompositionU4",
        "CMRCompositionU5",
        "CMRCompositionU6",
        "CMRCompositionU7",
        "CMRCompositionU7a",
        "CMRCompositionU8",
        "CMRCompositionU9",
        "CMRDiagnosticReportPercentileBodyMeasures",
        "CMRDiagnosticReportPercentileValues",
        "CMRDiagnosticReportU1ApgarScore",
        "CMRDiagnosticReportU1BirthLength",
        "CMRDiagnosticReportU1BirthTraumaOfFetus",
        "CMRDiagnosticReportU1BirthWeight",
        "CMRDiagnosticReportU1CongenitalMalformation",
        "CMRDiagnosticReportU1EdemaOfNewborn",
        "CMRDiagnosticReportU1NeonatalJaundice",
        "CMRDiagnosticReportU1TermInfant",
        "CMRDiagnosticReportU1U3PulseOxymetry",
        "CMRDiagnosticReportU1U5NeonatalHearscreening",
        "CMRDiagnosticReportU1U5PediatricDiagnosticAudiologyService",
        "CMRDiagnosticReportU2PhysicalExamHead",
        "CMRDiagnosticReportU2PhysicalExamMouthNose",
        "CMRDiagnosticReportU2PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU2PhysicalExamSkin",
        "CMRDiagnosticReportU2U3PhysicalExamAbdomenGenitals",
        "CMRDiagnosticReportU2U3PhysicalExamEars",
        "CMRDiagnosticReportU2U3PhysicalExamEyes",
        "CMRDiagnosticReportU2U4PhysicalExamChestLungRespiratoryTract",
        "CMRDiagnosticReportU2U6BodyMeasures",
        "CMRDiagnosticReportU2U6PhysicalExamHeartBloodCirculation",
        "CMRDiagnosticReportU3PhysicalExamHead",
        "CMRDiagnosticReportU3PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU3U4HipScreening",
        "CMRDiagnosticReportU3U4PhysicalExamMouthNose",
        "CMRDiagnosticReportU3U4PhysicalExamSkin",
        "CMRDiagnosticReportU4PhysicalExamAbdomenGenitals",
        "CMRDiagnosticReportU4PhysicalExamHead",
        "CMRDiagnosticReportU4PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU4U5PhysicalExamEyes",
        "CMRDiagnosticReportU5PhysicalExamChestLungRespiratoryTract",
        "CMRDiagnosticReportU5PhysicalExamMouthNose",
        "CMRDiagnosticReportU5PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU5U6PhysicalExamAbdomenGenitals",
        "CMRDiagnosticReportU5U6PhysicalExamHead",
        "CMRDiagnosticReportU5U9PhysicalExamSkin",
        "CMRDiagnosticReportU6PhysicalExamEyes",
        "CMRDiagnosticReportU6PhysicalExamMouthNose",
        "CMRDiagnosticReportU6PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU6U7PhysicalExamChestLungRespiratoryTract",
        "CMRDiagnosticReportU7aandU9PhysicalExamChestLungRespiratoryTract",
        "CMRDiagnosticReportU7aandU9PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU7aPhysicalExamMouthNose",
        "CMRDiagnosticReportU7aU9PhysicalExamEyes",
        "CMRDiagnosticReportU7PhysicalExamEyes",
        "CMRDiagnosticReportU7PhysicalExamMouthNose",
        "CMRDiagnosticReportU7PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU7U7aPhysicalExamAbdomenGenitals",
        "CMRDiagnosticReportU7U9BodyMeasures",
        "CMRDiagnosticReportU7U9PhysicalExamHeartBloodCirculation",
        "CMRDiagnosticReportU8PhysicalExamAbdomenGenitals",
        "CMRDiagnosticReportU8PhysicalExamChestLungRespiratoryTract",
        "CMRDiagnosticReportU8PhysicalExamEars",
        "CMRDiagnosticReportU8PhysicalExamMusculoskeletalSystem",
        "CMRDiagnosticReportU8U9PhysicalExamMouthNose",
        "CMRDiagnosticReportU9PhysicalExamAbdomenGenitals",
        "CMREncounter",
        "CMRMedicationStatementVitamineKProphylaxis",
        "CMRObservationComments",
        "CMRObservationHeadCircumference",
        "CMRObservationPercentileValues",
        "CMRObservationPhysicalExamParentalAssessment",
        "CMRObservationU1ApgarScore",
        "CMRObservationU1BirthLength",
        "CMRObservationU1BirthTraumaOfFetus",
        "CMRObservationU1BirthWeight",
        "CMRObservationU1CongenitalMalformation",
        "CMRObservationU1EdemaofNewborn",
        "CMRObservationU1FamilyHistory",
        "CMRObservationU1NeonatalJaundice",
        "CMRObservationU1TermInfant",
        "CMRObservationU1U3BaseExcess",
        "CMRObservationU1U3Birthmode",
        "CMRObservationU1U3DateTimeofBirth",
        "CMRObservationU1U3DifferentFoetalPosition",
        "CMRObservationU1U3FoetalPosition",
        "CMRObservationU1U3GenderBirthHistory",
        "CMRObservationU1U3LengthGestationAtBirth",
        "CMRObservationU1U3pHValue",
        "CMRObservationU1U3PregnancyHistory",
        "CMRObservationU1U3PrenatalFinding",
        "CMRObservationU1U3PulseOxymetryMeasurement",
        "CMRObservationU1U5CounselingAboutHearscreening",
        "CMRObservationU1U5NeonatalHearscreening",
        "CMRObservationU1U5PediatricDiagnosticAudiologyService",
        "CMRObservationU2CurrentChildHistory",
        "CMRObservationU2FamilyHistory",
        "CMRObservationU2PhysicalExamHead",
        "CMRObservationU2PhysicalExamMouthNose",
        "CMRObservationU2PhysicalExamMusculoskeletalSystem",
        "CMRObservationU2PhysicalExamSkin",
        "CMRObservationU2SocialHistory",
        "CMRObservationU2U3PhysicalExamAbdomenGenitals",
        "CMRObservationU2U3PhysicalExamEars",
        "CMRObservationU2U3PhysicalExamEyes",
        "CMRObservationU2U4PhysicalExamChestLungRespiratoryTract",
        "CMRObservationU2U6BodyWeight",
        "CMRObservationU2U6PhysicalExamHeartBloodCirculation",
        "CMRObservationU2U9BodyHeightMeasure",
        "CMRObservationU2U9NoAbnormalityDetected",
        "CMRObservationU2U9RelevantHistoryResults",
        "CMRObservationU3CurrentChildHistory",
        "CMRObservationU3DevelopmentAssessment",
        "CMRObservationU3FamilyHistory",
        "CMRObservationU3PhysicalExamHead",
        "CMRObservationU3PhysicalExamMusculoskeletalSystem",
        "CMRObservationU3U4HipScreeningHistory",
        "CMRObservationU3U4HipScreeningResult",
        "CMRObservationU3U4PhysicalExamMouthNose",
        "CMRObservationU3U4PhysicalExamSkin",
        "CMRObservationU3U4ProblemOfHip",
        "CMRObservationU3U6IndicationforAbnormality",
        "CMRObservationU3U9AgeAppropriateDevelopment",
        "CMRObservationU3U9SocialHistory",
        "CMRObservationU4CurrentChildHistory",
        "CMRObservationU4DevelopmentAssessment",
        "CMRObservationU4PhysicalExamAbdomenGenitals",
        "CMRObservationU4PhysicalExamHead",
        "CMRObservationU4PhysicalExamMusculoskeletalSystem",
        "CMRObservationU4U5PhysicalExamEyes",
        "CMRObservationU4U9StatusOfImmunization",
        "CMRObservationU5CurrentChildHistory",
        "CMRObservationU5DevelopmentAssessment",
        "CMRObservationU5PhysicalExamChestLungRespiratoryTract",
        "CMRObservationU5PhysicalExamMouthNose",
        "CMRObservationU5PhysicalExamMusculoskeletalSystem",
        "CMRObservationU5U6PhysicalExamAbdomenGenitals",
        "CMRObservationU5U6PhysicalExamHead",
        "CMRObservationU5U9PhysicalExamSkin",
        "CMRObservationU6CurrentChildHistory",
        "CMRObservationU6DevelopmentAssessment",
        "CMRObservationU6PhysicalExamEyes",
        "CMRObservationU6PhysicalExamMouthNose",
        "CMRObservationU6PhysicalExamMusculoskeletalSystem",
        "CMRObservationU6U7PhysicalExamChestLungRespiratoryTract",
        "CMRObservationU7aandU9PhysicalExamChestLungRespiratoryTract",
        "CMRObservationU7aandU9PhysicalExamMusculoskeletalSystem",
        "CMRObservationU7aCurrentChildHistory",
        "CMRObservationU7aDevelopmentAssessment",
        "CMRObservationU7aPhysicalExamMouthNose",
        "CMRObservationU7aU9PhysicalExamEyes",
        "CMRObservationU7CurrentChildHistory",
        "CMRObservationU7DevelopmentAssessment",
        "CMRObservationU7PhysicalExamEyes",
        "CMRObservationU7PhysicalExamMouthNose",
        "CMRObservationU7PhysicalExamMusculoskeletalSystem",
        "CMRObservationU7U7aPhysicalExamAbdomenGenitals",
        "CMRObservationU7U9BMI",
        "CMRObservationU7U9BodyWeight",
        "CMRObservationU7U9PhysicalExamHeartBloodCirculation",
        "CMRObservationU8CurrentChildHistory",
        "CMRObservationU8DevelopmentAssessment",
        "CMRObservationU8PhysicalExamAbdomenGenitals",
        "CMRObservationU8PhysicalExamChestLungRespiratoryTract",
        "CMRObservationU8PhysicalExamEars",
        "CMRObservationU8PhysicalExamMusculoskeletalSystem",
        "CMRObservationU8U9PhysicalExamMouthNose",
        "CMRObservationU9CurrentChildHistory",
        "CMRObservationU9DevelopmentAssessment",
        "CMRObservationU9PhysicalExamAbdomenGenitals",
        "CMROrganization",
        "CMROrganizationScreeningLaboratory",
        "CMRPatient",
        "CMRPractitioner",
        "CMRProcedureConsultationAnnotation",
        "CMRProcedureU1U3CysticFibrosisScreening",
        "CMRProcedureU1U3NewbornBloodSpotScreening",
        "CMRProcedureU2Consultation",
        "CMRProcedureU3Consultation",
        "CMRProcedureU4Consultation",
        "CMRProcedureU5Consultation",
        "CMRProcedureU6Consultation",
        "CMRProcedureU7aConsultation",
        "CMRProcedureU7Consultation",
        "CMRProcedureU8Consultation",
        "CMRProcedureU9Consultation",
        "CMRServiceRequestDentalReferral",
        "CMRServiceRequestU1U3PulseOxymetryClarification",
        "CMRServiceRequestU1U5ReferralPediatricAudiologyService",
        // PN
        "PNBundle",
        "PNCompositionParentalNotes",
        "PNEncounter",
        "PNObservationParentalNotes",
        "PNPatient",
        // PC
        "PCBundle",
        "PCCompositionExaminationParticipation",
        "PCEncounter",
        "PCOrganization",
        "PCPatient",
        "PCPractitioner"
    ];

    const unusedDetailsUH: string[] = [
        "CMRBundle",
        "CMRCompositionCysticFibrosisScreening",
        "CMRCompositionExtendedNewbornScreening",
        "CMRCompositionHipScreening",
        "CMRCompositionNeonatalHearscreening",
        "CMRCompositionPercentileCurve",
        "CMRCompositionPulseOxymetryScreening",
        "CMRCompositionU1",
        "CMRCompositionU2",
        "CMRCompositionU3",
        "CMRCompositionU4",
        "CMRCompositionU5",
        "CMRCompositionU6",
        "CMRCompositionU7",
        "CMRCompositionU7a",
        "CMRCompositionU8",
        "CMRCompositionU9",
        "PNBundle",
        "PNCompositionParentalNotes",
        "PCBundle",
        "PCCompositionExaminationParticipation",
        "PNObservationParentalNotes" // Used in ParentalNotesModel
    ];

    const testDetailCoverage = (
        mappings: DetailMapping[],
        allProfiles: string[],
        unusedDetails: string[],
        done: jest.DoneCallback
    ): void => {
        const profilesMapped = mappings.map((m) => m.profile.name);
        const usedProfiles = allProfiles.filter((p) => !unusedDetails.includes(p));
        console.log(`Mapped Profiles: ${usedProfiles.length} / ${profilesMapped.length}`);

        const duplicates = findDuplicates(profilesMapped);
        if (duplicates.length) console.log("Duplicates: ", duplicates);

        const missing = usedProfiles.filter((p) => !profilesMapped.includes(p));
        if (missing.length) console.log("Missing: ", missing);

        const excess = profilesMapped.filter((p) => !usedProfiles.includes(p));
        if (excess.length) console.log("Excess: ", excess);

        expect(profilesMapped.length).toEqual(usedProfiles.length);
        expect(missing.length).toEqual(0);

        done();
    };

    it("Covers all Profiles in Impfpass  Detail", (done) => {
        testDetailCoverage(IMDetail.mappings, allProfilesIM, unusedDetailsIM, done);
    });

    it("Covers all Profiles in ZAEB Detail", (done) => {
        testDetailCoverage(ZBDetail.mappings, allProfilesZB, unusedDetailsZB, done);
    });

    it("Covers all Profiles in Mutterpass Detail", (done) => {
        testDetailCoverage(MPDetail.mappings, allProfilesMP, unusedDetailsMP, done);
    });

    // used in ObservationBaseModel.ts
    const usedObservationsMP: string[] = [
        "MRObservationCalculatedDeliveryDate",
        "MRObservationDateDeterminationChildbirth",
        "MRObservationDateOfConception",
        "MRObservationDeterminationOfPregnancy",
        "MRObservationMenstrualCycle",
        "MRObservationAge",
        "MRObservationBaselineWeightMother",
        "MRObservationHeight",
        "MRObservationGravida",
        "MRObservationPara",
        "MRObservationPregnancyRisk",
        "MRObservationPreviousPregnancy",
        "MRObservationCatalogueA",
        "MRObservationSpecialFindings",
        "MRObservationoGTTPretest",
        "MRObservationoGTTDiagnosistest",
        "MRObservationHIVTestPerformed",
        "MRObservationExamination",
        "MRObservationImmunizationStatus",
        "MRObservationBloodGroupSerology",
        "MRObservationOtherBloodGroupSystems",
        "MRObservationBloodPressure",
        "MRObservationWeightMother",
        "MRObservationFundusHeight",
        "MRObservationVaricosis",
        "MRObservationEdema",
        "MRObservationUrine",
        "MRObservationUrineSugar",
        "MRObservationUrineProtein",
        "MRObservationUrineNitrite",
        "MRObservationUrineBlood",
        "MRObservationVaginalExamination",
        "MRObservationHeartSoundsChild",
        "MRObservationChildMovement",
        "MRObservationNumberOfCheckups",
        "MRObservationPresentationAtBirthClinic",
        "MRObservationInpatientStayDuringPregnancy",
        "MRObservationCardiotocography",
        "MRObservationUltrasound",
        "MRObservationOtherUltrasoundStudies",
        "MRDiagnosticReportUltrasoundI",
        "MRDiagnosticReportUltrasoundII",
        "MRDiagnosticReportUltrasoundIII",
        "MRObservationGeneralInformation",
        "MRObservationPregnancyInformation",
        "MRObservationSingletonPregnancy",
        "MRObservationHeartAction",
        "MRObservationLocalisationPlacenta",
        "MRObservationChildPosition",
        "MRObservationBiometricsI",
        "MRObservationBiometricsII",
        "MRObservationBiometricsIII",
        "MRObservationPercentile",
        "MRObservationTimelyDevelopment",
        "MRObservationFindingsRequiredControl",
        "MRObservationAbnormalities",
        "MRObservationConsultationInitiated",
        "MRObservationMorphology",
        "MRObservationExternalBirth",
        "MRObservationLiveBirth",
        "MRObservationBirthMode",
        "MRObservationWeightChild",
        "MRObservationHeadCircumference",
        "MRObservationBirthHeight",
        "MRObservationApgarScore",
        "MRObservationpHValueUmbilicalArtery",
        "MRObservationMalformation",
        "MRObservationPuerperiumNormal",
        "MRObservationGynecologicalFindingNormal",
        "MRObservationAntiDProphylaxisPostPartum",
        "MRObservationAdviceOnIodineIntake",
        "MRObservationBloodGroupSerologyChild",
        "MRObservationDirectCoombstest",
        "MRObservationBreastfeedingBehavior",
        "MRObservationUrineSediment",
        "MRObservationU3Performed",
        "MRObservationNeedOfTreatmentU3",
        "MRObservationChildIsHealthy"
    ];

    it("Covers all Mutterpass Observations", (done) => {
        const observations = allProfilesMP.filter(
            (p) => p.includes("MRObservation") || p.includes("DiagnosticReport")
        );
        console.log(
            `Mapped Observations: ${usedObservationsMP.length} / ${observations.length}`
        );

        const missing = observations.filter((p) => !usedObservationsMP.includes(p));
        if (missing.length) console.log(missing);
        expect(usedObservationsMP.length).toEqual(observations.length);
        expect(missing.length).toEqual(0);

        done();
    });

    const checkProfileSet = (profileSet: DetailMapping[], namePart: string): boolean => {
        const falseProfiles = profileSet.filter(
            (m) => !m.profile.name.includes(namePart)
        );
        if (falseProfiles.length) console.log(falseProfiles);
        return falseProfiles.length === 0;
    };

    it("Covers all Profiles in U-Heft Detail", (done) => {
        testDetailCoverage(UHDetail.mappings, allProfilesUH, unusedDetailsUH, done);

        expect(
            checkProfileSet(UHDetail.mappingsObservation, "CMRObservation")
        ).toBeTruthy();
        expect(
            checkProfileSet(UHDetail.mappingsDiagnosticReport, "CMRDiagnosticReport")
        ).toBeTruthy();
    });

    const conceptMapsUH = [
        // "CMRBodysiteHipGerman", // is used in ObservationModel.getBodySite
        "CMRExaminationNumberGerman",
        "CMRFoetalPositionGerman",
        "CMRGenderBirthGerman",
        "CMRGrafHipUltrasoundClassificationGerman",
        "CMRHearscreeningMethodGerman",
        "CMRHearscreeningResultGerman",
        "CMRHipHistoryGerman",
        // "CMRHipProceedingGerman", // is used in CarePlanModel
        "CMRHipScreeningMethodGerman",
        // "CMRMedicationStatementStatusGerman", // is used in MedicationPlanModel
        "CMRNewbornBloodSpotScreeningTypeGerman",
        "CMRPercentileBodyMeasureLoincGerman",
        "CMRPercentileBodyMeasureSnomedGerman",
        // "CMRPractitionerSpecialityGerman", is used in Util.UH.translateQualification
        "CMRPregnancyHistoryGerman",
        "CMRPulseOxymetryScreeningDataAbsentReasonGerman",
        "CMRPulseOxymetryScreeningMeasurementTypeGerman",
        "CMRU1ApgarScoreIdentifierGerman",
        "CMRU1ApgarScoreValueGerman",
        "CMRU1U3BirthmodeGerman",
        // "CMRU1U3PulseOxymetryMeasurementGerman", // is used in ObservationModel.interpretationConceptMaps
        "CMRU2ConsultationGerman",
        "CMRU2CurrentChildHistoryGerman",
        "CMRU2FamilyHistoryGerman",
        "CMRU2PhysicalExamHeadGerman",
        "CMRU2PhysicalExamMouthNoseGerman",
        "CMRU2PhysicalExamMusculoskeletalSystemGerman",
        "CMRU2PhysicalExamSkinGerman",
        "CMRU2U3PhysicalExamAbdomenGenitalsGerman",
        "CMRU2U3PhysicalExamEarsGerman",
        "CMRU2U3PhysicalExamEyesGerman",
        "CMRU2U4PhysicalExamChestLungRespiratoryTractGerman",
        "CMRU2U6PhysicalExamHeartBloodCirculationGerman",
        "CMRU3ConsultationGerman",
        "CMRU3CurrentChildHistoryGerman",
        "CMRU3DevelopmentAssessmentGerman",
        "CMRU3FamilyHistoryGerman",
        "CMRU3PhysicalExamHeadGerman",
        "CMRU3PhysicalExamMusculoskeletalSystemGerman",
        "CMRU3U4PhysicalExamMouthNoseGerman",
        "CMRU3U4PhysicalExamSkinGerman",
        "CMRU3U9AgeAppropriateDevelopmentGerman",
        "CMRU3U9SocialHistoryGerman",
        "CMRU4ConsultationGerman",
        "CMRU4CurrentChildHistoryGerman",
        "CMRU4DevelopmentAssessmentGerman",
        "CMRU4PhysicalExamAbdomenGenitalsGerman",
        "CMRU4PhysicalExamHeadGerman",
        "CMRU4PhysicalExamMusculoskeletalSystemGerman",
        "CMRU4U5PhysicalExamEyesGerman",
        "CMRU5ConsultationGerman",
        "CMRU5CurrentChildHistoryGerman",
        "CMRU5DevelopmentAssessmentGerman",
        "CMRU5PhysicalExamChestLungRespiratoryTractGerman",
        "CMRU5PhysicalExamMouthNoseGerman",
        "CMRU5PhysicalExamMusculoskeletalSystemGerman",
        "CMRU5U6PhysicalExamAbdomenGenitalsGerman",
        "CMRU5U6PhysicalExamHeadGerman",
        "CMRU5U9PhysicalExamSkinGerman",
        "CMRU6ConsultationGerman",
        "CMRU6CurrentChildHistoryGerman",
        "CMRU6DevelopmentAssessmentGerman",
        "CMRU6PhysicalExamEyesGerman",
        "CMRU6PhysicalExamMouthNoseGerman",
        "CMRU6PhysicalExamMusculoskeletalSystemGerman",
        "CMRU6U7PhysicalExamChestLungRespiratoryTractGerman",
        "CMRU7aandU9PhysicalExamChestLungRespiratoryTractGerman",
        "CMRU7aandU9PhysicalExamMusculoskeletalSystemGerman",
        "CMRU7aConsultationGerman",
        "CMRU7aCurrentChildHistoryGerman",
        "CMRU7aDevelopmentAssessmentGerman",
        "CMRU7aPhysicalExamMouthNoseGerman",
        "CMRU7aU9PhysicalExamEyesGerman",
        "CMRU7ConsultationGerman",
        "CMRU7CurrentChildHistoryGerman",
        "CMRU7DevelopmentAssessmentGerman",
        "CMRU7PhysicalExamEyesGerman",
        "CMRU7PhysicalExamMouthNoseGerman",
        "CMRU7PhysicalExamMusculoskeletalSystemGerman",
        "CMRU7U7aPhysicalExamAbdomenGenitalsGerman",
        "CMRU7U9PhysicalExamHeartBloodCirculationGerman",
        "CMRU8ConsultationGerman",
        "CMRU8CurrentChildHistoryGerman",
        "CMRU8DevelopmentAssessmentGerman",
        "CMRU8PhysicalExamAbdomenGenitalsGerman",
        "CMRU8PhysicalExamChestLungRespiratoryTractGerman",
        "CMRU8PhysicalExamEarsGerman",
        "CMRU8PhysicalExamMusculoskeletalSystemGerman",
        "CMRU8U9PhysicalExamMouthNoseGerman",
        "CMRU9ConsultationGerman",
        "CMRU9CurrentChildHistoryGerman",
        "CMRU9DevelopmentAssessmentGerman",
        "CMRU9PhysicalExamAbdomenGenitalsGerman"
        // "PCPNExaminationNumberGerman" is used in Util.UH.getType & AppointmentModel.getServiceType
    ];

    const getCMName = (cm: ParserUtil.ConceptMap): string[] => {
        return cm.map((c) => {
            return c.target
                .replace("https://fhir.kbv.de/CodeSystem/KBV_CS_MIO_", "")
                .split("_")
                .join("");
        });
    };

    it("Covers all ConceptMaps in U-Heft Mappings", (done) => {
        const conceptMapsInMappings = UHDetail.mappings
            .map((m) => {
                const all = [];
                if (m.codeConceptMaps) all.push(...m.codeConceptMaps);
                if (m.valueConceptMaps) all.push(...m.valueConceptMaps);
                return all.map((cm) => getCMName(cm)).flat();
            })
            .flat();

        const missing = conceptMapsUH.filter((cm) => !conceptMapsInMappings.includes(cm));
        if (missing.length) console.log(missing);

        expect(missing.length).toBe(0);

        done();
    });
});
