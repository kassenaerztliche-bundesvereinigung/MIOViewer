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

import { horizontalLine } from "../../PDFHelper";
import PDFRepresentation from "./CMRtoPDFBase";
import * as Models from "../../../models";
import { Util } from "../../../components";

export default class PCtoPDF extends PDFRepresentation<
    CMR.V1_00_000.Profile.PCCompositionExaminationParticipation,
    CMR.V1_00_000.Profile.PCBundle
> {
    constructor(value: CMR.V1_00_000.Profile.PCBundle) {
        super(value);

        this.composition = ParserUtil.getEntry<CMR.V1_00_000.Profile.PCCompositionExaminationParticipation>(
            this.value,
            [CMR.V1_00_000.Profile.PCCompositionExaminationParticipation]
        );
    }

    public getContent(): Content {
        return [this.getHeading(), horizontalLine, this.getHints(this.composition)];
    }

    public getHeading(): Content {
        const content: Content = [];

        const encounter = Util.UH.getCompositionEncounter(this.value);

        if (encounter) {
            const participationCardModel = new Models.UH.PC.ParticipationCardModel(
                encounter.resource as CMR.V1_00_000.Profile.PCEncounter,
                encounter.fullUrl,
                this.value
            );

            content.push(
                this.sectionWithContent(
                    "Teilnahmekarte",
                    [participationCardModel.toPDFContent()],
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
