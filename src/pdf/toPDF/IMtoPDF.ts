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

import { ParserUtil, Reference, Vaccination } from "@kbv/mioparser";

import { AdditionalCommentModel, TelecomModel, IM } from "../../models";
import { horizontalLine } from "../PDFHelper";
import PDFRepresentation from "../PDFRepresentation";

export default class IMtoPDF extends PDFRepresentation<Vaccination.V1_1_0.Profile.BundleEntry> {
    constructor(value: Vaccination.V1_1_0.Profile.BundleEntry) {
        super(value, "Impfeintrag", "s");
    }

    public getContent(): Content {
        const recordsAddendum =
            ParserUtil.getEntries<Vaccination.V1_1_0.Profile.RecordAddendum>(this.value, [
                Vaccination.V1_1_0.Profile.RecordAddendum
            ]);

        let recordContent = recordsAddendum.map((r) => {
            const model = new IM.RecordAddendumModel(r.resource, r.fullUrl, this.value);
            return model.toPDFContent();
        });

        const recordsPrime =
            ParserUtil.getEntries<Vaccination.V1_1_0.Profile.RecordPrime>(this.value, [
                Vaccination.V1_1_0.Profile.RecordPrime
            ]);

        recordContent = [
            ...recordContent,
            recordsPrime.map((r) => {
                const model = new IM.RecordPrimeModel(r.resource, r.fullUrl, this.value);
                return model.toPDFContent();
            })
        ];

        if (!recordContent.length) {
            recordContent = [this.pdfContentHint("Impfungen", "Impfpass")];
        }

        const observations =
            ParserUtil.getEntries<Vaccination.V1_1_0.Profile.ObservationImmunizationStatus>(
                this.value,
                [Vaccination.V1_1_0.Profile.ObservationImmunizationStatus]
            );

        let observationsContent = observations.map((o) => {
            const model = new IM.ObservationModel(o.resource, o.fullUrl, this.value);
            return model.toPDFContent();
        });

        if (!observationsContent.length) {
            observationsContent = [
                this.pdfContentHint("Immunreaktion (Tests)", "Impfpass")
            ];
        }

        const conditions = ParserUtil.getEntries<Vaccination.V1_1_0.Profile.Condition>(
            this.value,
            [Vaccination.V1_1_0.Profile.Condition]
        );

        let conditionsContent = conditions.map((c) => {
            const model = new IM.ConditionModel(c.resource, c.fullUrl, this.value);
            return model.toPDFContent();
        });

        if (!conditionsContent.length) {
            conditionsContent = [
                this.pdfContentHint(
                    "Erkrankungen, die zu einer Immunisierung geführt haben",
                    "Impfpass"
                )
            ];
        }

        return [
            this.getHeading(),
            {
                text: "Impfeinträge",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            recordContent,
            horizontalLine,
            {
                text: "Immunreaktion (Tests)",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            observationsContent,
            horizontalLine,
            {
                text: "Erkrankungen, die zu einer Immunisierung geführt haben",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            conditionsContent
        ];
    }

    public getHeading(): Content {
        const composition = ParserUtil.getEntry<
            | Vaccination.V1_1_0.Profile.CompositionAddendum
            | Vaccination.V1_1_0.Profile.CompositionPrime
        >(this.value, [
            Vaccination.V1_1_0.Profile.CompositionAddendum,
            Vaccination.V1_1_0.Profile.CompositionPrime
        ]);

        const title = composition ? composition.resource.title : "-";
        const ref = composition?.resource.author[0].reference;
        const date = composition?.resource.date;

        let authorContent: Content | undefined = undefined;
        if (ref) {
            const practitioner = ParserUtil.getEntryWithRef<
                | Vaccination.V1_1_0.Profile.Practitioner
                | Vaccination.V1_1_0.Profile.PractitionerAddendum
            >(
                this.value,
                [
                    Vaccination.V1_1_0.Profile.Practitioner,
                    Vaccination.V1_1_0.Profile.PractitionerAddendum
                ],
                new Reference(ref, composition?.fullUrl)
            );

            if (practitioner && practitioner.resource) {
                const practitionerModel = new IM.PractitionerModel(
                    practitioner.resource,
                    practitioner.fullUrl,
                    this.value
                );
                const telecom = new TelecomModel(
                    practitioner.resource,
                    practitioner.fullUrl,
                    this.value
                );
                const comment = new AdditionalCommentModel(
                    practitioner.resource,
                    practitioner.fullUrl,
                    this.value
                );
                authorContent = [
                    [horizontalLine],
                    practitionerModel.toPDFContent(["subTable"]),
                    telecom.toPDFContent(["subTable"]),
                    comment.toPDFContent(["subTable"])
                ];
            }
        }

        const patientResource = ParserUtil.getEntry<Vaccination.V1_1_0.Profile.Patient>(
            this.value,
            [Vaccination.V1_1_0.Profile.Patient]
        );

        let patientContent = undefined;
        if (patientResource) {
            const model = new IM.PatientModel(
                patientResource.resource,
                patientResource.fullUrl,
                this.value
            );
            patientContent = model.toPDFContent();
        }

        return this.headingContent(title, date, authorContent, patientContent);
    }
}
