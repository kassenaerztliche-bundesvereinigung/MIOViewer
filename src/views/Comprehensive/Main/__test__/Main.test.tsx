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

import * as ViewerTestUtil from "../../../../TestUtil";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { KBVBundleResource } from "@kbv/mioparser";

import Main from "../";

describe("<Main />", () => {
    ViewerTestUtil.mock();
    const mioParser = new MIOParser();

    it("Rendert", async () => {
        const file = TestUtil.getExample(
            "/data/bundles/IM/1.1.0/IM_Ludger_Koenigsstein.json"
        );
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const { getByTestId, getAllByText } = await ViewerTestUtil.renderReduxRoute(
                Main,
                store,
                "/main",
                "/main"
            );

            expect(getByTestId("main-view")).toBeDefined();
            expect(getAllByText("Meine MIOs").length).toBe(2);
        }
    });
});
