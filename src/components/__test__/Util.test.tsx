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

import fs from "fs";

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "miotestdata";

import MIOParser, { Vaccination, ZAEB } from "@kbv/mioparser";

import { Util } from "../";
import { formatDate, getPatientIdentifier } from "../Util/Misc";

describe("<Util/>", () => {
    const mioParser = new MIOParser();

    type UtilValue = {
        functions: any[]; // eslint-disable-line
    } & TestUtil.HasMioString;

    const utilList: UtilValue[] = [
        {
            mioString: "IM",
            functions: [
                Util.IM.getPatient,
                Util.IM.getPractitioners,
                Util.IM.getRecord,
                Util.IM.getOrganization,
                Util.IM.getOrganizations
            ]
        },
        {
            mioString: "ZB",
            functions: [Util.ZB.getPatient, Util.ZB.getOrganization, Util.ZB.getEntries]
        },
        {
            mioString: "MR",
            functions: [Util.MP.getPatientMother]
        },
        {
            mioString: "UH",
            functions: [Util.UH.getPatient, Util.UH.getTypeFromBundle]
        }
    ];

    const detailTest = (bundles: string[], value: UtilValue) => {
        value.functions.forEach((func) => {
            describe(func.name, () => {
                bundles.forEach((file) => {
                    it(`${file}`, async (done) => {
                        const blob = new Blob([fs.readFileSync(file)]);
                        const result = await mioParser.parseFile(blob);
                        const bundle = result.value;

                        const entry = func(bundle);
                        expect(entry).toBeDefined();
                        done();
                    });
                });
            });
        });
    };

    TestUtil.runAll<UtilValue>(
        "Test utility functions",
        utilList,
        detailTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );

    describe("getPatientName", () => {
        const values = [
            {
                in: `{
                    "resourceType": "Patient",
                    "name": [
                        {
                            "use": "official",
                            "text": "A B",
                            "family": "B",
                            "given": ["A"],
                            "prefix": ["Dr."]
                        }
                    ]
                }`,
                out: "Dr. A B"
            },
            {
                in: `{
                    "resourceType": "Patient",
                    "name": [
                        {
                            "use": "official",
                            "_family": {
                                "extension": [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
                                        "valueString": "von"
                                    },
                                    {
                                        "url": "http://fhir.de/StructureDefinition/humanname-namenszusatz",
                                        "valueString": "Prinz"
                                    },
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-name",
                                        "valueString": "B"
                                    }
                                ]
                            },
                            "given": ["A"]
                        }
                    ]
                }`,
                out: "A Prinz von B"
            }
        ];

        const profiles = [
            {
                patient: Vaccination.V1_00_000.Profile.Patient,
                getFunction: Util.IM.getPatientName
            },
            {
                patient: ZAEB.V1_00_000.Profile.Patient,
                getFunction: Util.ZB.getPatientName
            }
        ];

        profiles.forEach((profile) => {
            test(profile.patient.name, (done) => {
                values.forEach((value) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const patient = JSON.parse(value.in) as profile.patient;
                    const name = profile.getFunction(patient);
                    expect(name).toBe(value.out);
                });
                done();
            });
        });
    });

    test("formatDate", (done) => {
        expect(formatDate(undefined)).toBe("-");
        expect(formatDate("01-01-2020").split(".").length).toBe(3);
        done();
    });

    test("getPatientIdentifier", (done) => {
        const id = getPatientIdentifier({
            identifier: [
                {
                    system: "http://fhir.de/NamingSystem/gkv/kvid-10",
                    value: "1234567890"
                }
            ]
        } as Vaccination.V1_00_000.Profile.Patient)[0];
        expect(id.label).toBe("Versichertennummer (GKV)");
        done();
    });
});
