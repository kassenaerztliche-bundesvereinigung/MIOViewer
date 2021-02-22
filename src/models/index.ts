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

import { Vaccination, ZAEB, MR } from "@kbv/mioparser";
import BaseModel, { ModelValue } from "./BaseModel";

import {
    AdditionalCommentModel,
    AddressModel,
    PatientSimpleModel,
    TelecomModel
} from "./Comprehensive";

import * as IM from "./IM";
import * as ZB from "./ZB";
import * as MP from "./MP";

type Model =
    | IM.ConditionModel
    | IM.ObservationModel
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
          | MR.V1_00_000.Profile.EncounterGeneral
          | MR.V1_00_000.Profile.EncounterInpatientTreatment
      >
    | MP.Basic.ObservationModel<any> // TODO: Zu faul hier alle hinzuschreiben
    | MP.Basic.OrganizationModel
    | MP.Basic.PatientChildModel
    | MP.Basic.PatientMotherModel
    | MP.Basic.PractitionerModel
    | MP.Basic.ProcedureBaseModel<
          | MR.V1_00_000.Profile.ProcedureAntiDProphylaxis
          | MR.V1_00_000.Profile.ProcedureCounselling
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
    | MP.InformationAboutMotherModel
    | AdditionalCommentModel
    | AddressModel<
          | Vaccination.V1_00_000.Profile.Organization
          | ZAEB.V1_00_000.Profile.Patient
          | ZAEB.V1_00_000.Profile.Organization
          | MR.V1_00_000.Profile.PatientMother
          | MR.V1_00_000.Profile.Practitioner
      >
    | PatientSimpleModel
    | TelecomModel<
          | Vaccination.V1_00_000.Profile.Practitioner
          | Vaccination.V1_00_000.Profile.PractitionerAddendum
          | Vaccination.V1_00_000.Profile.Organization
          | ZAEB.V1_00_000.Profile.Organization
          | MR.V1_00_000.Profile.Practitioner
      >;

type ModelType =
    | typeof IM.ConditionModel
    | typeof IM.ObservationModel
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
    | typeof AdditionalCommentModel
    | typeof AddressModel
    | typeof PatientSimpleModel
    | typeof TelecomModel;

export type { ModelValue, ModelType, Model };

export {
    BaseModel,
    IM,
    ZB,
    MP,
    AdditionalCommentModel,
    AddressModel,
    PatientSimpleModel,
    TelecomModel
};
