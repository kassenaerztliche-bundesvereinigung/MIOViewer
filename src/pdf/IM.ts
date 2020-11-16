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

import { ParserUtil, Vaccination } from "@kbv/mioparser";
import { Util } from "../components";

import { TelecomModel, IM } from "../models";
import { horizontalLine } from "./PDFMaker";

export function getVaccinationContent(
    value: Vaccination.V1_00_000.Profile.BundleEntry
): Content {
    const composition = ParserUtil.getEntry<
        | Vaccination.V1_00_000.Profile.CompositionAddendum
        | Vaccination.V1_00_000.Profile.CompositionPrime
    >(value, [
        Vaccination.V1_00_000.Profile.CompositionAddendum,
        Vaccination.V1_00_000.Profile.CompositionPrime
    ]);

    const title = composition ? composition.resource.title : "-";
    const ref = composition?.resource.author[0].reference;
    const date = composition?.resource.date;

    let authorContent: Content | undefined = undefined;
    if (ref) {
        const practitioner = ParserUtil.getEntryWithRef<
            | Vaccination.V1_00_000.Profile.Practitioner
            | Vaccination.V1_00_000.Profile.PractitionerAddendum
        >(
            value,
            [
                Vaccination.V1_00_000.Profile.Practitioner,
                Vaccination.V1_00_000.Profile.PractitionerAddendum
            ],
            ref
        );

        if (practitioner && practitioner.resource) {
            const practitionerModel = new IM.PractitionerModel(
                practitioner.resource,
                value
            );
            const telecom = new TelecomModel(practitioner.resource, value);
            const comment = new IM.AdditionalCommentModel(practitioner.resource, value);
            authorContent = [
                [horizontalLine],
                practitionerModel.toPDFContent(["subTable"]),
                telecom.toPDFContent(["subTable"]),
                comment.toPDFContent(["subTable"])
            ];
        }
    }

    const patientResource = ParserUtil.getEntry<Vaccination.V1_00_000.Profile.Patient>(
        value,
        [Vaccination.V1_00_000.Profile.Patient]
    );

    let patient = {};

    if (patientResource) {
        const model = new IM.PatientModel(patientResource.resource, value);
        patient = model.toPDFContent();
    }

    const recordsAddendum = ParserUtil.getEntries<
        Vaccination.V1_00_000.Profile.RecordAddendum
    >(value, [Vaccination.V1_00_000.Profile.RecordAddendum]);

    let recordContent = recordsAddendum.map((r) => {
        const model = new IM.RecordAddendumModel(r.resource, value);
        return model.toPDFContent();
    });

    const recordsPrime = ParserUtil.getEntries<Vaccination.V1_00_000.Profile.RecordPrime>(
        value,
        [Vaccination.V1_00_000.Profile.RecordPrime]
    );

    recordContent = [
        ...recordContent,
        recordsPrime.map((r) => {
            const model = new IM.RecordPrimeModel(r.resource, value);
            return model.toPDFContent();
        })
    ];

    if (!recordContent.length) {
        recordContent = [
            {
                text:
                    "Unter „Impfungen“ sind in diesem Impfpass derzeit keine Einträge vorhanden."
            }
        ];
    }

    const observations = ParserUtil.getEntries<
        Vaccination.V1_00_000.Profile.ObservationImmunizationStatus
    >(value, [Vaccination.V1_00_000.Profile.ObservationImmunizationStatus]);

    let observationsContent = observations.map((o) => {
        const model = new IM.ObservationModel(o.resource, value);
        return model.toPDFContent();
    });

    if (!observationsContent.length) {
        observationsContent = [
            {
                text:
                    "Unter „Immunreaktion (Tests)“ sind in diesem Impfpass derzeit keine Einträge vorhanden."
            }
        ];
    }

    const conditions = ParserUtil.getEntries<Vaccination.V1_00_000.Profile.Condition>(
        value,
        [Vaccination.V1_00_000.Profile.Condition]
    );

    let conditionsContent = conditions.map((c) => {
        const model = new IM.ConditionModel(c.resource, value);
        return model.toPDFContent();
    });

    if (!conditionsContent.length) {
        conditionsContent = [
            {
                text:
                    "Unter „Erkrankungen, die zu einer Immunisierung geführt haben“ sind in diesem Impfpass derzeit keine Einträge vorhanden."
            }
        ];
    }

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
                        { text: "Erstellungsdatum des Impfeintrags:", bold: true },
                        Util.formatDate(date)
                    ],
                    [
                        { text: "Impfeintrag erstellt von:", bold: true },
                        authorContent ? authorContent : "-"
                    ]
                ]
            }
        },
        horizontalLine,
        {
            text: "Patient/-in", // TODO: according to gender?
            margin: [0, 0, 0, 0],
            style: "h2"
        },
        horizontalLine,
        patient as Content,
        horizontalLine,
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
