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

import Detail from "../Detail";

import MIOParser, {
    ParserUtil,
    KBVBundleResource,
    Vaccination,
    ZAEB
} from "@kbv/mioparser";

import * as ModelsZB from "../../models/ZB";
import * as ModelsIM from "../../models/IM";
import { AddressModel, Model, TelecomModel } from "../../models";
import { History } from "history";

describe("<Components.Detail />", () => {
    const mioParser = new MIOParser();
    const routerProps = ViewerTestUtil.createRouteProps();

    type DetailsValue = {
        bundle:
            | typeof Vaccination.V1_00_000.Profile.BundleEntry
            | typeof ZAEB.V1_00_000.Profile.Bundle;
        definitions: {
            profile: any; // eslint-disable-line
            models?: (new (
                value: any, // eslint-disable-line
                parent: KBVBundleResource,
                history?: History
            ) => Model)[];
            component: React.ComponentType<any>; // eslint-disable-line
            testId?: string;
            required: string[];
            contain: (string | RegExp)[];
        }[];
    } & TestUtil.HasMioString;

    const detailList: DetailsValue[] = [
        {
            mioString: "IM",
            bundle: Vaccination.V1_00_000.Profile.BundleEntry,
            definitions: [
                {
                    profile: Vaccination.V1_00_000.Profile.RecordAddendum,
                    models: [ModelsIM.RecordAddendumModel],
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
                    profile: Vaccination.V1_00_000.Profile.RecordPrime,
                    models: [ModelsIM.RecordPrimeModel],
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
                    profile: Vaccination.V1_00_000.Profile.Condition,
                    models: [ModelsIM.ConditionModel],
                    component: Detail,
                    required: ["Dokumentiert am"],
                    contain: [
                        "Erkrankt als",
                        "Anmerkungen zur Erkrankung",
                        "Dokumentiert von"
                    ]
                },
                {
                    profile: Vaccination.V1_00_000.Profile.ObservationImmunizationStatus,
                    models: [ModelsIM.ObservationModel],
                    component: Detail,
                    required: ["Datum des Tests", "Ergebnis"],
                    contain: ["Anmerkungen zum durchgeführten Test", "Dokumentiert von"]
                },
                {
                    profile: Vaccination.V1_00_000.Profile.Organization,
                    models: [
                        ModelsIM.OrganizationModel,
                        AddressModel,
                        TelecomModel,
                        ModelsIM.AdditionalCommentModel
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
                    profile: Vaccination.V1_00_000.Profile.Patient,
                    models: [ModelsIM.PatientModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [
                        /(GKV)|(PID)|(PKV)|(kvk)|Reisepassnummer/,
                        "Geschlecht",
                        /divers|unbestimmt|männlich|weiblich|-/
                    ]
                },
                {
                    profile: Vaccination.V1_00_000.Profile.Practitioner,
                    models: [
                        ModelsIM.PractitionerModel,
                        TelecomModel,
                        ModelsIM.AdditionalCommentModel
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
                    profile: Vaccination.V1_00_000.Profile.PractitionerAddendum,
                    component: Detail,
                    models: [
                        ModelsIM.PractitionerModel,
                        TelecomModel,
                        ModelsIM.AdditionalCommentModel
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
            bundle: ZAEB.V1_00_000.Profile.Bundle,
            definitions: [
                {
                    profile: ZAEB.V1_00_000.Profile.GaplessDocumentation,
                    models: [ModelsZB.GaplessDocumentationModel],
                    component: Detail,
                    required: ["Datum", "Eintrag durch", "Datum des Eintrags"],
                    contain: [
                        "Datum, seit dem eine lückenlose Dokumentation in dem Papier-Zahnbonusheft nachweislich vorliegt.",
                        "Allgemeiner Hinweis"
                    ]
                },
                {
                    profile: ZAEB.V1_00_000.Profile.Observation,
                    models: [ModelsZB.ObservationModel],
                    component: Detail,
                    required: [
                        "Art der Untersuchung",
                        "Eintrag durch",
                        "Datum des Eintrags"
                    ],
                    contain: []
                },
                {
                    profile: ZAEB.V1_00_000.Profile.Organization,
                    models: [ModelsZB.OrganizationModel, AddressModel, TelecomModel],
                    component: Detail,
                    required: ["Postleitzahl"],
                    contain: [/(IKNR)|(BSNR)|(ZANR)/, "Anschrift", "Kontaktinformationen"]
                },
                {
                    profile: ZAEB.V1_00_000.Profile.Patient,
                    models: [ModelsZB.PatientModel, AddressModel],
                    component: Detail,
                    required: ["Geburtsdatum"],
                    contain: [
                        /(GKV)|(PID)/,
                        "Anschrift",
                        "Straße",
                        "Hausnummer",
                        "Adresszusatz",
                        "Postleitzahl",
                        "Stadt",
                        "Land"
                    ]
                }
            ]
        }
    ];

    const renderTest = (bundles: string[], details: DetailsValue) => {
        // TODO: Weird error: details not defined
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        type BundleType = details.bundle;
        details.definitions.forEach((definition) => {
            describe(`<${definition.component.displayName} /> (${definition.profile.name})`, () => {
                const models = definition.models;

                bundles.forEach((file) => {
                    it(file, async (done) => {
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
                        done();
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
