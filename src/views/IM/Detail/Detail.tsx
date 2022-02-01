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
import { Util, UI } from "../../../components/";

import DetailBase from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";

import { Vaccination } from "@kbv/mioparser";
import Mappings from "../Mappings";

class Detail extends DetailBase<Vaccination.V1_1_0.Profile.BundleEntry> {
    protected getHeaderClass(): UI.MIOClassName {
        return "impfpass";
    }

    static mappings = [...Mappings.Basic];

    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected showPatient(): boolean {
        const { entry } = this.props;
        if (entry) {
            return (
                Vaccination.V1_1_0.Profile.RecordPrime.is(entry.resource) ||
                Vaccination.V1_1_0.Profile.RecordAddendum.is(entry.resource) ||
                Vaccination.V1_1_0.Profile.ObservationImmunizationStatus.is(
                    entry.resource
                ) ||
                Vaccination.V1_1_0.Profile.Condition.is(entry.resource)
            );
        } else {
            return false;
        }
    }

    protected getPatient() {
        const { mio } = this.props;
        return Util.IM.getPatient(mio as Vaccination.V1_1_0.Profile.BundleEntry);
    }
}

export default SettingsConnector(MIOConnector(Detail));
