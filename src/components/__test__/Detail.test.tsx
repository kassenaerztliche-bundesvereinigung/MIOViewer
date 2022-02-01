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
import { render } from "@testing-library/react";
import { History } from "history";

import * as ViewerTestUtil from "../../../test/TestUtil.test";
import * as TestUtil from "@kbv/miotestdata";

import Detail from "../Detail/Detail";

import MIOParser, {
    ParserUtil,
    AnyType,
    Vaccination,
    ZAEB,
    MR,
    CMR
} from "@kbv/mioparser";

import * as Models from "../../models/";

describe("<Components.Detail />", () => {
    const mioParser = new MIOParser();
    const routerProps = ViewerTestUtil.createRouteProps();

    type DetailsValue = {
        bundle:
            | typeof Vaccination.V1_1_0.Profile.BundleEntry
            | typeof ZAEB.V1_1_0.Profile.Bundle
            | typeof MR.V1_1_0.Profile.Bundle
            | typeof CMR.V1_0_1.Profile.CMRBundle;
        definitions: {
            profile: AnyType;
            models?: (new (
                value: any, // eslint-disable-line
                fullUrl: string,
                parent: any, // eslint-disable-line
                history: History
            ) => Models.Model)[];
            component: React.ComponentType<any>; // eslint-disable-line
            testId?: string;
            required: string[];
            contain: (string | RegExp)[];
        }[];
    } & TestUtil.HasMioString;

    const detailList: DetailsValue[] = [
        {
            mioString: "IM",
            bundle: Vaccination.V1_1_0.Profile.BundleEntry,
            definitions: [
                {
                    profile: Vaccination.V1_1_0.Profile.RecordAddendum,
                    models: [Models.IM.RecordAddendumModel],
                    component: Detail,
                    required: [
                        "Datum der Impfung",
                        "Handelsname des Impfstoffes",
                        "Informationsquelle"
                    ],
                    contain: [
                        "Chargennummer des Impfstoffes",
                        "Hersteller des Impfstoffes",
                        "Terminvorschlag für die Folge- oder Auffrischimpfung",
                        "Einrichtung in der geimpft wurde",
                        "Impfung durch",
                        "Eintrag durch",
                        "Typ des Eintrages"
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.RecordPrime,
                    models: [Models.IM.RecordPrimeModel],
                    component: Detail,
                    required: [
                        "Datum der Impfung",
                        "Handelsname des Impfstoffes",
                        "Chargennummer des Impfstoffes"
                    ],
                    contain: [
                        "Hersteller des Impfstoffes",
                        "Terminvorschlag für die Folge- oder Auffrischimpfung",
                        "Einrichtung in der geimpft wurde",
                        "Impfung durch",
                        "Eintrag durch",
                        "Typ des Eintrages",
                        "Allgemeiner Hinweis für den Impfling oder Sorgeberechtigten"
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.Condition,
                    models: [Models.IM.ConditionModel],
                    component: Detail,
                    required: ["Dokumentiert am"],
                    contain: [
                        "Erkrankt als",
                        "Anmerkungen zur Erkrankung",
                        "Dokumentiert von"
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.ObservationImmunizationStatus,
                    models: [Models.IM.ObservationModel],
                    component: Detail,
                    required: ["Datum des Tests", "Ergebnis"],
                    contain: ["Anmerkungen zum durchgeführten Test"]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.Organization,
                    models: [
                        Models.IM.OrganizationModel,
                        Models.AddressModel,
                        Models.TelecomModel,
                        Models.AdditionalCommentModel
                    ],
                    component: Detail,
                    required: ["Postleitzahl"],
                    contain: [
                        /(IKNR)|(BSNR)|(Identifier)/,
                        "Anschrift",
                        "Kontaktinformationen"
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.Patient,
                    models: [Models.IM.PatientModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [
                        /(GKV)|(PID)|(PKV)|(kvk)|Reisepassnummer/,
                        "Geschlecht",
                        /divers|unbestimmt|männlich|weiblich|-/
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.Practitioner,
                    models: [
                        Models.IM.PractitionerModel,
                        Models.TelecomModel,
                        Models.AdditionalCommentModel
                    ],
                    component: Detail,
                    required: ["Funktionsbezeichnung"],
                    contain: [
                        "Geburtsname",
                        /(ANR)|(EFN)|(Nicht näher spezifizierter Identifikator)/,
                        "Kontaktinformationen"
                    ]
                },
                {
                    profile: Vaccination.V1_1_0.Profile.PractitionerAddendum,
                    component: Detail,
                    models: [
                        Models.IM.PractitionerModel,
                        Models.TelecomModel,
                        Models.AdditionalCommentModel
                    ],
                    required: [],
                    contain: [
                        "Geburtsname",
                        /(ANR)|(EFN)|(Nicht näher spezifizierter Identifikator)|Identifier/,
                        "Funktionsbezeichnung",
                        "Kontaktinformationen"
                    ]
                }
            ]
        },
        {
            mioString: "ZB",
            bundle: ZAEB.V1_1_0.Profile.Bundle,
            definitions: [
                {
                    profile: ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation,
                    models: [Models.ZB.GaplessDocumentationModel],
                    component: Detail,
                    required: ["Datum", "Eintrag durch", "Datum des Eintrags"],
                    contain: [
                        "Datum, seit dem eine lückenlose Dokumentation in dem Papier-Zahnbonusheft nachweislich vorliegt.",
                        "Allgemeiner Hinweis"
                    ]
                },
                {
                    profile: ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
                    models: [Models.ZB.ObservationModel],
                    component: Detail,
                    required: [
                        "Art der Untersuchung",
                        "Eintrag durch",
                        "Datum des Eintrags"
                    ],
                    contain: []
                },
                {
                    profile: ZAEB.V1_1_0.Profile.Organization,
                    models: [
                        Models.ZB.OrganizationModel,
                        Models.AddressModel,
                        Models.TelecomModel
                    ],
                    component: Detail,
                    required: ["Postleitzahl"],
                    contain: [/(IKNR)|(BSNR)|(KZVA)/, "Anschrift", "Kontaktinformationen"]
                },
                {
                    profile: ZAEB.V1_1_0.Profile.Patient,
                    models: [Models.ZB.PatientModel, Models.AddressModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [
                        /(GKV)|(PID)/,
                        "Anschrift",
                        "Adresszeile",
                        "Postleitzahl",
                        "Stadt",
                        "Land"
                    ]
                }
            ]
        },
        {
            mioString: "MR",
            bundle: MR.V1_1_0.Profile.Bundle,
            definitions: [
                {
                    profile: MR.V1_1_0.Profile.PatientMother,
                    models: [Models.MP.Basic.PatientMotherModel, Models.AddressModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [
                        /(GKV)|(PID)/,
                        "Anschrift",
                        "Adresszeile",
                        "Postleitzahl",
                        "Stadt",
                        "Land"
                    ]
                }
            ]
        },
        {
            mioString: "UH",
            bundle: CMR.V1_0_1.Profile.CMRBundle,
            definitions: [
                {
                    profile: CMR.V1_0_1.Profile.CMRPatient,
                    models: [Models.UH.Basic.PatientModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [/(kvk)|(GKV)|(PKV)|(PID)/]
                }
            ]
        }
    ];

    const renderTest = (bundles: string[], details: DetailsValue) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type BundleType = details.bundle;
        details.definitions.forEach((definition) => {
            describe(`<${definition.component.displayName} /> (${definition.profile.name})`, () => {
                const models = definition.models;

                bundles.forEach((file) => {
                    it(file, async () => {
                        const blob = new Blob([fs.readFileSync(file)]);
                        const result = await mioParser.parseFile(blob);
                        const bundle = result.value as BundleType;
                        const entries = ParserUtil.getEntries<typeof definition.profile>(
                            bundle,
                            [definition.profile]
                        );

                        expect(entries).toBeDefined();
                        if (entries.length) {
                            entries.forEach((entry) => {
                                const { container, getAllByText, getAllByTestId } =
                                    models && models.length
                                        ? render(
                                              <definition.component
                                                  mio={bundle}
                                                  entry={entry.resource}
                                                  history={routerProps.history}
                                                  match={routerProps.match}
                                                  location={routerProps.location}
                                                  models={models.map(
                                                      (model) =>
                                                          new model(
                                                              entry.resource,
                                                              entry.fullUrl,
                                                              bundle,
                                                              routerProps.history
                                                          )
                                                  )}
                                              />
                                          )
                                        : render(
                                              <definition.component
                                                  mio={bundle}
                                                  entry={entry.resource}
                                                  history={routerProps.history}
                                                  match={routerProps.match}
                                                  location={routerProps.location}
                                              />
                                          );
                                expect(container).toBeDefined();
                                if (definition.testId) {
                                    expect(
                                        getAllByTestId(definition.testId)
                                    ).toBeTruthy();
                                }

                                definition.required.forEach((value) => {
                                    ViewerTestUtil.listItemMustBeDefined(
                                        value,
                                        getAllByTestId
                                    );
                                });

                                definition.contain.forEach((value) => {
                                    expect(getAllByText(value)).toBeDefined();
                                });
                            });
                        } else {
                            console.warn(`skipped: ${file}`);
                        }
                    });
                });
            });
        });
    };

    TestUtil.runAll(
        "Rendert",
        detailList,
        renderTest,
        "Bundles",
        true,
        ViewerTestUtil.mock
    );
});
