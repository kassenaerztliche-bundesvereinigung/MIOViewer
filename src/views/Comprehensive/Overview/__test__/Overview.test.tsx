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

import fs from "fs";

import * as ViewerTestUtil from "../../../../TestUtil";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { ParserUtil, KBVBundleResource } from "@kbv/mioparser";

import Overview from "../Overview";

describe("<Overview />", () => {
    const mioParser = new MIOParser();

    type MIOValue = {
        testId: string | RegExp;
        version?: string;
    } & TestUtil.MIOType;

    const mioList: MIOValue[] = [
        {
            mio: "IM",
            testId: "im-overview"
        },
        {
            mio: "ZB",
            testId: "zb-overview"
        },
        {
            mio: "MR",
            version: "1.1.0",
            testId: "mp-overview"
        },
        {
            mio: "UH",
            testId: /(cmr-overview)|(cmr-pc-overview)|(cmr-pn-overview)/
        },
        {
            mio: "PKA",
            testId: "pka-overview"
        }
    ];

    const overviewTest = (file: string, value: MIOValue, version?: string) => {
        if (value.version && value.version !== version) {
            return;
        }
        it(`${file}`, async () => {
            const blob = new File([fs.readFileSync(file)], "test.file");
            const result = await mioParser.parseFile(blob);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const mioRef = ParserUtil.getUuidFromBundle(bundle);

            const { getByTestId } = await ViewerTestUtil.renderReduxRoute(
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

        const { getByTestId } = await ViewerTestUtil.renderReduxRoute(
            Overview,
            store,
            "/mio/0}",
            "/mio/:id"
        );

        expect(getByTestId("error-list")).toBeDefined();
    });

    it("Zurück Button führt zu Main", async () => {
        const store = ViewerTestUtil.createStoreWithMios([]);

        const { getAllByText } = await ViewerTestUtil.renderReduxRoute(
            Overview,
            store,
            "/mio/0}",
            "/mio/:id"
        );

        expect(getAllByText("Sorry")).toBeDefined();
    });
});
