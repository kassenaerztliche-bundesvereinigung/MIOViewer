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

import { History } from "history";
import { Content } from "pdfmake/interfaces";

import { KBVBundleResource, Vaccination } from "@kbv/mioparser";
import { Util, IM } from "../../components";

import BaseModel, { ModelValue } from "../BaseModel";

export default class PatientModel extends BaseModel<
    Vaccination.V1_00_000.Profile.Patient
> {
    constructor(
        value: Vaccination.V1_00_000.Profile.Patient,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = IM.Util.getPatientName(this.value);
        this.values = [
            {
                value: IM.Util.getPatientMaidenName(this.value),
                label: "Geburtsname"
            },
            {
                value: Util.formatDate(this.value.birthDate),
                label: "Geburtsdatum"
            },
            this.getGender(),
            ...this.getIdentifier()
        ];
    }

    public getGender(): ModelValue {
        const gender = this.value.gender ? this.value.gender : undefined;
        const _gender = this.value._gender?.extension
            ?.map((ex) => {
                // TODO: should use display
                if (ex.valueCoding && Array.isArray(ex.valueCoding)) {
                    return ex.valueCoding.map((coding) => {
                        if (coding.code === "X") return "unbestimmt";
                        else if (coding.code === "D") return "divers";
                        return "-";
                    });
                }
            })
            .join(", ");

        return {
            value: gender ? gender : _gender ? _gender : "-",
            label: "Geschlecht"
        };
    }

    public getIdentifier(): ModelValue[] {
        return Util.getPatientIdentifier(this.value).map((identifier) => identifier);
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
}
