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

import * as ViewerTestUtil from "../../../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, { ParserUtil, KBVBundleResource } from "@kbv/mioparser";

import { Util } from "../../../../components";

import Detail from "../";

describe("<Detail />", () => {
    type DetailValue = {
        values: {
            testId: string;
            getFunction: any; // eslint-disable-line
        }[];
    } & TestUtil.MIOType;

    const detailList: DetailValue[] = [
        {
            mio: "IM",
            values: [
                {
                    testId: "detail-VaccinationPatient",
                    getFunction: Util.IM.getPatient
                },
                {
                    testId: "detail-VaccinationOrganization",
                    getFunction: Util.IM.getOrganization
                },
                {
                    testId: "detail-VaccinationRecordAddendum",
                    getFunction: Util.IM.getRecordAddendum
                },
                {
                    testId: "detail-VaccinationRecordPrime",
                    getFunction: Util.IM.getRecordPrime
                }
            ]
        },
        {
            mio: "ZB",
            values: [
                {
                    testId: "detail-ZAEBPatient",
                    getFunction: Util.ZB.getPatient
                },
                {
                    testId: "detail-ZAEBOrganization",
                    getFunction: Util.ZB.getOrganization
                },
                {
                    testId: "detail-ZAEBObservationDentalCheckUp",
                    getFunction: Util.ZB.getObservationDentalCheckUp
                },
                {
                    testId: "detail-ZAEBObservationGaplessDocumentation",
                    getFunction: Util.ZB.getObservationGaplessDocumentation
                }
            ]
        }
    ];

    const mioParser = new MIOParser();

    const detailTest = (bundles: string[], detail: DetailValue) => {
        detail.values.forEach((value) => {
            describe(value.getFunction.name, () => {
                bundles.forEach((file) => {
                    it(file, async () => {
                        const blob = new File([fs.readFileSync(file)], "test.file");
                        const result = await mioParser.parseFile(blob);
                        const bundle = result.value as KBVBundleResource;
                        const store = ViewerTestUtil.createStoreWithMios([bundle]);

                        const entryFound = value.getFunction(bundle);

                        const renderDetail = (
                            entry: { fullUrl: string },
                            arr: boolean
                        ): void => {
                            const mioId = ParserUtil.getUuidFromBundle(bundle);
                            const entryId = entry
                                ? encodeURIComponent(entry.fullUrl)
                                : "-";

                            const { getByTestId, getAllByTestId } =
                                ViewerTestUtil.renderReduxRoute(
                                    Detail,
                                    store,
                                    `/entry/${mioId}/${entryId}`,
                                    "/entry/:id/:entry"
                                );

                            if (entry) {
                                if (arr) {
                                    expect(getAllByTestId(value.testId)).toBeDefined();
                                } else {
                                    expect(getByTestId(value.testId)).toBeDefined();
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
