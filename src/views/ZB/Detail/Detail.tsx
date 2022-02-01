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

import { MIOConnector, SettingsConnector } from "../../../store";
import { UI, Util } from "../../../components";

import DetailBase from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";

import { MIOEntry, Reference, ZAEB } from "@kbv/mioparser";
import Mappings from "../Mappings";

class Detail extends DetailBase<ZAEB.V1_1_0.Profile.Bundle> {
    protected getHeaderClass(): UI.MIOClassName {
        return "zaeb";
    }

    static mappings = [...Mappings.Basic];

    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected showPatient(): boolean {
        const { entry } = this.props;
        if (entry) {
            return (
                ZAEB.V1_1_0.Profile.ObservationDentalCheckUp.is(entry.resource) ||
                ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(entry.resource)
            );
        } else {
            return false;
        }
    }

    protected getPatient(): MIOEntry<ZAEB.V1_1_0.Profile.Patient> | undefined {
        const { mio, entry } = this.props;
        const resource = entry?.resource;

        if (
            resource &&
            (ZAEB.V1_1_0.Profile.ObservationDentalCheckUp.is(resource) ||
                ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(resource))
        ) {
            return Util.ZB.getPatientByRef(
                mio as ZAEB.V1_1_0.Profile.Bundle,
                new Reference(resource.subject.reference, entry?.fullUrl)
            );
        }
    }
}

export default SettingsConnector(MIOConnector(Detail));
