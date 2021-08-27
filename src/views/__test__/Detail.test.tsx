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

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import MIOParser, {
    ParserUtil,
    AnyType,
    Vaccination,
    ZAEB,
    MR,
    CMR,
    KBVBundleResource
} from "@kbv/mioparser";

import { Util } from "../../components";

import DetailIM from "../IM/Detail";
import DetailZB from "../ZB/Detail";
import DetailMR from "../MP/Detail";
import DetailUH from "../UH/Detail";

describe("<Detail-View />", () => {
    const mioParser = new MIOParser();

    type DetailValue = {
        component: React.ComponentType;
        details: {
            getFunction: any; // eslint-disable-line
            testId: string | RegExp | undefined;
            profile: AnyType;
            required: string[];
        }[];
    } & TestUtil.HasMioString;

    const detailList: DetailValue[] = [
        {
            mioString: "IM",
            component: DetailIM,
            details: [
                {
                    getFunction: Util.IM.getPatient,
                    testId: "detail-VaccinationPatient",
                    profile: Vaccination.V1_1_0.Profile.Patient,
                    required: ["Geburtsdatum"]
                },
                {
                    getFunction: Util.IM.getOrganization,
                    testId: "detail-VaccinationOrganization",
                    profile: Vaccination.V1_1_0.Profile.Organization,
                    required: []
                },
                {
                    getFunction: Util.IM.getRecordPrime,
                    testId: "detail-VaccinationRecordPrime",
                    profile: Vaccination.V1_1_0.Profile.RecordPrime,
                    required: []
                },
                {
                    getFunction: Util.IM.getRecordAddendum,
                    testId: "detail-VaccinationRecordAddendum",
                    profile: Vaccination.V1_1_0.Profile.RecordAddendum,
                    required: ["Datum der Impfung"]
                },
                {
                    getFunction: Util.IM.getPractitioner,
                    testId: /(detail-VaccinationPractitioner)|(detail-VaccinationPractitionerAddendum)/,
                    profile: Vaccination.V1_1_0.Profile.Practitioner,
                    required: ["Funktionsbezeichnung"]
                }
            ]
        },
        {
            mioString: "ZB",
            component: DetailZB,
            details: [
                {
                    getFunction: Util.ZB.getPatient,
                    testId: "detail-ZAEBPatient",
                    profile: ZAEB.V1_1_0.Profile.Patient,
                    required: ["Geburtsdatum"]
                },
                {
                    getFunction: Util.ZB.getOrganization,
                    testId: "detail-ZAEBOrganization",
                    profile: ZAEB.V1_1_0.Profile.Organization,
                    required: []
                },
                {
                    getFunction: Util.ZB.getObservationDentalCheckUp,
                    testId: "detail-ZAEBObservationDentalCheckUp",
                    profile: ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
                    required: ["Art der Untersuchung", "Datum"]
                },
                {
                    getFunction: Util.ZB.getObservationGaplessDocumentation,
                    testId: "detail-ZAEBObservationGaplessDocumentation",
                    profile: ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation,
                    required: ["Datum", "Eintrag durch", "Datum des Eintrags"]
                }
            ]
        },
        {
            mioString: "MR",
            component: DetailMR,
            details: [
                {
                    getFunction: Util.MP.getPatientMother,
                    testId: "detail-MRPatientMother",
                    profile: MR.V1_0_0.Profile.PatientMother,
                    required: ["Geburtsdatum"]
                },
                {
                    getFunction: Util.MP.getAuthor,
                    testId: /(detail-MROrganization)|(detail-MRPractitioner)/,
                    profile: MR.V1_0_0.Profile.Organization,
                    required: []
                }
            ]
        },
        {
            mioString: "UH",
            component: DetailUH,
            details: [
                {
                    getFunction: Util.UH.getPatient,
                    testId: /(detail-CMRPatient)|(detail-PCPatient)|(detail-PNPatient)/,
                    profile: CMR.V1_0_0.Profile.CMRPatient,
                    required: ["Geburtsdatum"]
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
                        const bundle =
                            result.value as Vaccination.V1_1_0.Profile.BundleEntry;
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

                            const { getAllByTestId, getByTestId } =
                                ViewerTestUtil.renderReduxRoute(
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

            const entry = ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Patient>(bundle, [
                ZAEB.V1_1_0.Profile.Patient
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
                    "Das Detail zum Profil KBV_PR_MIO_ZAEB_Patient|1.1.0 kann nicht angezeigt werden"
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

            const entry = ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Patient>(
                bundle,
                [Vaccination.V1_1_0.Profile.Patient]
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
                    "Das Detail zum Profil KBV_PR_MIO_Vaccination_Patient|1.1.0 kann nicht angezeigt werden"
                )
            ).toBeDefined();
            expect(getByTestId("error-list")).toBeDefined();
        }
        done();
    });
});
