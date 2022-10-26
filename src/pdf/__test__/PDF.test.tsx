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

import * as ViewerTestUtil from "../../TestUtil";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { ParserUtil, KBVBundleResource } from "@kbv/mioparser";

import Overview from "../../views/Comprehensive/Overview/Overview";
import PDFMaker from "../PDFMaker";

describe("<PDF />", () => {
    const mioParser = new MIOParser();

    type TestValue = {
        version?: string;
    } & TestUtil.MIOType;

    const detailList: TestValue[] = [
        { mio: "IM" },
        { mio: "ZB" },
        { mio: "MR", version: "1.1.0" },
        { mio: "UH" }
    ];

    const renderTest = (bundles: string[], value: TestValue, version?: string) => {
        bundles.forEach((file) => {
            if (value.version && value.version !== version) {
                return;
            }
            it(file, async () => {
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
