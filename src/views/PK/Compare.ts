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

import { MIOEntry, PKA } from "@kbv/mioparser";

export default class Compare {
    public static Consent(
        a: MIOEntry<PKA.V1_0_0.Profile.DPEConsentPersonalConsent>,
        b: MIOEntry<PKA.V1_0_0.Profile.DPEConsentPersonalConsent>
    ): number {
        if (
            PKA.V1_0_0.Profile.DPEConsentPersonalConsent.is(a.resource) &&
            PKA.V1_0_0.Profile.DPEConsentPersonalConsent.is(b.resource)
        ) {
            if (a.resource.dateTime && b.resource.dateTime) {
                const dateA = new Date(a.resource.dateTime).getTime();
                const dateB = new Date(b.resource.dateTime).getTime();
                return dateB - dateA;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
}
