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

import { ParserUtil, MR } from "@kbv/mioparser";

import { ModelValue } from "../../BaseModel";
import MPBaseModel from "../MPBaseModel";
import * as Models from "../../../models";
import { translateCode } from "../Util";
import { UI } from "../../../components";
import { Content } from "pdfmake/interfaces";
import { horizontalLine } from "../../../pdf/PDFMaker";

export default class ClinicalImpressionFindingModel extends MPBaseModel<
    | MR.V1_00_000.Profile.ClinicalImpressionInitialExamination
    | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry
    | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
> {
    constructor(
        value:
            | MR.V1_00_000.Profile.ClinicalImpressionInitialExamination
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History,
        protected findingConceptMap: ParserUtil.ConceptMap[] | undefined = undefined
    ) {
        super(value, parent, history);

        if (!findingConceptMap) {
            if (MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry.is(value)) {
                this.findingConceptMap = [MR.V1_00_000.ConceptMap.SpecialFindingsGerman];
            } else if (
                MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary.is(
                    value
                )
            ) {
                this.findingConceptMap = [
                    MR.V1_00_000.ConceptMap.SpecialFindingsGerman,
                    MR.V1_00_000.ConceptMap.CatalogueAGerman
                ];
            } else {
                this.findingConceptMap = [MR.V1_00_000.ConceptMap.CatalogueAGerman];
            }
        }

        if (
            MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary.is(
                this.value
            )
        ) {
            this.headline = "Nach Katalog A/B dokumentierte wichtigste Risikonummern";
        } else if (MR.V1_00_000.Profile.ClinicalImpressionInitialExamination.is(value)) {
            this.headline = "Schwangerschaftsrisiko";
        } else {
            this.headline = "Risikofaktoren";
        }

        this.values = [...this.getFindings()];
    }

    public getFindings(): ModelValue[] {
        if (this.value.finding && this.value.finding.length) {
            let values: ModelValue[] = [];
            this.value.finding.forEach((f: any) => {
                if (Object.prototype.hasOwnProperty.call(f, "itemCodeableConcept")) {
                    f.itemCodeableConcept.coding.forEach((c: any) => {
                        let translated = this.findingConceptMap
                            ? translateCode(c.code, this.findingConceptMap)
                            : [c.code];

                        if (c._display?.extension?.length) {
                            const e = c._display.extension[0].extension;
                            if (e.length) {
                                translated = [e[0].valueString];
                            }
                        }

                        translated.forEach((value) => {
                            values.push({
                                value,
                                label: "",
                                renderAs: UI.ListItem.NoLabel
                            });
                        });
                    });

                    values = values.filter((value, index, self) => {
                        return index === self.findIndex((t) => t.value === value.value);
                    });

                    values.sort((a, b) => {
                        const regex = /\(([^)]+)\)/;
                        const ar = regex.exec(a.value);
                        const br = regex.exec(b.value);
                        let aInt = 0;
                        let bInt = 0;

                        if (ar && ar.length > 1 && ar[1]) {
                            aInt = parseInt(ar[1]);
                        }
                        if (br && br.length > 1 && br[1]) {
                            bInt = parseInt(br[1]);
                        }

                        return aInt - bInt;
                    });
                } else if (Object.prototype.hasOwnProperty.call(f, "itemReference")) {
                    const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationPregnancyRisk>(
                        this.parent,
                        [MR.V1_00_000.Profile.ObservationPregnancyRisk],
                        f.itemReference.reference
                    )?.resource;

                    if (res) {
                        const model = new Models.MP.Basic.ObservationModel(
                            res,
                            this.parent as MR.V1_00_000.Profile.Bundle,
                            this.history
                        );

                        values.push(model.getMainValue());
                    }
                }
            });
            return values;
        } else {
            return [];
        }
    }

    getCoding(): string {
        return "";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }

    public toPDFContent(
        styles: string[] = [],
        subTable?: boolean,
        removeHTML?: boolean
    ): Content {
        const heading = {
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
        };

        if (!this.values.length) {
            return [heading, this.pdfContentHint(this.headline)];
        }

        return [
            heading,
            {
                layout: "noBorders",
                table: {
                    headerRows: 0,
                    widths: ["90%", "*"],
                    body: this.values.map((value) => {
                        let textValue = value.value;

                        if (removeHTML) {
                            textValue = textValue.replace(/<[^>]*>?/gm, "");
                        }

                        const content: Content[] = [
                            { text: textValue, bold: true, style: styles }
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
