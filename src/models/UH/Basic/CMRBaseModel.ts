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

import { History } from "history";

import { ParserUtil, CMR, CMRResource, PCResource, PNResource } from "@kbv/mioparser";

import BaseModel from "../../BaseModel";
import { Content } from "pdfmake/interfaces";
import { Util } from "../../../components";

export default abstract class CMRBaseModel<
    T extends CMRResource | PCResource | PNResource
> extends BaseModel<T> {
    protected constructor(
        value: T,
        fullUrl: string,
        parent:
            | CMR.V1_00_000.Profile.CMRBundle
            | CMR.V1_00_000.Profile.PCBundle
            | CMR.V1_00_000.Profile.PNBundle,
        history?: History,
        protected codeConceptMaps?: ParserUtil.ConceptMap[],
        protected valueConceptMaps?: ParserUtil.ConceptMap[]
    ) {
        super(value, fullUrl, parent, history);
    }

    public abstract getCoding(resource?: { code?: Util.FHIR.Code }): string;

    public toString(): string {
        return this.values.map((v) => v.label + ": " + v.value).join("\n");
    }

    public mainValueToPDFContent(): Content {
        const mainValue = this.getMainValue();

        if (mainValue) {
            const content: Content[] = [
                { text: mainValue.label + ":", bold: true },
                { text: mainValue.value }
            ];

            return [
                {
                    layout: "noBorders",
                    table: {
                        headerRows: 0,
                        widths: ["40%", "*"],
                        body: [content]
                    }
                }
            ];
        } else {
            return [];
        }
    }

    protected pdfContentHint(topic: string, parent = "U-Heft"): Content {
        return super.pdfContentHint(topic, parent);
    }
}
