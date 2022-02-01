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

import { History } from "history";

import { MR, AnyType } from "@kbv/mioparser";
import { InformationAboutModel } from "./index";
import * as Models from "../index";

export default class InformationAboutMotherModel extends InformationAboutModel {
    constructor(
        value:
            | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthMother
            | MR.V1_1_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        const PR = MR.V1_1_0.Profile;
        const CM = MR.V1_1_0.ConceptMap;

        const mappings = [
            // Epikrise - Erste Untersuchung
            {
                profile: PR.ObservationPuerperiumNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationGynecologicalFindingNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationAntiDProphylaxisPostPartum,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationAdviceOnIodineIntake,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationBloodPressure,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Zweite Untersuchung
            {
                profile: PR.ObservationBreastfeedingBehavior,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [CM.BreastfeedingBehaviorGerman]
            },
            {
                profile: PR.ObservationUrine,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationUrineSugar,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationUrineProtein,
                models: [Models.MP.Basic.ObservationModel]
            }
        ];

        const sectionStack: AnyType[] = [
            PR.CompositionUntersuchungen,
            PR.CompositionUntersuchungenEpikrise
        ];

        if (PR.ClinicalImpressionFirstExaminationAfterChildbirthMother.is(value)) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseWochenbett,
                PR.CompositionUntersuchungenEpikriseWochenbettAngabenZurMutter
            );
        } else if (PR.ClinicalImpressionSecondExaminationAfterChildbirth.is(value)) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung,
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZurMutter
            );
        }

        super(value, fullUrl, parent, history, mappings, sectionStack);
        this.headline = "Angaben zur Mutter";
    }
}
