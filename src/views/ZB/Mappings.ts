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

import { ZAEB } from "@kbv/mioparser";
import * as Models from "../../models";
import { DetailMapping } from "../Comprehensive/Detail/Types";

export default class Mappings {
    static Basic: DetailMapping[] = [
        {
            profile: ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
            header: "Details der Untersuchung",
            models: [Models.ZB.ObservationModel]
        },
        {
            profile: ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation,
            header: "Lückenlose Dokumentation",
            models: [Models.ZB.GaplessDocumentationModel]
        },
        {
            profile: ZAEB.V1_1_0.Profile.Patient,
            header: "Patient/-in",
            models: [Models.ZB.PatientModel, Models.AddressModel]
        },
        {
            profile: ZAEB.V1_1_0.Profile.Organization,
            header: "Details zur Organisation",
            models: [
                Models.ZB.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel
            ]
        }
    ];
}
