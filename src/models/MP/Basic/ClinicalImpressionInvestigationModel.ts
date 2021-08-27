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

import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import * as Models from "../../index";
import { DetailMapping } from "../../../views/Comprehensive/Detail/Types";
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../../index";

const PR = MR.V1_0_0.Profile;
const CM = MR.V1_0_0.ConceptMap;

export type ClinicalImpressionInvestigationType =
    | MR.V1_0_0.Profile.ClinicalImpressionInitialExamination
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
    | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
    | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationChildInformation;

export type InvestigationItemType =
    | MR.V1_0_0.Profile.ClinicalImpressionInitialExaminationInvestigationItem
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntryInvestigationItem
    | MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummaryInvestigationItem
    | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformationInvestigationItem;

export default class ClinicalImpressionInvestigationModel extends MPBaseModel<ClinicalImpressionInvestigationType> {
    protected patientId: string | undefined;

    constructor(
        value: ClinicalImpressionInvestigationType,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History,
        customHeadline?: string
    ) {
        super(value, fullUrl, parent, history);

        if (PR.ClinicalImpressionBirthExaminationChildInformation.is(this.value)) {
            this.patientId = history?.location.pathname.split("/").pop();
        }

        const investigations = this.getInvestigations();
        this.values = [...investigations];
        this.headline =
            customHeadline ?? (investigations.length > 1 ? "Befunde" : "Befund");
        if (
            MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary.is(
                value
            )
        ) {
            this.headline = "Allgemeine Angaben";
        } else if (MR.V1_0_0.Profile.ClinicalImpressionInitialExamination.is(value)) {
            this.headline = "Katalog A";
        }
    }

    public getInvestigations(): ModelValue[] {
        const investigations: ModelValue[] = [];

        this.value.investigation?.forEach(
            (i: { code: { text: string }; item?: InvestigationItemType[] }) => {
                this.headline = this.headline ?? i.code.text;
                i.item?.forEach((item: InvestigationItemType) => {
                    const checkedItem = this.checkItem(item);
                    if (checkedItem) investigations.push(checkedItem);
                });
            }
        );

        if (MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry.is(this.value)) {
            const encounterRef = this.value.encounter.reference;

            const examinations =
                ParserUtil.getEntries<MR.V1_0_0.Profile.ObservationExamination>(
                    this.parent,
                    [MR.V1_0_0.Profile.ObservationExamination]
                );
            if (examinations) {
                examinations.forEach((res) => {
                    const ref = res.resource.encounter.reference;
                    if (ref === encounterRef) {
                        const model = new Models.MP.Basic.ObservationModel(
                            res.resource,
                            res.fullUrl,
                            this.parent as MR.V1_0_0.Profile.Bundle,
                            this.history
                        );

                        const loincHb1 = "718-7";
                        const loincHb2 = "59260-0";
                        const codes = res.resource.code.coding.map((c) => c.code);
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
            | MR.V1_0_0.Profile.ClinicalImpressionInitialExaminationInvestigationItem
            | MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntryInvestigationItem
            | MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummaryInvestigationItem
            | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformationInvestigationItem
    ): ModelValue | undefined {
        const mappings: DetailMapping[] = [
            {
                profile: MR.V1_0_0.Profile.ObservationCatalogueA,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_0_0.ConceptMap.CatalogueAGerman]
            },
            // Gravidogramm - Observations,
            {
                profile: MR.V1_0_0.Profile.ObservationBloodPressure,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationWeightMother,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationFundusHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationVaricosis,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationEdema,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrine,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrineSugar,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrineProtein,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrineNitrite,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrineBlood,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationVaginalExamination,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationHeartSoundsChild,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_0_0.ConceptMap.HeartSoundsChildGerman]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationChildPosition,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [MR.V1_0_0.ConceptMap.ChildPositionGerman]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationChildMovement,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: MR.V1_0_0.Profile.ObservationAge,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationGravida,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationPara,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: MR.V1_0_0.Profile.ObservationPresentationAtBirthClinic,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationInpatientStayDuringPregnancy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationNumberOfCheckups,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Geburt
            {
                profile: MR.V1_0_0.Profile.ObservationExternalBirth,
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
                profile: MR.V1_0_0.Profile.PatientChild,
                models: [Models.MP.Basic.PatientChildModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationWeightChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationHeadCircumference,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationBirthHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationApgarScore,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationpHValueUmbilicalArtery,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationMalformation,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Wochenbett
            {
                profile: MR.V1_0_0.Profile.ObservationPuerperiumNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationAntiDProphylaxisPostPartum,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationAdviceOnIodineIntake,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationBloodGroupSerologyChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationDirectCoombstest,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Zweit Untersuchung
            {
                profile: MR.V1_0_0.Profile.ObservationBreastfeedingBehavior,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [CM.BreastfeedingBehaviorGerman]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationUrineSediment,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationGynecologicalFindingNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationU3Performed,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationChildIsHealthy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: MR.V1_0_0.Profile.ObservationNeedOfTreatmentU3,
                models: [Models.MP.Basic.ObservationModel]
            }
        ];

        const ref = item.reference;

        const result = ParserUtil.getEntryWithRef(
            this.parent,
            mappings.map((m) => m.profile),
            ref
        );

        const bundle = this.parent as MR.V1_0_0.Profile.Bundle;

        let mainValueResult: ModelValue | undefined = undefined;
        let model!: Models.Model;

        if (result) {
            mappings.forEach((mapping) => {
                if (!model && mapping.profile.is(result.resource)) {
                    if (mapping.models.length) {
                        model = new mapping.models[0](
                            result.resource,
                            result.fullUrl,
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
                    if (MR.V1_0_0.Profile.PatientChild.is(result.resource)) {
                        if (this.patientId === result.resource.id) {
                            return model.getMainValue();
                        }
                    } else {
                        const res = result.resource as { subject: { reference: string } };
                        const modelResult =
                            ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientChild>(
                                bundle,
                                [MR.V1_0_0.Profile.PatientChild],
                                res.subject.reference
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

    getItemCoding(item: MIOEntry<ClinicalImpressionInvestigationType>): string {
        return Array.from(
            new Set(
                (item.resource.code.coding as Util.FHIR.Coding[]).map(
                    (c: Util.FHIR.Coding) => {
                        return c._display?.extension
                            ?.map((e) => {
                                return e.extension
                                    ? e.extension.map((ex) => {
                                          return ex.valueString;
                                      })
                                    : "unknown";
                            })
                            .join(", ");
                    }
                )
            )
        ).join(", ");
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.map((v) => v.value).join(", "),
            label: this.headline
        };
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
                            return this.toSubPDFContent(value, styles);
                        }

                        return content;
                    })
                }
            }
        ];
    }
}
