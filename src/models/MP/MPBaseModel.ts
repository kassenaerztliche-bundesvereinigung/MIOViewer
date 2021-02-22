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

import { MR, MRResource } from "@kbv/mioparser";

import BaseModel, { ModelValue } from "../BaseModel";
import { Content } from "pdfmake/interfaces";

export default abstract class MPBaseModel<T extends MRResource> extends BaseModel<T> {
    protected constructor(
        value: T,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, parent, history);
    }

    public abstract getCoding(resource?: never): string;

    public getNote(): ModelValue | undefined {
        const value = this.value as { note: { text: string }[] };
        if (Object.prototype.hasOwnProperty.call(value, "note")) {
            return {
                value:
                    value.note && value.note.length
                        ? value.note.map((n) => n.text).join(", ")
                        : "-",
                label: "Anmerkung"
            };
        }
        return undefined;
    }

    public toString(): string {
        return this.values.map((v) => v.label + ": " + v.value).join("\n");
    }

    /**
     * Main value of model. Should be used/displayed in parent list (ie. as ListItem to reference Detail).
     * Which value/label pair (ModelValue) best describes the model.
     */
    public abstract getMainValue(): ModelValue | undefined;

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

    protected pdfContentHint(topic: string, parent = "Mutterpass"): Content {
        return super.pdfContentHint(topic, parent);
    }
}
