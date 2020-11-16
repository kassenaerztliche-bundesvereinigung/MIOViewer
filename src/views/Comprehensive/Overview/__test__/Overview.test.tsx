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

import MIOParser, { ParserUtil, KBVBundleResource } from "@kbv/mioparser";

import Overview from "../Overview";

describe("<Overview />", () => {
    const mioParser = new MIOParser();

    type MIOValue = {
        testId: string;
    } & TestUtil.HasMioString;
    const mioList: MIOValue[] = [
        {
            mioString: "IM",
            testId: "im-overview"
        },
        {
            mioString: "ZB",
            testId: "zb-overview"
        }
    ];

    const overviewTest = (file: string, value: MIOValue) => {
        it(`${file}`, async () => {
            const blob = new Blob([fs.readFileSync(file)]);
            const result = await mioParser.parseFile(blob);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const mioRef = ParserUtil.getUuidFromBundle(bundle);

            const { getByTestId } = ViewerTestUtil.renderReduxRoute(
                Overview,
                store,
                `/mio/${mioRef}`,
                "/mio/:id"
            );

            expect(getByTestId(value.testId)).toBeDefined();

            const headline = getByTestId("header-headline");
            expect(headline.style.opacity).toBe("1");
        });
    };

    TestUtil.runAllFiles<MIOValue>(
        "Rendert",
        mioList,
        overviewTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );

    it("Rendert Fehler Seite", async () => {
        const mio = {} as KBVBundleResource;
        const store = ViewerTestUtil.createStoreWithMios([mio]);

        const { getByTestId } = ViewerTestUtil.renderReduxRoute(
            Overview,
            store,
            "/mio/0}",
            "/mio/:id"
        );

        expect(getByTestId("error-list")).toBeDefined();
    });

    it("Zurück Button führt zu Main", (done) => {
        const store = ViewerTestUtil.createStoreWithMios([]);

        const { getAllByText } = ViewerTestUtil.renderReduxRoute(
            Overview,
            store,
            "/mio/0}",
            "/mio/:id"
        );

        expect(getAllByText("Sorry")).toBeDefined();

        done();
    });
});
