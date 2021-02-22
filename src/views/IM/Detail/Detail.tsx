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

import { MIOConnector } from "../../../store";
import { Util, UI } from "../../../components/";

import * as Models from "../../../models";
import DetailBase, { DetailMapping } from "../../Comprehensive/Detail/DetailBase";

import { Vaccination } from "@kbv/mioparser";

class Detail extends DetailBase<Vaccination.V1_00_000.Profile.BundleEntry> {
    protected getHeaderClass(): UI.MIOClassName {
        return "impfpass";
    }

    static mappings = [
        {
            profile: Vaccination.V1_00_000.Profile.RecordPrime,
            header: "Details zur Impfung",
            models: [Models.IM.RecordPrimeModel]
        },
        {
            profile: Vaccination.V1_00_000.Profile.RecordAddendum,
            header: "Details zur Impfung",
            models: [Models.IM.RecordAddendumModel]
        },
        {
            profile: Vaccination.V1_00_000.Profile.Condition,
            header: "Details zur Erkrankung",
            models: [Models.IM.ConditionModel]
        },
        {
            profile: Vaccination.V1_00_000.Profile.ObservationImmunizationStatus,
            header: "Details zur Immunreaktion",
            models: [Models.IM.ObservationModel]
        },
        {
            profile: Vaccination.V1_00_000.Profile.Patient,
            header: "Patient/-in",
            models: [Models.IM.PatientModel]
        },
        {
            profile: Vaccination.V1_00_000.Profile.Practitioner,
            header: "Details zur Person",
            models: [
                Models.IM.PractitionerModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: Vaccination.V1_00_000.Profile.PractitionerAddendum,
            header: "Details zur Person",
            models: [
                Models.IM.PractitionerModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        },
        {
            profile: Vaccination.V1_00_000.Profile.Organization,
            header: "Details zur Organisation",
            models: [
                Models.IM.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel,
                Models.AdditionalCommentModel
            ]
        }
    ];
    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected showPatient(): boolean {
        const { entry } = this.props;
        if (entry) {
            return (
                Vaccination.V1_00_000.Profile.RecordPrime.is(entry.resource) ||
                Vaccination.V1_00_000.Profile.RecordAddendum.is(entry.resource) ||
                Vaccination.V1_00_000.Profile.ObservationImmunizationStatus.is(
                    entry.resource
                ) ||
                Vaccination.V1_00_000.Profile.Condition.is(entry.resource)
            );
        } else {
            return false;
        }
    }

    protected getPatient() {
        const { mio } = this.props;
        return Util.IM.getPatient(mio as Vaccination.V1_00_000.Profile.BundleEntry)
            ?.resource;
    }
}

export default MIOConnector(Detail);
