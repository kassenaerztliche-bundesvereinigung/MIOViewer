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

import React from "react";
import fs from "fs";
import { render } from "@testing-library/react";

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, { ZAEB } from "@kbv/mioparser";

import { ZB, IM } from "../";
import PatientDetailList from "../PatientDetailList";

describe("<PatientDetailList />", () => {
    const mioParser = new MIOParser();

    type RenderValue = {
        getFunction: any; // eslint-disable-line
    } & TestUtil.HasMioString;

    const renderList: RenderValue[] = [
        {
            mioString: "IM",
            getFunction: IM.Util.getPatient
        },
        {
            mioString: "ZB",
            getFunction: ZB.Util.getPatient
        }
    ];

    const renderTest = (file: string, value: RenderValue) => {
        it(file, async (done) => {
            const blob = new Blob([fs.readFileSync(file)]);
            const result = await mioParser.parseFile(blob);
            const bundle = result.value as ZAEB.V1_00_000.Profile.Bundle;

            const entry = value.getFunction(bundle);

            const routerProps = ViewerTestUtil.createRouteProps();

            expect(entry).toBeDefined();
            if (entry) {
                const { getByTestId } = render(
                    <PatientDetailList
                        mio={bundle}
                        entry={entry.resource}
                        history={routerProps.history}
                        match={routerProps.match}
                        location={routerProps.location}
                    />
                );

                ViewerTestUtil.listItemMustBeDefined("Name", getByTestId);
                ViewerTestUtil.listItemMustBeDefined("Geburtsdatum", getByTestId);
            }

            done();
        });
    };

    TestUtil.runAllFiles<RenderValue>(
        "Rendert",
        renderList,
        renderTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
