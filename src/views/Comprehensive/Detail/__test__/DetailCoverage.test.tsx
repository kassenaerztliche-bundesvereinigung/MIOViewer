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

import * as TestUtil from "../../../../../test/TestUtil.test";

import IMDetail from "../../../IM/Detail";
import ZBDetail from "../../../ZB/Detail";
import MPDetail from "../../../MP/Detail";

import { DetailMapping } from "../DetailBase";

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

    const testDetailCoverage = (
        mappings: DetailMapping[],
        allProfiles: string[],
        unusedDetails: string[],
        done: jest.DoneCallback
    ): void => {
        // eslint-disable-next-line
        const profilesMapped = mappings.map((m: any) => m.profile.name);
        const usedProfiles = allProfiles.filter((p) => !unusedDetails.includes(p));
        console.log(`Mapped Profiles: ${usedProfiles.length} / ${profilesMapped.length}`);
        const missing = usedProfiles.filter((p) => !profilesMapped.includes(p));
        if (missing.length) console.log(missing);

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

    // used in  ObservationBaseModel.ts
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
});
