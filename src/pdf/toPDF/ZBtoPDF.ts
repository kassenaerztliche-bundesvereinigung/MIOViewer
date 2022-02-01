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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, ZAEB, Reference } from "@kbv/mioparser";
import { Util } from "../../components";

import * as Models from "../../models";

import { horizontalLine } from "../PDFHelper";
import PDFRepresentation from "../PDFRepresentation";

export default class ZBtoPDF extends PDFRepresentation<ZAEB.V1_1_0.Profile.Bundle> {
    constructor(value: ZAEB.V1_1_0.Profile.Bundle) {
        super(value, "Bonushefteintrag", "s");
    }

    public getContent(): Content {
        const observations = Util.ZB.getEntries(this.value);

        const contentObservations = observations.map((o) => {
            if (ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(o.resource)) {
                const model = new Models.ZB.GaplessDocumentationModel(
                    o.resource,
                    o.fullUrl,
                    this.value
                );
                return model.toPDFContent();
            } else {
                const model = new Models.ZB.ObservationModel(
                    o.resource,
                    o.fullUrl,
                    this.value
                );
                return model.toPDFContent();
            }
        });

        return [
            this.getHeading(),
            {
                text: "Bonshefteinträge",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            contentObservations,
            horizontalLine
        ];
    }

    public getHeading(): Content {
        const composition = ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Composition>(
            this.value,
            [ZAEB.V1_1_0.Profile.Composition]
        );

        const title = composition ? composition.resource.title : "-";
        const ref = composition?.resource.author[0].reference;
        const date = composition?.resource.date;

        let authorContent: Content | undefined = undefined;
        if (ref) {
            const organization = Util.ZB.getOrganization(
                this.value,
                new Reference(ref, composition?.fullUrl)
            );

            if (organization && organization.resource) {
                const organizationModel = new Models.ZB.OrganizationModel(
                    organization.resource,
                    organization.fullUrl,
                    this.value
                );
                const address = new Models.AddressModel(
                    organization.resource,
                    organization.fullUrl,
                    this.value
                );
                const telecom = new Models.TelecomModel(
                    organization.resource,
                    organization.fullUrl,
                    this.value
                );

                authorContent = [
                    [horizontalLine],
                    organizationModel.toPDFContent(["subTable"]),
                    address.toPDFContent(["subTable"]),
                    telecom.toPDFContent(["subTable"])
                ];
            }
        }

        const patientResource = Util.ZB.getPatient(this.value);

        let patientContent = undefined;
        if (patientResource) {
            const model = new Models.ZB.PatientModel(
                patientResource.resource,
                patientResource.fullUrl,
                this.value
            );
            const address = new Models.AddressModel(
                patientResource.resource,
                patientResource.fullUrl,
                this.value
            );
            patientContent = [model.toPDFContent(), address.toPDFContent()];
        }

        return this.headingContent(title, date, authorContent, patientContent);
    }
}
