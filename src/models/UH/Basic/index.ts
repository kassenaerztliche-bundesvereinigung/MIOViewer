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

import BaseModel from "./CMRBaseModel";

import AppointmentModel from "./AppointmentModel";
import CarePlanModel from "./CarePlanModel";
import CompositionHintsModel, { CompositionHintsType } from "./CompositionHintsModel";
import DiagnosticReportModel from "./DiagnosticReportModel";
import EncounterModel from "./EncounterModel";
import MedicationPlanModel from "./MedicationPlanModel";
import ObservationModel, { ObservationType } from "./ObservationModel";
import OrganizationModel from "./OrganizationModel";
import PatientModel from "./PatientModel";
import PractitionerModel from "./PractitionerModel";
import ProcedureModel from "./ProcedureModel";
import ServiceRequestModel from "./ServiceRequestModel";
import SpecialCompositionModel from "./SpecialCompositionModel";

export type { ObservationType, CompositionHintsType };

export {
    BaseModel,
    AppointmentModel,
    CarePlanModel,
    CompositionHintsModel,
    DiagnosticReportModel,
    EncounterModel,
    MedicationPlanModel,
    ObservationModel,
    OrganizationModel,
    PatientModel,
    PractitionerModel,
    ProcedureModel,
    ServiceRequestModel,
    SpecialCompositionModel
};
