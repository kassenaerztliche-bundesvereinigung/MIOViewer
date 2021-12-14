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

import MIOParser, { ParserUtil, MR } from "@kbv/mioparser";

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import OverviewSection from "../../../Comprehensive/OverviewSection";
import Detail from "../../../Comprehensive/Detail";

describe("Mutterpass Section Tests", () => {
    ViewerTestUtil.mock();

    const mioParser = new MIOParser();
    let bundle: MR.V1_0_0.Profile.Bundle | undefined = undefined;
    let store: any = undefined; // eslint-disable-line

    it("Loads max example", async () => {
        const file = TestUtil.getExample("/data/bundles/MR/Bundle-example_max.json");
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            bundle = result.value as MR.V1_0_0.Profile.Bundle;
            store = ViewerTestUtil.createStoreWithMios([bundle]);
        }
    });

    // eslint-disable-next-line
    const checkSub = (route: string, profile: string): any => {
        const { container, getByTestId } = ViewerTestUtil.renderReduxRoute(
            Detail,
            store,
            route,
            "/entry/:id/:entry"
        );
        expect(getByTestId(`detail-${profile}`)).toBeDefined();
        return container;
    };

    it("Renders Section Epicrisis", async () => {
        if (bundle) {
            const mioId = ParserUtil.getUuidFromBundle(bundle);

            const sectionId = "Epikrise";

            const { getByTestId } = ViewerTestUtil.renderReduxRoute(
                OverviewSection,
                store,
                `/section/${mioId}/${sectionId}`,
                "/section/:id/:section"
            );

            expect(getByTestId(`overview-section-${sectionId}`)).toBeDefined();

            // Schwangerschaft
            checkSub(
                `/entry/${mioId}/fbb02cfc-e23f-473f-b65d-a09f2aadcecb`,
                "MRClinicalImpressionPregnancyExaminationDischargeSummary"
            );

            // Geburt
            checkSub(
                `/entry/${mioId}/adba8172-4250-466b-baaf-6852c14f33a5`,
                "MRClinicalImpressionBirthExaminationDeliveryInformation"
            );

            // Wochenbett
            checkSub(
                `/entry/${mioId}/98b95351-c9cd-43c6-a787-152c19324d07`,
                "MRClinicalImpressionFirstExaminationAfterChildbirth"
            );

            // Zweite Untersuchung
            checkSub(
                `/entry/${mioId}/85aaf6e5-0d6f-476c-9d0b-a41556914a53`,
                "MRClinicalImpressionSecondExaminationAfterChildbirth"
            );
        }
    });
});
