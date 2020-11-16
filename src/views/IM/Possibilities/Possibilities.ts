/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

enum PossibilitiesType {
    VACCINATION = "vaccination",
    OBSERVATION = "observation",
    CONDITION = "condition"
}

type PossibilitiesList = {
    type: PossibilitiesType;
    headline: string;
    subline?: string;
};

const ListVaccination: PossibilitiesList = {
    type: PossibilitiesType.VACCINATION,
    headline: "Impfungen",
    subline:
        "Inklusive passive Immunisierungen mit humanen (oder heterologen) Immunglobulinen"
};

const ListObservation: PossibilitiesList = {
    type: PossibilitiesType.OBSERVATION,
    headline: "Immunreaktion (Tests)"
};

const ListCondition: PossibilitiesList = {
    type: PossibilitiesType.CONDITION,
    headline: "Erkrankungen, die zu einer Immunisierung geführt haben"
};

export { PossibilitiesType, ListVaccination, ListObservation, ListCondition };
