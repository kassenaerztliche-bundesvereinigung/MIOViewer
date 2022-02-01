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

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { ParserUtil, KBVBundleResource } from "@kbv/mioparser";

import Overview from "../../views/Comprehensive/Overview/Overview";
import PDFMaker from "../PDFMaker";

describe("<PDF />", () => {
    const mioParser = new MIOParser();

    const detailList: TestUtil.HasMioString[] = [
        { mioString: "IM" },
        { mioString: "ZB" },
        { mioString: "MR" },
        { mioString: "UH" }
    ];

    const renderTest = (bundles: string[]) => {
        bundles.forEach((file) => {
            it(file, async () => {
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

                const pdfButton = getByTestId("pdf-button");
                expect(pdfButton).toBeDefined();

                PDFMaker.create(bundle).then((pdfResult) => {
                    expect(pdfResult).toBeDefined();
                    expect(pdfResult.print).toBeDefined();
                });
            });
        });
    };

    TestUtil.runAll(
        "Rendert",
        detailList,
        renderTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
