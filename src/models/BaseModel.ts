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
import { CMR, KBVBundleResource, KBVResource } from "@kbv/mioparser";

import { Content } from "pdfmake/interfaces";
import { horizontalLine } from "../pdf/PDFHelper";

import { ModelValue } from "./Types";
import { UI } from "../components";

export default abstract class BaseModel<
    T extends
        | KBVResource
        | CMR.V1_00_000.Profile.CMROrganizationScreeningLaboratoryContact
> {
    protected headline = "";
    protected noHeadline = false;
    protected values: ModelValue[] = [];

    protected constructor(
        readonly value: T,
        readonly fullUrl: string,
        readonly parent: KBVBundleResource,
        readonly history?: History
    ) {}

    public getHeadline(): string {
        return this.headline;
    }

    public getValues(): ModelValue[] {
        return this.values;
    }

    public showHeadline(): boolean {
        return !this.noHeadline;
    }

    /**
     * Main value of model. Should be used/displayed in parent list (ie. as ListItem to reference Detail).
     * Which value/label pair (ModelValue) best describes the model.
     */
    public abstract getMainValue(): ModelValue;

    public abstract toString(): string;

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean,
        headingTitle?: string
    ): Content {
        const heading = {
            layout: "noBorders",
            table: {
                widths: ["*"],
                body: [
                    [
                        {
                            text: headingTitle ? headingTitle : this.getHeadline(),
                            style: ["filledHeader", ...styles],
                            margin: [0, 0, 0, 0]
                        }
                    ]
                ]
            }
        };

        if (!this.values.length) {
            return [heading, this.pdfContentHint(this.headline)];
        }

        return [
            this.noHeadline ? "" : heading,
            {
                layout: "noBorders",
                table: {
                    headerRows: 0,
                    widths: [subTable ? "50%" : "40%", subTable ? "50%" : "60%"],
                    body: this.values.map((value) => {
                        let textValue = value.value;

                        if (removeHTML) {
                            textValue = textValue.replace(/<[^>]*>?/gm, "");
                        }

                        const content: Content[] = [
                            {
                                text: value.label
                                    ? value.label + (value.label.endsWith(":") ? "" : ":")
                                    : "",
                                bold: true,
                                style: styles
                            }
                        ];

                        if (value.renderAs === UI.ListItem.Bullet) {
                            content.push({
                                text: textValue
                                    .split("\n")
                                    .map((v) => "– " + v)
                                    .join("\n"),
                                style: styles
                            });
                        } else {
                            content.push({ text: textValue, style: styles });
                        }

                        if (
                            value.subEntry &&
                            value.subModels &&
                            value.subModels?.length
                        ) {
                            const subContents: Content[] = [horizontalLine];
                            value.subModels.forEach((model) => {
                                const sub = new model(
                                    value.subEntry?.resource,
                                    value.subEntry?.fullUrl ?? "",
                                    this.parent
                                );
                                const pdfContent = sub.toPDFContent(
                                    ["subTable", ...styles],
                                    true
                                );
                                const subContent = ["", pdfContent];
                                subContents.push(subContent);
                            });

                            return [
                                { text: value.label + ":", bold: true },
                                ["", subContents]
                            ];
                        }
                        return content;
                    })
                }
            }
        ];
    }

    protected pdfContentHint(topic: string, parent = "MIO"): Content {
        return {
            text: `Unter „${topic}“ sind in diesem ${parent} derzeit keine Einträge vorhanden.`
        };
    }

    // eslint-disable-next-line
    public getJSON(): any {
        return this.value;
    }
}
