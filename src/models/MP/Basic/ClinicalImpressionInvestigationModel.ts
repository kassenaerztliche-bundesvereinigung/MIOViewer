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

import { ParserUtil, MIOEntry, MR, Reference } from "@kbv/mioparser";

import { Util } from "../../../components";

import MPBaseModel from "../MPBaseModel";
import * as Models from "../../index";
import { DetailMapping } from "../../../views/Comprehensive/Detail/Types";
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../../index";

const PR = MR.V1_1_0.Profile;
const CM = MR.V1_1_0.ConceptMap;

export type ClinicalImpressionInvestigationType =
    | MR.V1_1_0.Profile.ClinicalImpressionInitialExamination
    | MR.V1_1_0.Profile.ClinicalImpressionPregnancyChartEntry
    | MR.V1_1_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary
    | MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
    | MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationChildInformation
    | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthMother
    | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthChild;

export type InvestigationItemType =
    | MR.V1_1_0.Profile.ClinicalImpressionInitialExaminationInvestigationItemReference
    | MR.V1_1_0.Profile.ClinicalImpressionPregnancyChartEntryInvestigationItemReference
    | MR.V1_1_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummaryInvestigationItemReference
    | MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformationInvestigationItemReference
    | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthMotherInvestigationItemReference
    | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthChildInvestigationItemReference;

export default class ClinicalImpressionInvestigationModel extends MPBaseModel<ClinicalImpressionInvestigationType> {
    constructor(
        value: ClinicalImpressionInvestigationType,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History,
        customHeadline?: string
    ) {
        super(value, fullUrl, parent, history);

        const investigations = this.getInvestigations();
        this.values = [...investigations];
        this.headline =
            customHeadline ?? (investigations.length > 1 ? "Befunde" : "Befund");
        if (
            MR.V1_1_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary.is(
                value
            )
        ) {
            this.headline = "Allgemeine Angaben";
        } else if (MR.V1_1_0.Profile.ClinicalImpressionInitialExamination.is(value)) {
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
                    if (checkedItem) {
                        investigations.push(checkedItem);
                    }
                });
            }
        );

        if (MR.V1_1_0.Profile.ClinicalImpressionPregnancyChartEntry.is(this.value)) {
            const encounterRef = this.value.encounter.reference;

            const examinations =
                ParserUtil.getEntries<MR.V1_1_0.Profile.ObservationExamination>(
                    this.parent,
                    [MR.V1_1_0.Profile.ObservationExamination]
                );

            if (examinations) {
                examinations.forEach((res) => {
                    const ref = res.resource.encounter.reference;
                    if (ref === encounterRef) {
                        const model = new Models.MP.Basic.ObservationModel(
                            res.resource,
                            res.fullUrl,
                            this.parent as MR.V1_1_0.Profile.Bundle,
                            this.history
                        );

                        const codes = res.resource.code.coding.map((c) => c.code);
                        const isHb = codes.includes("718-7"); // Loinc: Hemoglobin [Mass/volume] in Blood
                        if (isHb) {
                            investigations.push(model.getMainValue());
                        }
                    }
                });
            }
        }

        return investigations;
    }

    public checkItem(item: InvestigationItemType): ModelValue | undefined {
        const mappings: DetailMapping[] = [
            {
                profile: PR.ObservationCatalogueA,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [CM.CatalogueAGerman]
            },
            // Gravidogramm - Observations,
            {
                profile: PR.ObservationBloodPressure,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationWeightMother,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationFundusHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationVaricosis,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationEdema,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationUrine,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationUrineSugar,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationUrineProtein,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationVaginalExamination,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationHeartSoundsChild,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [CM.HeartSoundsChildGerman]
            },
            {
                profile: PR.ObservationChildPosition,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [CM.ChildPositionGerman]
            },
            {
                profile: PR.ObservationChildPositionAtBirth,
                models: [Models.MP.Basic.ObservationModel],
                codeConceptMaps: [CM.ChildPositionGerman]
            },
            {
                profile: PR.ObservationChildMovement,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: PR.ObservationAge,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationGravida,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationPara,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Schwangerschaft
            {
                profile: PR.ObservationPresentationAtBirthClinic,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationInpatientStayDuringPregnancy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationNumberOfCheckups,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Geburt
            {
                profile: PR.ObservationExternalBirth,
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
                profile: PR.PatientChild,
                models: [Models.MP.Basic.PatientChildModel]
            },
            {
                profile: PR.ObservationWeightChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationHeadCircumference,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationBirthHeight,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationApgarScore,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationpHValueUmbilicalArtery,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationMalformation,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Wochenbett
            {
                profile: PR.ObservationPuerperiumNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationAntiDProphylaxisPostPartum,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationAdviceOnIodineIntake,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationBloodGroupSerologyChild,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationDirectCoombstest,
                models: [Models.MP.Basic.ObservationModel]
            },
            // Epikrise - Zweit Untersuchung
            {
                profile: PR.ObservationBreastfeedingBehavior,
                models: [Models.MP.Basic.ObservationModel],
                valueConceptMaps: [CM.BreastfeedingBehaviorGerman]
            },
            {
                profile: PR.ObservationGynecologicalFindingNormal,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationU3Performed,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationChildIsHealthy,
                models: [Models.MP.Basic.ObservationModel]
            },
            {
                profile: PR.ObservationNeedOfTreatmentU3,
                models: [Models.MP.Basic.ObservationModel]
            }
        ];

        const ref = item.reference;
        const result = ParserUtil.getEntryWithRef(
            this.parent,
            mappings.map((m) => m.profile),
            new Reference(ref, this.fullUrl)
        );

        const bundle = this.parent as MR.V1_1_0.Profile.Bundle;
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

            return model.getMainValue();
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
