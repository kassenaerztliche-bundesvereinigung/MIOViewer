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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, CMR } from "@kbv/mioparser";
import { Util } from "../../../components";

import * as Models from "../../../models";

import { horizontalLine } from "../../PDFHelper";
import Base from "./CMRtoPDFBase";

export default class PNtoPDF extends Base<
    CMR.V1_0_0.Profile.PNCompositionParentalNotes,
    CMR.V1_0_0.Profile.PNBundle
> {
    constructor(value: CMR.V1_0_0.Profile.PNBundle) {
        super(value);

        this.composition = ParserUtil.getEntry<CMR.V1_0_0.Profile.PNCompositionParentalNotes>(
            this.value,
            [CMR.V1_0_0.Profile.PNCompositionParentalNotes]
        );
    }

    public getContent(): Content {
        const content: Content[] = [];

        if (this.composition) {
            const model = new Models.UH.PN.ParentalNotesModel(
                this.composition.resource,
                this.composition.fullUrl,
                this.value
            );

            content.push(model.toPDFContent(), horizontalLine);
        }

        content.push(this.getHints(this.composition));

        return [this.getHeading(), horizontalLine, content];
    }

    public getHeading(): Content {
        const content: Content = [];

        if (this.composition) {
            const compositionModel = new Models.UH.PN.CompositionModel(
                this.composition.resource,
                this.composition.fullUrl,
                this.value
            );

            content.push(
                this.sectionWithContent(
                    "Elternnotiz",
                    [compositionModel.toPDFContent()],
                    "h2"
                )
            );

            const patientResource = Util.UH.getPatient(this.value);
            if (patientResource) {
                const patientModel = new Models.UH.Basic.PatientModel(
                    patientResource.resource,
                    patientResource.fullUrl,
                    this.value
                );

                content.push(
                    horizontalLine,
                    this.sectionWithContent(
                        "Patient/-in",
                        [patientModel.toPDFContent()],
                        "h2"
                    )
                );
            }
        }

        return content;
    }
}
