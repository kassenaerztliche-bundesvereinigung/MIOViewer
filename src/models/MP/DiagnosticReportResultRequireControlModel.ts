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
import { Content } from "pdfmake/interfaces";

const PR = MR.V1_00_000.Profile;

export default class DiagnosticReportResultRequireControlModel extends MPBaseModel<
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
        history?: History
    ) {
        super(value, parent, history);

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

    public getCoding(resource?: unknown): string {
        return "";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }

    // eslint-disable-next-line
    protected pdfContentHint(topic: string, parent = "MIO"): Content {
        return {
            text: `Unter „${topic}“ sind derzeit keine Einträge vorhanden.`,
            style: "hint"
        };
    }
}
