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

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, {
    ParserUtil,
    Vaccination,
    ZAEB,
    KBVBundleResource
} from "@kbv/mioparser";

import { IM, ZB } from "../../components";

import DetailIM from "../IM/Detail";
import DetailZB from "../ZB/Detail";

describe("<Detail-View />", () => {
    const mioParser = new MIOParser();

    type DetailValue = {
        component: React.ComponentType;
        details: {
            getFunction: any; // eslint-disable-line
            testId: string | undefined;
            profile: any; // eslint-disable-line
            required: string[];
        }[];
    } & TestUtil.HasMioString;

    const detailList: DetailValue[] = [
        {
            mioString: "IM",
            component: DetailIM,
            details: [
                {
                    getFunction: IM.Util.getPatient,
                    testId: "im-detail-patient",
                    profile: Vaccination.V1_00_000.Profile.Patient,
                    required: ["Geburtsdatum"]
                },
                {
                    getFunction: IM.Util.getOrganization,
                    testId: "im-detail-organization",
                    profile: Vaccination.V1_00_000.Profile.Organization,
                    required: []
                },
                {
                    getFunction: IM.Util.getRecordPrime,
                    testId: "im-detail-record",
                    profile: Vaccination.V1_00_000.Profile.RecordPrime,
                    required: []
                },
                {
                    getFunction: IM.Util.getRecordAddendum,
                    testId: "im-detail-record",
                    profile: Vaccination.V1_00_000.Profile.RecordAddendum,
                    required: ["Datum der Impfung"]
                },
                {
                    getFunction: IM.Util.getPractitioner,
                    testId: "im-detail-practitioner",
                    profile: Vaccination.V1_00_000.Profile.Practitioner,
                    required: ["Funktionsbezeichnung"]
                }
            ]
        },
        {
            mioString: "ZB",
            component: DetailZB,
            details: [
                {
                    getFunction: ZB.Util.getPatient,
                    testId: "zb-detail-patient",
                    profile: ZAEB.V1_00_000.Profile.Patient,
                    required: ["Geburtsdatum"]
                },
                {
                    getFunction: ZB.Util.getOrganization,
                    testId: "zb-detail-organization",
                    profile: ZAEB.V1_00_000.Profile.Organization,
                    required: []
                },
                {
                    getFunction: ZB.Util.getObservation,
                    testId: "zb-detail-observation",
                    profile: ZAEB.V1_00_000.Profile.Observation,
                    required: ["Art der Untersuchung", "Datum"]
                },
                {
                    getFunction: ZB.Util.getGaplessDocumentation,
                    testId: "zb-detail-gapless-documentation",
                    profile: ZAEB.V1_00_000.Profile.GaplessDocumentation,
                    required: ["Datum", "Eintrag durch", "Datum des Eintrags"]
                }
            ]
        }
    ];

    const detailTest = (bundles: string[], value: DetailValue) => {
        value.details.forEach((detail) => {
            describe(`${detail.getFunction.name.replace("get", "")} Details`, () => {
                bundles.forEach((file) => {
                    it(file, async (done) => {
                        const blob = new Blob([fs.readFileSync(file)]);
                        const result = await mioParser.parseFile(blob);
                        const bundle = result.value as Vaccination.V1_00_000.Profile.BundleEntry;
                        const store = ViewerTestUtil.createStoreWithMios([bundle]);
                        const entryFound = detail.getFunction(bundle);

                        const renderDetail = (
                            entry: { fullUrl: string },
                            arr: boolean
                        ): void => {
                            const mioId = ParserUtil.getUuidFromBundle(bundle);
                            const entryId = entry
                                ? ParserUtil.getUuidFromEntry(entry)
                                : "-";

                            const {
                                getAllByTestId,
                                getByTestId
                            } = ViewerTestUtil.renderReduxRoute(
                                value.component,
                                store,
                                `/entry/${mioId}/${entryId}`,
                                "/entry/:id/:entry"
                            );

                            if (entry) {
                                if (arr) {
                                    if (detail.testId) {
                                        expect(
                                            getAllByTestId(detail.testId)
                                        ).toBeDefined();
                                    }
                                    if (detail.profile.is(entry)) {
                                        detail.required.forEach((label) => {
                                            ViewerTestUtil.listItemMustBeDefined(
                                                label,
                                                getAllByTestId
                                            );
                                        });
                                    }
                                } else {
                                    if (detail.testId) {
                                        expect(getByTestId(detail.testId)).toBeDefined();
                                    }

                                    if (detail.profile.is(entry)) {
                                        detail.required.forEach((label) => {
                                            ViewerTestUtil.listItemMustBeDefined(
                                                label,
                                                getByTestId
                                            );
                                        });
                                    }
                                }
                            } else {
                                console.warn(`skipped: ${file}`);
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

    it("Rendert unbekanntes Detail IM", async (done) => {
        const file = TestUtil.getExample("/data/bundles/ZB/ZB_Ludger_Koenigsstein.xml");
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const entry = ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Patient>(bundle, [
                ZAEB.V1_00_000.Profile.Patient
            ]);

            const entryId = entry ? ParserUtil.getUuidFromEntry(entry) : "-";

            const { getByTestId, getAllByText } = ViewerTestUtil.renderReduxRoute(
                DetailIM,
                store,
                `/entry/${ParserUtil.getUuidFromBundle(bundle)}/${entryId}`,
                "/entry/:id/:entry"
            );

            expect(
                getAllByText(
                    "Das Detail zum Profil KBV_PR_MIO_ZAEB_Patient|1.00.000 kann nicht angezeigt werden"
                )
            ).toBeDefined();
            expect(getByTestId("error-list")).toBeDefined();
        }
        done();
    });

    it("Rendert unbekanntes Detail ZB", async (done) => {
        const file = TestUtil.getExample("/data/bundles/IM/IM_Ludger_Koenigsstein.json");
        expect(file).toBeDefined();
        if (file) {
            const result = await mioParser.parseString(file);
            const bundle = result.value as KBVBundleResource;
            const store = ViewerTestUtil.createStoreWithMios([bundle]);

            const entry = ParserUtil.getEntry<Vaccination.V1_00_000.Profile.Patient>(
                bundle,
                [Vaccination.V1_00_000.Profile.Patient]
            );

            const entryId = entry ? ParserUtil.getUuidFromEntry(entry) : "-";

            const { getByTestId, getAllByText } = ViewerTestUtil.renderReduxRoute(
                DetailZB,
                store,
                `/entry/${ParserUtil.getUuidFromBundle(bundle)}/${entryId}`,
                "/entry/:id/:entry"
            );

            expect(
                getAllByText(
                    "Das Detail zum Profil KBV_PR_MIO_Vaccination_Patient|1.00.000 kann nicht angezeigt werden"
                )
            ).toBeDefined();
            expect(getByTestId("error-list")).toBeDefined();
        }
        done();
    });
});
