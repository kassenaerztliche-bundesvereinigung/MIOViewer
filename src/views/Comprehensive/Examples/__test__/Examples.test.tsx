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

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import Examples from "../";

describe("<Examples />", () => {
    ViewerTestUtil.mock();

    const renderTest = (file: string) => {
        it(file, async (done) => {
            const store = ViewerTestUtil.createStoreWithMios([]);
            const { getAllByText } = ViewerTestUtil.renderReduxRoute(
                Examples,
                store,
                "/examples",
                "/examples"
            );
            expect(getAllByText("MIO Beispiele")).toBeDefined();
            done();
        });
    };

    TestUtil.runAllBundleFiles("Rendert", renderTest, false);
});
