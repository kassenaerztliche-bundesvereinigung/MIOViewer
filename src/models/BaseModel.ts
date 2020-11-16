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

import React from "react";
import { History } from "history";
import { KBVBundleResource, KBVResource, MIOEntry } from "@kbv/mioparser";

import { Content } from "pdfmake/interfaces";

import * as Models from "./index";
import { horizontalLine } from "../pdf/PDFMaker";
import { ListItemProps } from "../components/UI/ListItem/ListItem";

export type RenderComponent = React.ComponentType<ListItemProps>;

export interface ModelValue {
    value: string;
    label: string;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    renderAs?: RenderComponent;
    subEntry?: MIOEntry<KBVResource>;
    subModels?: (new (
        value: any, // eslint-disable-line
        parent: KBVBundleResource,
        history?: History
    ) => Models.Model)[];
}

export default abstract class BaseModel<T extends KBVResource> {
    protected headline = "";
    protected values: ModelValue[] = [];

    protected constructor(
        readonly value: T,
        readonly parent: KBVBundleResource,
        readonly history?: History
    ) {}

    public getHeadline(): string {
        return this.headline;
    }

    public getValues(): ModelValue[] {
        return this.values;
    }

    public abstract toString(): string;

    public toPDFContent(styles: string[] = [], subTable?: boolean): Content {
        return [
            {
                layout: "noBorders",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                text: this.getHeadline(),
                                style: ["filledHeader", ...styles],
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
                    widths: [subTable ? "50%" : "40%", "*"],
                    body: this.values.map((value) => {
                        // let content = ;
                        const content: Content[] = [
                            { text: value.label + ":", bold: true, style: styles },
                            { text: value.value, style: styles }
                        ];

                        if (
                            value.subEntry &&
                            value.subModels &&
                            value.subModels?.length
                        ) {
                            const subContents: Content[] = [horizontalLine];
                            value.subModels.forEach((model) => {
                                const sub = new model(
                                    value.subEntry?.resource,
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
}
