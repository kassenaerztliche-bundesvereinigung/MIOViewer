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

import ClinicalImpressionFindingModel from "./ClinicalImpressionFindingModel";
import ClinicalImpressionInvestigationModel from "./ClinicalImpressionInvestigationModel";
import ClinicalImpressionModel from "./ClinicalImpressionModel";
import EncounterModel from "./EncounterModel";
import ObservationModel, { ObservationType } from "./ObservationModel";
import OrganizationModel from "./OrganizationModel";
import PatientChildModel from "./PatientChildModel";
import PatientMotherModel from "./PatientMotherModel";
import PractitionerModel from "./PractitionerModel";
import ProcedureBaseModel from "./ProcedureBaseModel";

export type { ObservationType };

export {
    ClinicalImpressionFindingModel,
    ClinicalImpressionInvestigationModel,
    ClinicalImpressionModel,
    EncounterModel,
    ObservationModel,
    OrganizationModel,
    PractitionerModel,
    PatientChildModel,
    PatientMotherModel,
    ProcedureBaseModel
};
