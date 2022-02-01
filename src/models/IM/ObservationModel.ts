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

import { KBVBundleResource, Vaccination, Reference } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { ModelValue } from "../Types";

export default class ObservationModel extends BaseModel<Vaccination.V1_1_0.Profile.ObservationImmunizationStatus> {
    constructor(
        value: Vaccination.V1_1_0.Profile.ObservationImmunizationStatus,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.FHIR.handleCode(this.value.code, [
            Vaccination.V1_1_0.ConceptMap.LabImmuneReactionTestPresenceGerman
        ]).join(", ");

        this.values.push({
            value: Util.Misc.formatDate(this.value.issued),
            label: "Datum des Tests"
        });

        const interpretation = this.value.interpretation;
        this.values.push({
            value: interpretation
                ? interpretation
                      .map((i) =>
                          Util.FHIR.handleCode(i, [
                              Vaccination.V1_1_0.ConceptMap.LabTiterImmunityGerman
                          ])
                      )
                      .join(", ")
                : "-",
            label: "Ergebnis"
        });

        this.values.push({
            value:
                this.value.note && this.value.note.length
                    ? this.value.note.map((n) => n.text).join(", ")
                    : "-",
            label: "Anmerkungen zum durchgeführten Test"
        });
    }

    public toString(): string {
        return (
            this.headline +
            "\n\n" +
            this.values.map((v) => v.label + ": " + v.value).join("\n") +
            "\n\n"
        );
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: Util.Misc.formatDate(this.value.issued),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl)
            )
        };
    }
}
