/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import { Vaccination, ZAEB } from "@kbv/mioparser";
import BaseModel, { ModelValue } from "./BaseModel";

import { AddressModel, TelecomModel } from "./Comprehensive";

import * as IM from "./IM";
import * as ZB from "./ZB";

type Model =
    | IM.AdditionalCommentModel
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
    | AddressModel<
          | Vaccination.V1_00_000.Profile.Organization
          | ZAEB.V1_00_000.Profile.Patient
          | ZAEB.V1_00_000.Profile.Organization
      >
    | TelecomModel<
          | Vaccination.V1_00_000.Profile.Practitioner
          | Vaccination.V1_00_000.Profile.PractitionerAddendum
          | Vaccination.V1_00_000.Profile.Organization
          | ZAEB.V1_00_000.Profile.Organization
      >;

type ModelType =
    | typeof IM.AdditionalCommentModel
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
    | typeof AddressModel
    | typeof TelecomModel;

export type { ModelValue, ModelType, Model };

export { BaseModel, IM, ZB, AddressModel, TelecomModel };
