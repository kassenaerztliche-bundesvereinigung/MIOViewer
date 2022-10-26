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

import { History } from "history";

import { PKA, DPEResource, NFDResource, NFDxDPEResource } from "@kbv/mioparser";

import BaseModel from "../BaseModel";
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../Types";

export default abstract class PKBaseModel<
    T extends DPEResource | NFDResource | NFDxDPEResource
> extends BaseModel<T> {
    protected constructor(
        value: T,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);
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

    protected pdfContentHint(
        topic: string,
        parent = "Patientenkurzakte",
        article = "dieser"
    ): Content {
        return super.pdfContentHint(topic, parent, article);
    }
}
