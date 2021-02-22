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

import React from "react";
import fs from "fs";

import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, { ZAEB } from "@kbv/mioparser";

import Overview from "../Overview";

describe("<ZB.Overview />", () => {
    const mioParser = new MIOParser();

    const detailTest = (file: string) => {
        it(file, async (done) => {
            const blob = new Blob([fs.readFileSync(file)]);
            const result = await mioParser.parseFile(blob);
            const mio = result.value as ZAEB.V1_00_000.Profile.Bundle;
            const history = createMemoryHistory();
            history.push(`/mio/${mio.identifier.value.split("/").pop()}`);

            const { getByTestId, getByText } = render(
                <Overview mio={mio} history={history} />
            );

            const overview = getByTestId("zb-overview");
            expect(overview).toBeDefined();

            expect(getByTestId("patient-card")).toBeDefined();

            expect(getByText("Bonusheft Einträge")).toBeDefined();
            const detailList = getByTestId("detail-list");
            expect(detailList).toBeDefined();
            const listItems = detailList.getElementsByClassName("list-item");
            expect(listItems.length).toBeGreaterThan(0);

            done();
        });
    };

    TestUtil.runAllFiles(
        "Rendert",
        [{ mioString: "ZB" }],
        detailTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
