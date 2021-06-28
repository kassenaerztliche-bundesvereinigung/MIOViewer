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

import { MIOEntry, MR } from "@kbv/mioparser";
import { Util } from "../../components";

export default class Compare {
    public static StampInformation(
        a: MIOEntry<MR.V1_0_0.Profile.Organization | MR.V1_0_0.Profile.Practitioner>,
        b: MIOEntry<MR.V1_0_0.Profile.Organization | MR.V1_0_0.Profile.Practitioner>
    ): number {
        if (
            MR.V1_0_0.Profile.Practitioner.is(a.resource) &&
            MR.V1_0_0.Profile.Organization.is(b.resource)
        ) {
            return -1;
        } else if (
            MR.V1_0_0.Profile.Practitioner.is(b.resource) &&
            MR.V1_0_0.Profile.Organization.is(a.resource)
        ) {
            return 1;
        } else if (
            MR.V1_0_0.Profile.Organization.is(a.resource) &&
            MR.V1_0_0.Profile.Organization.is(b.resource)
        ) {
            const aName = a.resource.name;
            const bName = b.resource.name;
            if (aName && bName) {
                if (aName > bName) return -1;
                if (aName < bName) return 1;
            }
        } else if (
            MR.V1_0_0.Profile.Practitioner.is(a.resource) &&
            MR.V1_0_0.Profile.Practitioner.is(b.resource)
        ) {
            const aName = Util.MP.getPractitionerName(a.resource);
            const bName = Util.MP.getPractitionerName(b.resource);
            if (aName && bName) {
                if (aName > bName) return -1;
                if (aName < bName) return 1;
            }
        }

        return 0;
    }

    public static Appointment(
        a: MIOEntry<
            | MR.V1_0_0.Profile.AppointmentPregnancy
            | MR.V1_0_0.Profile.EncounterArrivalMaternityHospital
        >,
        b: MIOEntry<
            | MR.V1_0_0.Profile.AppointmentPregnancy
            | MR.V1_0_0.Profile.EncounterArrivalMaternityHospital
        >
    ): number {
        if (
            MR.V1_0_0.Profile.AppointmentPregnancy.is(a.resource) &&
            MR.V1_0_0.Profile.AppointmentPregnancy.is(b.resource)
        ) {
            const dateA = new Date(a.resource.start).getTime();
            const dateB = new Date(b.resource.start).getTime();
            return dateB - dateA;
        }

        return 0;
    }

    public static DateDetermination(
        a: MIOEntry<
            | MR.V1_0_0.Profile.ObservationCalculatedDeliveryDate
            | MR.V1_0_0.Profile.ObservationDateDeterminationChildbirth
            | MR.V1_0_0.Profile.ObservationDateOfConception
            | MR.V1_0_0.Profile.ObservationDeterminationOfPregnancy
            | MR.V1_0_0.Profile.ObservationMenstrualCycle
        >,
        b: MIOEntry<
            | MR.V1_0_0.Profile.ObservationCalculatedDeliveryDate
            | MR.V1_0_0.Profile.ObservationDateDeterminationChildbirth
            | MR.V1_0_0.Profile.ObservationDateOfConception
            | MR.V1_0_0.Profile.ObservationDeterminationOfPregnancy
            | MR.V1_0_0.Profile.ObservationMenstrualCycle
        >
    ): number {
        const timeA = a.resource.effectiveDateTime;
        const timeB = b.resource.effectiveDateTime;
        if (MR.V1_0_0.Profile.ObservationDateDeterminationChildbirth.is(a.resource)) {
            return 1;
        } else if (
            MR.V1_0_0.Profile.ObservationDateDeterminationChildbirth.is(b.resource)
        ) {
            return -1;
        } else if (timeA && timeB) {
            const dateA = new Date(timeA).getTime();
            const dateB = new Date(timeB).getTime();
            return dateB - dateA;
        }

        return 0;
    }
}
