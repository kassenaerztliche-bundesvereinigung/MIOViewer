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

import { MIOEntry, CMR } from "@kbv/mioparser";

import * as Models from "../../../models";

import { horizontalLine } from "../../PDFHelper";
import PDFRepresentation from "../../PDFRepresentation";

export default abstract class CMRtoPDFBase<
    T,
    B extends
        | CMR.V1_0_1.Profile.CMRBundle
        | CMR.V1_0_1.Profile.PCBundle
        | CMR.V1_0_1.Profile.PNBundle
> extends PDFRepresentation<B> {
    protected composition?: MIOEntry<T>;

    protected constructor(value: B) {
        super(value, "U-Heft-Eintrag", "s");
    }

    protected getHints(
        composition?: MIOEntry<Models.UH.Basic.CompositionHintsType>
    ): Content {
        if (!composition) {
            return [];
        }

        const hintsModel = new Models.UH.Basic.CompositionHintsModel(
            composition.resource,
            composition.fullUrl,
            this.value
        );

        const hints = hintsModel
            .getValues()
            .map((v) => [
                this.sectionWithContent(v.label, [v.value], "h2"),
                horizontalLine
            ]);

        return this.sectionWithContent("Hinweise", hints);
    }
}
