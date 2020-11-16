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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, ZAEB } from "@kbv/mioparser";
import { Util, ZB } from "../components";

import {
    PatientModel,
    GaplessDocumentationModel,
    ObservationModel,
    OrganizationModel
} from "../models/ZB";
import { AddressModel, TelecomModel } from "../models";
import { horizontalLine } from "./PDFMaker";

export function getZAEBContent(value: ZAEB.V1_00_000.Profile.Bundle): Content {
    const composition = ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Composition>(value, [
        ZAEB.V1_00_000.Profile.Composition
    ]);

    const title = composition ? composition.resource.title : "-";
    const ref = composition?.resource.author[0].reference;
    const date = composition?.resource.date;

    let authorContent: Content | undefined = undefined;
    if (ref) {
        const organization = ZB.Util.getOrganization(value, ref);

        if (organization && organization.resource) {
            const organizationModel = new OrganizationModel(organization.resource, value);
            const address = new AddressModel(organization.resource, value);
            const telecom = new TelecomModel(organization.resource, value);

            authorContent = [
                [horizontalLine],
                organizationModel.toPDFContent(["subTable"]),
                address.toPDFContent(["subTable"]),
                telecom.toPDFContent(["subTable"])
            ];
        }
    }

    const patientResource = ZB.Util.getPatient(value);

    let patient = {};

    if (patientResource) {
        const model = new PatientModel(patientResource.resource, value);
        const address = new AddressModel(patientResource.resource, value);
        patient = [model.toPDFContent(), address.toPDFContent()];
    }

    const observations = ParserUtil.getEntries<
        ZAEB.V1_00_000.Profile.Observation | ZAEB.V1_00_000.Profile.GaplessDocumentation
    >(value, [
        ZAEB.V1_00_000.Profile.Observation,
        ZAEB.V1_00_000.Profile.GaplessDocumentation
    ]);

    const observationsStr = observations.map((o) => {
        if (ZAEB.V1_00_000.Profile.GaplessDocumentation.is(o.resource)) {
            const model = new GaplessDocumentationModel(o.resource, value);
            return model.toPDFContent();
        } else {
            const model = new ObservationModel(o.resource, value);
            return model.toPDFContent();
        }
    });

    return [
        {
            layout: "noBorders",
            margin: [0, -16, 0, 0],
            table: {
                headerRows: 0,
                widths: ["40%", "*"],
                body: [
                    [{ text: title, style: "h3" }, ""],
                    [
                        { text: "Erstellungsdatum des Bonushefteintrags:", bold: true },
                        Util.formatDate(date)
                    ],
                    [
                        { text: "Bonushefteintrag erstellt von:", bold: true },
                        authorContent ? authorContent : "-"
                    ]
                ]
            }
        },
        horizontalLine,
        {
            text: "Patient/-in",
            margin: [0, 0, 0, 0],
            style: "h2"
        },
        horizontalLine,
        patient as Content,
        horizontalLine,
        {
            text: "Bonshefteinträge",
            margin: [0, 0, 0, 0],
            style: "h2"
        },
        horizontalLine,
        observationsStr,
        horizontalLine
    ];
}
