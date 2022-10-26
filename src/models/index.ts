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

import { Vaccination, ZAEB, MR, CMR } from "@kbv/mioparser";
import BaseModel from "./BaseModel";

import {
    AdditionalCommentModel,
    AddressModel,
    ContactDetailsModel,
    ContactModel,
    PatientSimpleModel,
    QualificationModel,
    TelecomModel
} from "./Comprehensive";

import * as IM from "./IM";
import * as ZB from "./ZB";
import * as MP from "./MP";
import * as UH from "./UH";
import * as PK from "./PK";

import { ModelValue } from "./Types";

type Model =
    | IM.ConditionModel
    | IM.ObservationModel
    | IM.OrganizationModel
    | IM.PatientModel
    | IM.PractitionerModel
    | IM.RecordAddendumModel
    | IM.RecordPrimeModel
    | ZB.GaplessDocumentationModel
    | ZB.ObservationModel
    | ZB.OrganizationModel
    | ZB.PatientModel
    | MP.Basic.ClinicalImpressionFindingModel
    | MP.Basic.ClinicalImpressionInvestigationModel
    | MP.Basic.ClinicalImpressionModel
    | MP.Basic.EncounterModel<
          | MR.V1_1_0.Profile.EncounterGeneral
          | MR.V1_1_0.Profile.EncounterInpatientTreatment
      >
    | MP.Basic.ObservationModel<MP.Basic.ObservationType>
    | MP.Basic.OrganizationModel
    | MP.Basic.PatientChildModel
    | MP.Basic.PatientMotherModel
    | MP.Basic.PractitionerModel
    | MP.Basic.ProcedureBaseModel<
          | MR.V1_1_0.Profile.ProcedureAntiDProphylaxis
          | MR.V1_1_0.Profile.ProcedureCounselling
      >
    | MP.AppointmentPregnancyModel
    | MP.EncounterArrivalMaternityHospitalModel
    | MP.ObservationMenstrualCycleModel
    | MP.ProcedureCounsellingModel
    | MP.ParticipantsModel
    | MP.EncounterGeneralModel
    | MP.EncounterInpatientTreatmentModel
    | MP.ObservationBloodGroupSerologyModel
    | MP.DiagnosticReportResultModel
    | MP.DiagnosticReportResultRequireControlModel
    | MP.InformationAboutModel
    | MP.InformationAboutChildModel
    | MP.InformationAboutChildModelBirth
    | MP.InformationAboutMotherModel
    | UH.Basic.AppointmentModel
    | UH.Basic.CarePlanModel
    | UH.Basic.CompositionHintsModel
    | UH.Basic.DiagnosticReportModel
    | UH.Basic.EncounterModel
    | UH.Basic.MedicationPlanModel
    | UH.Basic.ObservationModel
    | UH.Basic.OrganizationModel
    | UH.Basic.PatientModel
    | UH.Basic.PractitionerModel
    | UH.Basic.ProcedureModel
    | UH.Basic.ServiceRequestModel
    | UH.Basic.SpecialCompositionModel
    | UH.PC.ParticipationCardModel
    | UH.PN.CompositionModel
    | UH.PN.ParentalNotesModel
    | PK.Patient
    | PK.Practitioner
    | PK.PractitionerRole
    | PK.Consent
    | PK.AllergyIntolerance
    | PK.AllergyIntoleranceReaction
    | PK.DeviceImplant
    | PK.DeviceUseStatement
    | PK.Observation
    | PK.Organization
    | PK.Condition
    | PK.Medication
    | PK.MedicationStatement
    | PK.Procedure
    | PK.RelatedPerson
    | AdditionalCommentModel
    | AddressModel<
          | Vaccination.V1_1_0.Profile.Organization
          | ZAEB.V1_1_0.Profile.Patient
          | ZAEB.V1_1_0.Profile.Organization
          | MR.V1_1_0.Profile.PatientMother
          | MR.V1_1_0.Profile.Practitioner
      >
    | ContactModel<CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory>
    | PatientSimpleModel
    | TelecomModel<
          | Vaccination.V1_1_0.Profile.Practitioner
          | Vaccination.V1_1_0.Profile.PractitionerAddendum
          | Vaccination.V1_1_0.Profile.Organization
          | ZAEB.V1_1_0.Profile.Organization
          | MR.V1_1_0.Profile.Practitioner
      >
    | QualificationModel<CMR.V1_0_1.Profile.CMRPractitioner>
    | ContactDetailsModel<CMR.V1_0_1.Profile.CMROrganizationScreeningLaboratory>;

type ModelType =
    | typeof IM.ConditionModel
    | typeof IM.ObservationModel
    | typeof IM.OrganizationModel
    | typeof IM.PatientModel
    | typeof IM.PractitionerModel
    | typeof IM.RecordAddendumModel
    | typeof IM.RecordPrimeModel
    | typeof ZB.GaplessDocumentationModel
    | typeof ZB.ObservationModel
    | typeof ZB.OrganizationModel
    | typeof ZB.PatientModel
    | typeof MP.Basic.ClinicalImpressionFindingModel
    | typeof MP.Basic.ClinicalImpressionInvestigationModel
    | typeof MP.Basic.ClinicalImpressionModel
    | typeof MP.Basic.EncounterModel
    | typeof MP.Basic.ObservationModel
    | typeof MP.Basic.OrganizationModel
    | typeof MP.Basic.PatientChildModel
    | typeof MP.Basic.PatientMotherModel
    | typeof MP.Basic.PractitionerModel
    | typeof MP.Basic.ProcedureBaseModel
    | typeof MP.AppointmentPregnancyModel
    | typeof MP.EncounterArrivalMaternityHospitalModel
    | typeof MP.ObservationMenstrualCycleModel
    | typeof MP.ProcedureCounsellingModel
    | typeof MP.ParticipantsModel
    | typeof MP.EncounterGeneralModel
    | typeof MP.EncounterInpatientTreatmentModel
    | typeof MP.ObservationBloodGroupSerologyModel
    | typeof MP.DiagnosticReportResultModel
    | typeof MP.DiagnosticReportResultRequireControlModel
    | typeof MP.InformationAboutModel
    | typeof MP.InformationAboutChildModel
    | typeof MP.InformationAboutMotherModel
    | typeof UH.Basic.AppointmentModel
    | typeof UH.Basic.CarePlanModel
    | typeof UH.Basic.CompositionHintsModel
    | typeof UH.Basic.DiagnosticReportModel
    | typeof UH.Basic.EncounterModel
    | typeof UH.Basic.MedicationPlanModel
    | typeof UH.Basic.ObservationModel
    | typeof UH.Basic.OrganizationModel
    | typeof UH.Basic.PatientModel
    | typeof UH.Basic.PractitionerModel
    | typeof UH.Basic.ServiceRequestModel
    | typeof UH.Basic.ProcedureModel
    | typeof UH.Basic.SpecialCompositionModel
    | typeof UH.PC.ParticipationCardModel
    | typeof UH.PN.CompositionModel
    | typeof UH.PN.ParentalNotesModel
    | typeof PK.Patient
    | typeof PK.Practitioner
    | typeof PK.PractitionerRole
    | typeof PK.Consent
    | typeof PK.AllergyIntolerance
    | typeof PK.AllergyIntoleranceReaction
    | typeof PK.DeviceImplant
    | typeof PK.DeviceUseStatement
    | typeof PK.Observation
    | typeof PK.Organization
    | typeof PK.Condition
    | typeof PK.Medication
    | typeof PK.MedicationStatement
    | typeof PK.Procedure
    | typeof PK.RelatedPerson
    | typeof AdditionalCommentModel
    | typeof AddressModel
    | typeof ContactModel
    | typeof PatientSimpleModel
    | typeof TelecomModel
    | typeof QualificationModel
    | typeof ContactDetailsModel;

export type { ModelValue, ModelType, Model };

export {
    BaseModel,
    IM,
    ZB,
    MP,
    UH,
    PK,
    AdditionalCommentModel,
    AddressModel,
    ContactModel,
    PatientSimpleModel,
    TelecomModel,
    QualificationModel,
    ContactDetailsModel
};
