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

import { ParserUtil, MIOEntry, MR } from "@kbv/mioparser";

import { ModelValue } from "../../BaseModel";
import MPBaseModel from "../MPBaseModel";
import * as Models from "../../index";
import { DetailMapping } from "../../../views/Comprehensive/Detail/DetailBase";
import { Content } from "pdfmake/interfaces";
import { horizontalLine } from "../../../pdf/PDFMaker";

const PR = MR.V1_00_000.Profile;
const CM = MR.V1_00_000.ConceptMap;

export default class ClinicalImpressionInvestigationModel extends MPBaseModel<
    | MR.V1_00_000.Profile.ClinicalImpressionInitialExamination
    | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry
    | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
    | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
    | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationChildInformation
> {
    protected patientId: string | undefined;

    constructor(
        value:
            | MR.V1_00_000.Profile.ClinicalImpressionInitialExamination
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
            | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
            | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationChildInformation,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History,
        customHeadline?: string
    ) {
        super(value, parent, history);

        if (PR.ClinicalImpressionBirthExaminationChildInformation.is(this.value)) {
            this.patientId = history?.location.pathname.split("/").pop();
        }

        const investigations = this.getInvestigations();
        this.values = [...investigations];
        this.headline =
            customHeadline ?? (investigations.length > 1 ? "Befunde" : "Befund");
        if (
            MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary.is(
                value
            )
        ) {
            this.headline = "Allgemeine Angaben";
        } else if (MR.V1_00_000.Profile.ClinicalImpressionInitialExamination.is(value)) {
            this.headline = "Katalog A";
        }
    }

    public getInvestigations(): ModelValue[] {
        const investigations: ModelValue[] = [];

        this.value.investigation?.forEach((i: any) => {
            this.headline = this.headline ?? i.code.text;
            i.item.forEach(
                (
                    item:
                        | MR.V1_00_000.Profile.ClinicalImpressionInitialExaminationInvestigationItem
                        | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntryInvestigationItem
                        | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummaryInvestigationItem
                        | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformationInvestigationItem
                ) => {
                    const checkedItem = this.checkItem(item);
                    if (checkedItem) investigations.push(checkedItem);
                }
            );
        });

        if (MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntry.is(this.value)) {
            const encounterRef = this.value.encounter.reference;

            const examinations = ParserUtil.getEntries<MR.V1_00_000.Profile.ObservationExamination>(
                this.parent,
                [MR.V1_00_000.Profile.ObservationExamination]
            );
            if (examinations) {
                examinations.forEach((e) => {
                    const res = e.resource;
                    const ref = res.encounter.reference;
                    if (ref === encounterRef) {
                        const model = new Models.MP.Basic.ObservationModel(
                            res,
                            this.parent as MR.V1_00_000.Profile.Bundle,
                            this.history
                        );

                        const loincHb1 = "718-7";
                        const loincHb2 = "59260-0";
                        const codes = res.code.coding.map((c) => c.code);
                        const isHb = codes.includes(loincHb1) || codes.includes(loincHb2);
                        if (isHb) {
                            investigations.push(model.getMainValue());
                        }
                    }
                });
            }
        }

        return investigations;
    }

    public checkItem(
        item:
            | MR.V1_00_000.Profile.ClinicalImpressionInitialExaminationInvestigationItem
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyChartEntryInvestigationItem
            | MR.V1_00_000.Profile.ClinicalImpressionPregnancyExaminationDischargeSummaryInvestigationItem
            | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformationInvestigationItem
    ): ModelValue | undefined {
        const mappings: DetailMapping[] = [
            {
                profile: MR.V1_00_000.Profile.ObservationCatalogueA,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_00_000.ConceptMap.CatalogueAGerman]
            },
            // Gravidogramm - Observations,
            {
                profile: MR.V1_00_000.Profile.ObservationBloodPressure,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationWeightMother,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationFundusHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationVaricosis,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationEdema,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrine,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrineSugar,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrineProtein,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrineNitrite,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrineBlood,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationVaginalExamination,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationHeartSoundsChild,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_00_000.ConceptMap.HeartSoundsChildGerman]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationChildPosition,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_00_000.ConceptMap.ChildPositionGerman]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationChildMovement,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: MR.V1_00_000.Profile.ObservationAge,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationGravida,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationPara,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: MR.V1_00_000.Profile.ObservationPresentationAtBirthClinic,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationInpatientStayDuringPregnancy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationNumberOfCheckups,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Geburt
            {
                profile: MR.V1_00_000.Profile.ObservationExternalBirth,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Angaben zum Kind
            {
                profile: PR.ObservationLiveBirth,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationBirthMode,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [CM.BirthModeGerman]
            },
            {
                profile: MR.V1_00_000.Profile.PatientChild,
                models: [Models.MP.Basic.PatientChildModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationWeightChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationHeadCircumference,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationBirthHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationApgarScore,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationpHValueUmbilicalArtery,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationMalformation,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Wochenbett
            {
                profile: MR.V1_00_000.Profile.ObservationPuerperiumNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationAntiDProphylaxisPostPartum,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationAdviceOnIodineIntake,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationBloodGroupSerologyChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationDirectCoombstest,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Zweit Untersuchung
            {
                profile: MR.V1_00_000.Profile.ObservationBreastfeedingBehavior,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [CM.BreastfeedingBehaviorGerman]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationUrineSediment,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationGynecologicalFindingNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationU3Performed,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationChildIsHealthy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_00_000.Profile.ObservationNeedOfTreatmentU3,
                models: [Models.MP.Basic.ObservationModel]
            }
        ];

        const ref = item.reference;

        const result = ParserUtil.getEntryWithRef(
            this.parent,
            mappings.map((m) => m.profile),
            ref
        );

        const resource = result?.resource;

        const bundle = this.parent as MR.V1_00_000.Profile.Bundle;

        let mainValueResult: ModelValue | undefined = undefined;
        let model: any = undefined;
        if (resource) {
            mappings.forEach((mapping) => {
                if (!model && mapping.profile.is(resource)) {
                    if (mapping.models.length) {
                        model = new mapping.models[0](
                            resource as any,
                            bundle,
                            this.history,
                            mapping.valueConceptMaps,
                            mapping.codeConceptMaps,
                            mapping.customLabel
                        );
                    }
                }
            });

            if (model) {
                if (this.patientId) {
                    if (MR.V1_00_000.Profile.PatientChild.is(resource)) {
                        if (this.patientId === resource.id) {
                            return model.getMainValue();
                        }
                    } else {
                        const modelResult = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.PatientChild>(
                            bundle,
                            [MR.V1_00_000.Profile.PatientChild],
                            (resource as any).subject.reference
                        );

                        if (modelResult) {
                            if (
                                this.patientId === ParserUtil.getUuid(modelResult.fullUrl)
                            ) {
                                mainValueResult = model.getMainValue();
                            }
                        }
                    }
                } else {
                    mainValueResult = model.getMainValue();
                }
            }

            return mainValueResult;
        }
    }

    getItemCoding(item: MIOEntry<any>): string {
        return Array.from(
            new Set(
                item.resource.code.coding.map((c: any) => {
                    return c._display?.extension
                        ?.map((e: any) => {
                            return e.extension
                                ? e.extension.map((ex: any) => {
                                      return ex.valueString;
                                  })
                                : "unknown";
                        })
                        .join(", ");
                })
            )
        ).join(", ");
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue | undefined {
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
                    widths: [subTable ? "50%" : "40%", "*"],
                    body: this.getInvestigations().map((value) => {
                        let textValue = value.value;
                        if (removeHTML) {
                            textValue = textValue.replace(/<[^>]*>?/gm, "");
                        }
                        const content: Content[] = [
                            { text: value.label + ":", bold: true, style: styles },
                            { text: textValue, style: styles }
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
