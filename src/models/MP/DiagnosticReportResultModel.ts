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
import { Util } from "../../components";

import { ObservationModel } from "./Basic";
import MPBaseModel from "./MPBaseModel";
import { ModelValue } from "../BaseModel";

const PR = MR.V1_00_000.Profile;
const CM = MR.V1_00_000.ConceptMap;

export default class DiagnosticReportResultModel extends MPBaseModel<
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundII
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII
> {
    constructor(
        value:
            | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
            | MR.V1_00_000.Profile.DiagnosticReportUltrasoundII
            | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History,
        protected codeConceptMap: ParserUtil.ConceptMap[] | undefined = [
            CM.FindingsRequiredControlGerman,
            CM.PregnancyInformationGerman,
            CM.GeneralInformationGerman,
            CM.BiometricsIGerman,
            CM.BiometricsIIIIIGerman
        ]
    ) {
        super(value, parent, history);

        this.headline = "Befunde";

        this.values = [];
        if (this.value.result) {
            this.value.result.forEach((valueResult) => {
                const ref = valueResult.reference;

                const result = ParserUtil.getEntryWithRef<
                    | MR.V1_00_000.Profile.ObservationGeneralInformation
                    | MR.V1_00_000.Profile.ObservationPregnancyInformation
                    | MR.V1_00_000.Profile.ObservationSingletonPregnancy
                    | MR.V1_00_000.Profile.ObservationHeartAction
                    | MR.V1_00_000.Profile.ObservationLocalisationPlacenta
                    | MR.V1_00_000.Profile.ObservationChildPosition
                    | MR.V1_00_000.Profile.ObservationBiometricsI
                    | MR.V1_00_000.Profile.ObservationBiometricsII
                    | MR.V1_00_000.Profile.ObservationBiometricsIII
                    | MR.V1_00_000.Profile.ObservationPercentile
                    | MR.V1_00_000.Profile.ObservationTimelyDevelopment
                    | MR.V1_00_000.Profile.ObservationAbnormalities
                    | MR.V1_00_000.Profile.ObservationConsultationInitiated
                    | MR.V1_00_000.Profile.ObservationMorphology
                >(
                    parent,
                    [
                        PR.ObservationGeneralInformation,
                        PR.ObservationPregnancyInformation,
                        PR.ObservationSingletonPregnancy,
                        PR.ObservationHeartAction,
                        PR.ObservationLocalisationPlacenta,
                        PR.ObservationChildPosition,
                        PR.ObservationBiometricsI,
                        PR.ObservationBiometricsII,
                        PR.ObservationBiometricsIII,
                        PR.ObservationPercentile,
                        PR.ObservationTimelyDevelopment,
                        PR.ObservationAbnormalities,
                        PR.ObservationConsultationInitiated,
                        PR.ObservationMorphology
                    ],
                    ref
                );

                if (result) {
                    const resultCM = MR.V1_00_000.ConceptMap;
                    const model = new ObservationModel(
                        result.resource,
                        parent,
                        history,
                        [
                            resultCM.LocalisationPlacentaGerman,
                            resultCM.PregnancyInformationGerman
                        ],
                        [
                            resultCM.MorphologyGerman,
                            resultCM.GeneralInformationGerman,
                            resultCM.PregnancyInformationGerman,
                            resultCM.BiometricsIGerman,
                            resultCM.BiometricsIIIIIGerman
                        ]
                    );

                    this.values.push({
                        value: model.getObservationValue().value,
                        label: model.getCoding(),
                        onClick: Util.Misc.toEntryByRef(history, parent, ref, true)
                    });
                }
            });
        }
    }

    // eslint-disable-next-line
    public getCoding(resource?: unknown): string {
        return "";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }
}
