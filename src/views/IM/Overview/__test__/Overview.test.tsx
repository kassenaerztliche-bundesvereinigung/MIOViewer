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

import React from "react";
import fs from "fs";

import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { ParserUtil, Vaccination } from "@kbv/mioparser";

import Overview from "../Overview";

describe("<IM.Overview />", () => {
    const mioParser = new MIOParser();

    const renderTest = (file: string) => {
        it(file, async () => {
            const blob = new File([fs.readFileSync(file)], "test.file");
            const result = await mioParser.parseFile(blob);
            const bundle = result.value as Vaccination.V1_1_0.Profile.BundleEntry;
            const history = createMemoryHistory();
            history.push(`/mio/${ParserUtil.getUuidFromBundle(bundle)}`);

            const { getByTestId } = render(<Overview mio={bundle} history={history} />);

            expect(getByTestId("im-overview")).toBeDefined();
            expect(getByTestId("patient-card")).toBeDefined();
        });
    };

    TestUtil.runAllFiles(
        "Rendert",
        [{ mio: "IM" }],
        renderTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
