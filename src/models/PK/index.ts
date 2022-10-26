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

import Patient from "./Patient";
import Practitioner from "./Practitioner";
import PractitionerRole from "./PractitionerRole";
import Consent from "./Consent";
import AllergyIntolerance from "./AllergyIntolerance";
import AllergyIntoleranceReaction from "./AllergyIntoleranceReaction";
import DeviceImplant from "./DeviceImplant";
import DeviceUseStatement from "./DeviceUseStatement";
import Observation, { ObservationType } from "./Observation";
import Organization from "./Organization";
import Condition from "./Condition";
import Medication from "./Medication";
import MedicationStatement from "./MedicationStatement";
import Procedure from "./Procedure";
import RelatedPerson from "./RelatedPerson";

export type { ObservationType };

export {
    Patient,
    Practitioner,
    PractitionerRole,
    Consent,
    AllergyIntolerance,
    AllergyIntoleranceReaction,
    DeviceImplant,
    DeviceUseStatement,
    Observation,
    Organization,
    Condition,
    Medication,
    MedicationStatement,
    Procedure,
    RelatedPerson
};
