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

import { IM, ZB } from "../../../../components";

import Detail from "../";

describe("<Detail />", () => {
    type DetailValue = {
        testId: string;
        getFunctions: any[]; // eslint-disable-line
    } & TestUtil.HasMioString;

    const detailList: DetailValue[] = [
        {
            mioString: "IM",
            testId: "im-detail",
            getFunctions: [
                IM.Util.getPatient,
                IM.Util.getOrganization,
                IM.Util.getPractitioner,
                IM.Util.getPractitioners,
                IM.Util.getRecord,
                IM.Util.getRecordAddendum,
                IM.Util.getRecordPrime
            ]
        },
        {
            mioString: "ZB",
            testId: "zb-detail",
            getFunctions: [
                ZB.Util.getPatient,
                ZB.Util.getOrganization,
                ZB.Util.getObservation,
                ZB.Util.getGaplessDocumentation
            ]
        }
    ];

    const mioParser = new MIOParser();

    const detailTest = (bundles: string[], detail: DetailValue) => {
        detail.getFunctions.forEach((func) => {
            describe(func.name, () => {
                bundles.forEach((file) => {
                    it(file, async (done) => {
                        const blob = new Blob([fs.readFileSync(file)]);
                        const result = await mioParser.parseFile(blob);
                        const bundle = result.value as KBVBundleResource;
                        const store = ViewerTestUtil.createStoreWithMios([bundle]);

                        const entryFound = func(bundle);

                        const renderDetail = (
                            entry: { fullUrl: string },
                            arr: boolean
                        ): void => {
                            const mioId = ParserUtil.getUuidFromBundle(bundle);
                            const entryId = entry
                                ? ParserUtil.getUuidFromEntry(entry)
                                : "-";

                            const {
                                getByTestId,
                                getAllByTestId
                            } = ViewerTestUtil.renderReduxRoute(
                                Detail,
                                store,
                                `/entry/${mioId}/${entryId}`,
                                "/entry/:id/:entry"
                            );

                            if (entry) {
                                if (arr) {
                                    expect(getAllByTestId(detail.testId)).toBeDefined();
                                } else {
                                    expect(getByTestId(detail.testId)).toBeDefined();
                                }
                            } else {
                                expect(getByTestId("error-list")).toBeDefined();
                            }
                        };

                        if (Array.isArray(entryFound)) {
                            entryFound.forEach((e) => {
                                renderDetail(e, true);
                            });
                        } else {
                            renderDetail(entryFound, false);
                        }

                        done();
                    });
                });
            });
        });
    };

    TestUtil.runAll<DetailValue>(
        "Rendert",
        detailList,
        detailTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
