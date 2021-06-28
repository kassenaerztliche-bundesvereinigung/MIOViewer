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

import { KBVBundleResource, ParserUtil, MIOEntry, AnyType } from "@kbv/mioparser";
import { Util, UI } from "../components";

import { horizontalLine, modelValueToPDF, pageBreakAfter } from "./PDFHelper";
import { DetailMapping } from "../views/Comprehensive/Detail/Types";
import { ModelValue } from "../models";

export default abstract class PDFRepresentation<T extends KBVBundleResource> {
    protected title?: string;

    protected constructor(
        protected value: T,
        protected singular: string,
        protected genitive: string
    ) {}

    public abstract getContent(): Content;
    public abstract getHeading(): Content;

    protected headingContent(
        title: string,
        date?: string,
        authorContent?: Content,
        patient?: Content,
        encounterContent?: Content
    ): Content {
        this.title = title;

        const body = [
            [{ text: title, style: "h2" }, ""],
            [
                {
                    text:
                        this.singular && this.genitive
                            ? `Erstellungsdatum des ${this.singular}${this.genitive}:`
                            : "Erstellungsdatum:",
                    bold: true
                },
                Util.Misc.formatDate(date)
            ],
            [
                {
                    text: this.singular
                        ? `${this.singular} erstellt von:`
                        : "Erstellt von:",
                    bold: true
                },
                authorContent ? authorContent : "-"
            ]
        ];

        if (encounterContent) {
            body.push([
                {
                    text: "Untersuchung:",
                    bold: true
                },
                encounterContent
            ]);
        }

        return [
            {
                layout: "noBorders",
                margin: [0, -16, 0, 0],
                table: {
                    headerRows: 0,
                    widths: ["40%", "*"],
                    body: body
                }
            },
            horizontalLine,
            pageBreakAfter,
            {
                text: "Patient/-in",
                margin: [0, 0, 0, 0],
                style: "h2"
            },
            horizontalLine,
            patient ? patient : "-",
            horizontalLine,
            pageBreakAfter
        ];
    }

    // eslint-disable-next-line
    protected getSection<T>(section: any, sectionStack: AnyType[]): T | undefined {
        let result = undefined;
        if (sectionStack.length) {
            sectionStack.forEach((s) => {
                if (section && section.section) {
                    // eslint-disable-next-line
                    section = ParserUtil.getSlice<any>(s, section.section);
                }
            });
            if (section) result = (section as unknown) as T;
        }
        return result;
    }

    protected headline(text: string, style: "h1" | "h2" | "h3"): Content {
        return {
            text: text,
            margin: [0, 0, 0, 0],
            style: style
        };
    }

    protected keyValuePair(key: string, value: string, keyWidth = "40%"): Content {
        return [
            {
                layout: "noBorders",
                table: {
                    headerRows: 0,
                    widths: [keyWidth, "*"],
                    body: [this.contentPair(key, value)]
                }
            }
        ];
    }

    protected contentPair(key: string, value: string): Content[] {
        return [{ text: key + ":", bold: true }, { text: value }];
    }

    protected pdfContentHint(topic: string, parent?: string): Content {
        if (parent) {
            return {
                text: `Unter „${topic}“ sind in diesem ${parent} derzeit keine Einträge vorhanden.`,
                style: "hint"
            };
        } else {
            return {
                text: `Unter „${topic}“ sind derzeit keine Einträge vorhanden.`,
                style: "hint"
            };
        }
    }

    protected hint(value: ModelValue): Content {
        if (
            value.value === "Beratung vor allem zu folgenden Themen:" ||
            value.value ===
                "(u.a. behandlungsbedürftige Hyperbilirubinämie bei einem vorausgegangenen Kind)"
        ) {
            return { text: `${value.value}`, style: "p", margin: [0, 0, 0, 8] };
        } else
            return {
                columns: [
                    {
                        text: `${value.label}` + (value.label === "Hinweis" ? ":" : ""),
                        style: "hint",
                        bold: true,
                        width: "auto"
                    },
                    {
                        text: " ",
                        width: 5
                    },
                    {
                        text: `${value.value}`,
                        style: "hint",
                        width: "*"
                    }
                ]
            };
    }

    protected hintBox(value: ModelValue): Content[] {
        const bulletStrings = UI.ListItem.HintBox.getBulletStrings(value.value).map(
            (v) => "– " + v
        );

        if (!bulletStrings.length) bulletStrings.push(value.value);

        return [
            {
                layout: "noBorders",
                margin: [0, 8, 0, 8],
                table: {
                    headerRows: 0,
                    widths: ["*"],
                    body: [
                        [
                            {
                                text: value.label,
                                style: "hint",
                                bold: true,
                                fillColor: "#e9edf5",
                                margin: [12, 8, 12, 12]
                            }
                        ],
                        ...bulletStrings.map((v) => {
                            return [
                                {
                                    text: v,
                                    style: "hint",
                                    fillColor: "#e9edf5",
                                    margin: [12, -10, 12, 8]
                                }
                            ];
                        })
                    ]
                }
            }
        ];
    }

    protected sectionWithContent(
        title: string,
        content: Content[],
        style: "h1" | "h2" | "h3" = "h1"
    ): Content {
        const hasContent = content.length > 0;
        return [
            this.headline(title, style),
            horizontalLine,
            hasContent ? content : this.pdfContentHint(title)
            // style === "h1" && hasContent ? pageBreakAfter : []
        ];
    }

    protected mapToModels(
        mapping: DetailMapping[],
        compare?: (a: MIOEntry<any>, b: MIOEntry<any>) => number, // eslint-disable-line
        section?: { entry?: { reference: string }[] },
        onlyMainValue = false
    ): Content[] {
        const entries: MIOEntry<unknown>[] = [];

        if (section) {
            section.entry?.forEach((entry) => {
                const e = ParserUtil.getEntryWithRef(
                    this.value,
                    mapping.map((m) => m.profile),
                    entry.reference
                );
                if (e) entries.push(e);
            });
        } else {
            const e = ParserUtil.getEntries(
                this.value,
                mapping.map((m) => m.profile)
            );

            entries.push(...e);
        }

        if (compare) entries.sort(compare);

        const content: Content = [];

        entries.forEach((entry) => {
            return mapping.forEach((m) => {
                if (m.profile.is(entry.resource)) {
                    const pdfContent: Content = [];
                    m.models?.forEach((model) => {
                        if (onlyMainValue) {
                            pdfContent.push(
                                modelValueToPDF(
                                    new model(
                                        entry.resource,
                                        entry.fullUrl,
                                        this.value,
                                        undefined,
                                        m.valueConceptMaps,
                                        m.codeConceptMaps,
                                        m.customLabel,
                                        m.noValue,
                                        m.noHeadline,
                                        m.customHeadline
                                    ).getMainValue()
                                )
                            );
                        } else {
                            pdfContent.push(
                                new model(
                                    entry.resource,
                                    entry.fullUrl,
                                    this.value,
                                    undefined,
                                    m.valueConceptMaps,
                                    m.codeConceptMaps,
                                    m.customLabel,
                                    m.noValue,
                                    m.noHeadline,
                                    m.customHeadline
                                ).toPDFContent(model.pdfStyle)
                            );
                        }
                    });
                    if (pdfContent.length) {
                        content.push(pdfContent);
                        if (!onlyMainValue) {
                            content.push(horizontalLine);
                        }
                    }
                }
            });
        });

        return content;
    }
}
