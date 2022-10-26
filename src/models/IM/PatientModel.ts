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
import { Content } from "pdfmake/interfaces";

import { KBVBundleResource, Vaccination } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export default class PatientModel extends BaseModel<Vaccination.V1_1_0.Profile.Patient> {
    constructor(
        value: Vaccination.V1_1_0.Profile.Patient,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.IM.getPatientName(value);
        this.values = [
            {
                value: Util.IM.getPatientMaidenName(value),
                label: "Geburtsname"
            },
            {
                value: Util.Misc.formatDate(value.birthDate),
                label: "Geburtsdatum"
            },
            Util.Misc.getGender(value),
            ...this.getIdentifier()
        ];
    }

    public getIdentifier(): ModelValue[] {
        return Util.Misc.getPatientIdentifier(this.value).map(
            (identifier) => identifier as ModelValue
        );
    }

    public toString(): string {
        return this.values
            .filter((v) => v.value !== "-" && !v.label.includes("Geburtsname"))
            .map((v) => v.label + ": " + v.value)
            .join("\n");
    }

    public toPDFContent(): Content {
        return [
            {
                layout: "noBorders",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                text: this.getHeadline(),
                                style: ["filledHeader"],
                                margin: [0, 0, 0, 0]
                            }
                        ]
                    ]
                }
            },
            {
                layout: "noBorders",
                table: {
                    headerRows: 0,
                    widths: ["40%", "*"],
                    body: this.values
                        .filter((value) => !value.label.includes("Geburtsname"))
                        .map((value) => {
                            return [{ text: value.label + ":", bold: true }, value.value];
                        })
                }
            }
        ];
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "Patient/-in"
        };
    }
}
