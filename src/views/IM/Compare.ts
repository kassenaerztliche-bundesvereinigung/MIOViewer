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

import { MIOEntry, Vaccination } from "@kbv/mioparser";

export default class Compare {
    public static Record = (
        a: MIOEntry<
            | Vaccination.V1_1_0.Profile.RecordAddendum
            | Vaccination.V1_1_0.Profile.RecordPrime
        >,
        b: MIOEntry<
            | Vaccination.V1_1_0.Profile.RecordAddendum
            | Vaccination.V1_1_0.Profile.RecordPrime
        >
    ): number => {
        if (a.resource.occurrenceDateTime && b.resource.occurrenceDateTime) {
            const dateA = new Date(a.resource.occurrenceDateTime).getTime();
            const dateB = new Date(b.resource.occurrenceDateTime).getTime();
            return dateB - dateA;
        } else {
            return 0;
        }
    };

    public static Observation = (
        a: MIOEntry<Vaccination.V1_1_0.Profile.ObservationImmunizationStatus>,
        b: MIOEntry<Vaccination.V1_1_0.Profile.ObservationImmunizationStatus>
    ): number => {
        const dateA = new Date(a.resource.issued).getTime();
        const dateB = new Date(b.resource.issued).getTime();
        return dateB - dateA;
    };

    public static Condition = (
        a: MIOEntry<Vaccination.V1_1_0.Profile.Condition>,
        b: MIOEntry<Vaccination.V1_1_0.Profile.Condition>
    ): number => {
        const dateA = new Date(a.resource.recordedDate).getTime();
        const dateB = new Date(b.resource.recordedDate).getTime();
        return dateB - dateA;
    };
}
