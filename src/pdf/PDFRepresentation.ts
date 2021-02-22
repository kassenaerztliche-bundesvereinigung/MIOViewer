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

import { KBVBundleResource, ParserUtil, MIOEntry } from "@kbv/mioparser";
import { Util } from "../components";

import { horizontalLine, pageBreakAfter } from "./PDFMaker";
import { DetailMapping } from "../views/Comprehensive/Detail/DetailBase";

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
        patient?: Content
    ): Content {
        this.title = title;

        return [
            {
                layout: "noBorders",
                margin: [0, -16, 0, 0],
                table: {
                    headerRows: 0,
                    widths: ["40%", "*"],
                    body: [
                        [{ text: title, style: "h2" }, ""],
                        [
                            {
                                text: `Erstellungsdatum des ${this.singular}${this.genitive}:`,
                                bold: true
                            },
                            Util.Misc.formatDate(date)
                        ],
                        [
                            { text: `${this.singular} erstellt von:`, bold: true },
                            authorContent ? authorContent : "-"
                        ]
                    ]
                }
            },
            horizontalLine,
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
    protected getSection<T>(section: any, sectionStack: any[]): T | undefined {
        let result = undefined;
        if (sectionStack.length) {
            sectionStack.forEach((s) => {
                if (section && section.section) {
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
        compare?: (a: MIOEntry<any>, b: MIOEntry<any>) => number,
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
            const res = entry.resource;
            return mapping.forEach((m) => {
                if (m.profile.is(res)) {
                    const pdfContent: Content = [];
                    m.models?.forEach((model) => {
                        if (onlyMainValue) {
                            pdfContent.push(
                                new model(
                                    res,
                                    this.value,
                                    undefined,
                                    m.valueConceptMaps,
                                    m.codeConceptMaps,
                                    m.customLabel,
                                    m.noValue,
                                    m.noHeadline,
                                    m.customHeadline
                                ).mainValueToPDFContent()
                            );
                        } else {
                            pdfContent.push(
                                new model(
                                    res,
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
