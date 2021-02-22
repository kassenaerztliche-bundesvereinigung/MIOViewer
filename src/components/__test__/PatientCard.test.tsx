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

import { render } from "@testing-library/react";

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, { Vaccination, ZAEB } from "@kbv/mioparser";

import { Util } from "../index";
import PatientCard from "../PatientCard";

describe("<PatientCard />", () => {
    type CardValue = {
        bundleType:
            | typeof Vaccination.V1_00_000.Profile.BundleEntry
            | typeof ZAEB.V1_00_000.Profile.Bundle;
        getFunction: any; // eslint-disable-line
    } & TestUtil.HasMioString;
    const cardList: CardValue[] = [
        {
            mioString: "IM",
            bundleType: Vaccination.V1_00_000.Profile.BundleEntry,
            getFunction: Util.IM.getPatient
        },
        {
            mioString: "ZB",
            bundleType: ZAEB.V1_00_000.Profile.Bundle,
            getFunction: Util.ZB.getPatient
        }
    ];

    const mioParser = new MIOParser();

    const cardTest = (file: string, card: CardValue) => {
        it(file, async () => {
            const blob = new Blob([fs.readFileSync(file)]);
            const result = await mioParser.parseFile(blob);
            const mio = result.value;
            const entry = card.getFunction(mio);

            expect(entry).toBeDefined();
            if (entry) {
                const { getByTestId } = render(<PatientCard patient={entry.resource} />);

                expect(getByTestId("patient-card")).toBeDefined();
                const headline = getByTestId("headline");
                expect(headline && headline.textContent).toBeDefined();
            }
        });
    };

    TestUtil.runAllFiles<CardValue>(
        "Rendert",
        cardList,
        cardTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );

    it("Rendert trotz fehlerhaftem Patienten", (done) => {
        const patient = {} as Vaccination.V1_00_000.Profile.Patient;
        const { getByTestId } = render(<PatientCard patient={patient} />);
        expect(getByTestId("headline")).toHaveTextContent("-");
        done();
    });
});
