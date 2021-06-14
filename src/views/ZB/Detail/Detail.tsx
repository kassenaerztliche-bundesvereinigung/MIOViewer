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

import { MIOConnector, SettingsConnector } from "../../../store";
import { UI, Util } from "../../../components";

import * as Models from "../../../models";

import DetailBase from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";

import { MIOEntry, ZAEB } from "@kbv/mioparser";

class Detail extends DetailBase<ZAEB.V1_00_000.Profile.Bundle> {
    protected getHeaderClass(): UI.MIOClassName {
        return "zaeb";
    }

    static mappings = [
        {
            profile: ZAEB.V1_00_000.Profile.Observation,
            header: "Details der Untersuchung",
            models: [Models.ZB.ObservationModel]
        },
        {
            profile: ZAEB.V1_00_000.Profile.GaplessDocumentation,
            header: "Lückenlose Dokumentation",
            models: [Models.ZB.GaplessDocumentationModel]
        },
        {
            profile: ZAEB.V1_00_000.Profile.Patient,
            header: "Patient/-in",
            models: [Models.ZB.PatientModel, Models.AddressModel]
        },
        {
            profile: ZAEB.V1_00_000.Profile.Organization,
            header: "Details zur Organisation",
            models: [
                Models.ZB.OrganizationModel,
                Models.AddressModel,
                Models.TelecomModel
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
                ZAEB.V1_00_000.Profile.Observation.is(entry.resource) ||
                ZAEB.V1_00_000.Profile.GaplessDocumentation.is(entry.resource)
            );
        } else {
            return false;
        }
    }

    protected getPatient(): MIOEntry<ZAEB.V1_00_000.Profile.Patient> | undefined {
        const { mio, entry } = this.props;
        const resource = entry?.resource;

        if (
            resource &&
            (ZAEB.V1_00_000.Profile.Observation.is(resource) ||
                ZAEB.V1_00_000.Profile.GaplessDocumentation.is(resource))
        ) {
            return Util.ZB.getPatientByRef(
                mio as ZAEB.V1_00_000.Profile.Bundle,
                resource.subject.reference
            );
        }
    }
}

export default SettingsConnector(MIOConnector(Detail));
