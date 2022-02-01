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

import { Vaccination } from "@kbv/mioparser";
import * as Models from "../../models";
import { DetailMapping } from "../Comprehensive/Detail/Types";

export default class Mappings {
    static Basic: DetailMapping[] = [
        {
            profile: Vaccination.V1_1_0.Profile.RecordPrime,
            header: "Details zur Impfung",
            models: [Models.IM.RecordPrimeModel]
        },
        {
            profile: Vaccination.V1_1_0.Profile.RecordAddendum,
            header: "Details zur Impfung",
            models: [Models.IM.RecordAddendumModel]
        },
        {
            profile: Vaccination.V1_1_0.Profile.Condition,
            header: "Details zur Erkrankung",
            models: [Models.IM.ConditionModel]
        },
        {
            profile: Vaccination.V1_1_0.Profile.ObservationImmunizationStatus,
            header: "Details zur Immunreaktion",
            models: [Models.IM.ObservationModel]
        },
        {
            profile: Vaccination.V1_1_0.Profile.Patient,
            header: "Patient/-in",
            models: [Models.IM.PatientModel]
        },
        {
            profile: Vaccination.V1_1_0.Profile.Practitioner,
            header: "Details zur Person",
            models: [
                Models.IM.PractitionerModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: Vaccination.V1_1_0.Profile.PractitionerAddendum,
            header: "Details zur Person",
            models: [
                Models.IM.PractitionerModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: Vaccination.V1_1_0.Profile.Organization,
            header: "Details zur Organisation",
            models: [
                Models.IM.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: Vaccination.V1_1_0.Profile.OrganizationAddendum,
            header: "Details zur Organisation",
            models: [
                Models.IM.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        }
    ];
}
