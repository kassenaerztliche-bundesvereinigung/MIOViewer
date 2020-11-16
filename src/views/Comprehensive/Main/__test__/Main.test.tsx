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

import fs from "fs";

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, { KBVBundleResource } from "@kbv/mioparser";

import Main from "../";

describe("<Main />", () => {
    ViewerTestUtil.mock();
    const mioParser = new MIOParser();

    it("Rendert", async (done) => {
        const file = TestUtil.getExample("/data/bundles/IM/IM_Ludger_Koenigsstein.json");
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const { getByTestId, getAllByText } = ViewerTestUtil.renderReduxRoute(
                Main,
                store,
                "/main",
                "/main"
            );

            expect(getByTestId("main-view")).toBeDefined();
            expect(getAllByText("Meine MIOs").length).toBe(2);

            expect(getByTestId("slide-0")).toBeDefined();

            expect(getAllByText("Impfpass").length).toBe(1);
        }

        done();
    });

    const renderTest = (bundles: string[], value: TestUtil.HasMioString) => {
        it("mehrere Slider-Seiten", async (done) => {
            const mios: KBVBundleResource[] = [];
            for (let i = 0; i < bundles.length; i++) {
                const file = bundles[i];
                const blob = new Blob([fs.readFileSync(file)]);
                const result = await mioParser.parseFile(blob);
                mios.push(result.value as KBVBundleResource);
            }

            const store = ViewerTestUtil.createStoreWithMios([...mios]);

            const { getByTestId, getAllByText } = ViewerTestUtil.renderReduxRoute(
                Main,
                store,
                "/main",
                "/main"
            );

            expect(getByTestId("slide-0")).toBeDefined();
            const max = Math.floor(bundles.length / 9);
            expect(getByTestId(`slide-${max}`)).toBeDefined();
            expect(getByTestId("input-type-file")).toBeDefined();

            let text;
            if (value.mioString === "IM") {
                text = "Impfpass";
            } else if (value.mioString === "ZB") {
                text = "Zahnärztliches Bonusheft";
            }

            if (text) {
                expect(getAllByText(text).length).toBeGreaterThan(0);
            }

            done();
        });
    };

    TestUtil.runAllBundles("Rendert", renderTest);
});
