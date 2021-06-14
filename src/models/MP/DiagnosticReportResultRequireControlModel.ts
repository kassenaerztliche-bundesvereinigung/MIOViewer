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
import { Content } from "pdfmake/interfaces";
import { ModelValue } from "../Types";

const PR = MR.V1_00_000.Profile;

export type DiagnosticReportResultRequireControlType =
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundII
    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII;

export default class DiagnosticReportResultRequireControlModel extends MPBaseModel<DiagnosticReportResultRequireControlType> {
    constructor(
        value: DiagnosticReportResultRequireControlType,
        fullUrl: string,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Kontrollbedürftige Befunde";

        this.values = [];
        if (this.value.result) {
            this.value.result.forEach((valueResult) => {
                const ref = valueResult.reference;

                const result = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationFindingsRequiredControl>(
                    parent,
                    [PR.ObservationFindingsRequiredControl],
                    ref
                );

                if (result) {
                    const CM = MR.V1_00_000.ConceptMap;
                    const model = new ObservationModel(
                        result.resource,
                        result.fullUrl,
                        parent,
                        history,
                        undefined,
                        [CM.FindingsRequiredControlGerman]
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

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.map((v) => v.value).join(", "),
            label: this.headline
        };
    }

    // eslint-disable-next-line
    protected pdfContentHint(topic: string, parent = "MIO"): Content {
        return {
            text: `Unter „${topic}“ sind derzeit keine Einträge vorhanden.`,
            style: "hint"
        };
    }
}
