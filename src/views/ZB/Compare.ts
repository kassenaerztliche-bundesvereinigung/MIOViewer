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

import { MIOEntry, ZAEB } from "@kbv/mioparser";

export default class Compare {
    public static Observation(
        a: MIOEntry<
            | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
            | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        >,
        b: MIOEntry<
            | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
            | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        >
    ): number {
        if (
            ZAEB.V1_1_0.Profile.ObservationDentalCheckUp.is(a.resource) &&
            ZAEB.V1_1_0.Profile.ObservationDentalCheckUp.is(b.resource)
        ) {
            if (a.resource.effectiveDateTime && b.resource.effectiveDateTime) {
                const dateA = new Date(a.resource.effectiveDateTime).getTime();
                const dateB = new Date(b.resource.effectiveDateTime).getTime();
                return dateB - dateA;
            } else {
                return 0;
            }
        } else if (
            ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(a.resource) &&
            ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(b.resource)
        ) {
            if (a.resource.valueDateTime && b.resource.valueDateTime) {
                const dateA = new Date(a.resource.valueDateTime).getTime();
                const dateB = new Date(b.resource.valueDateTime).getTime();
                return dateB - dateA;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
}
