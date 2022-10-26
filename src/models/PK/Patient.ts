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

import { PKA } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Content } from "pdfmake/interfaces";

export default class PatientModel extends BaseModel<
    PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD
> {
    constructor(
        value: PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.PK.getPatientName(value);
        this.values = [
            {
                value: Util.Misc.formatDate(value.birthDate),
                label: "Geburtsdatum"
            },
            ...this.getIdentifier(),
            Util.Misc.getGender(value)
        ];
    }

    public getIdentifier(): ModelValue[] {
        return Util.Misc.getPatientIdentifier(this.value).map(
            (identifier) => identifier as ModelValue
        );
    }

    public getCoding(): string {
        return "This profile has no coding";
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
