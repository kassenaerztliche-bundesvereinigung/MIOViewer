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

import { ParserUtil, KBVBundleResource, Vaccination, KBVBase } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { PractitionerModel } from "./";
import { AdditionalCommentModel, ModelValue, TelecomModel } from "../";
import { FHIR } from "../../components/Util";

export default class ConditionModel extends BaseModel<Vaccination.V1_1_0.Profile.Condition> {
    constructor(
        value: Vaccination.V1_1_0.Profile.Condition,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = Util.FHIR.handleCode(this.value.code, [
            Vaccination.V1_1_0.ConceptMap.PriorDiseaseGerman
        ]).join(", ");

        const onsetArray: string[] = [];
        const onsetExtension = this.value._onsetString?.extension;

        if (onsetExtension) {
            onsetExtension.forEach((e) => {
                if (Vaccination.V1_1_0.Profile.ConditionOnsetStringLebensphase.is(e)) {
                    onsetArray.push(
                        FHIR.handleCode(e.valueCodeableConcept, [
                            KBVBase.V1_1_1.ConceptMap.StageLifeGerman
                        ]).join(", ")
                    );
                }
            });
        }
        const onset = onsetArray.join(", ");

        const practitioner = Util.IM.getPractitioner(
            this.parent as Vaccination.V1_1_0.Profile.BundleEntry,
            this.value.recorder?.reference
        );

        let recorder = "-";
        if (practitioner) {
            recorder = Util.IM.getPractitionerName(practitioner?.resource);
        }

        const notes = this.value.note?.map((n) => n.text);

        let provenance = Util.IM.getProvenance(
            this.parent as Vaccination.V1_1_0.Profile.BundleEntry
        );

        if (provenance) {
            if (
                !provenance.resource.target
                    .map((t) => ParserUtil.getUuid(t.reference))
                    .includes(ParserUtil.getUuid(this.fullUrl))
            ) {
                provenance = undefined;
            }
        }

        this.values = [
            {
                value: this.value.onsetString
                    ? this.value.onsetString
                    : onset
                    ? onset
                    : "-",
                label: "Erkrankt als"
            },
            {
                value: Util.Misc.formatDate(this.value.recordedDate),
                label: "Dokumentiert am"
            },
            {
                value: notes && notes.length ? notes.join(", ") : "-",
                label: "Anmerkungen zur Erkrankung"
            },
            {
                value: recorder,
                label: "Dokumentiert von",
                onClick: this.history
                    ? Util.Misc.toEntry(history, parent, practitioner, true)
                    : undefined,
                subEntry: practitioner,
                subModels: [PractitionerModel, TelecomModel, AdditionalCommentModel]
            },
            {
                value: provenance
                    ? Util.FHIR.handleCode(
                          provenance.resource.agent[0].role[0] as Util.FHIR.Code,
                          [Vaccination.V1_1_0.ConceptMap.SourceofInformationGerman]
                      ).join(", ")
                    : "-",
                label: "Informationsquelle"
            }
        ];
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
            label: Util.Misc.formatDate(this.value.recordedDate),
            onClick: Util.Misc.toEntryByRef(this.history, this.parent, this.fullUrl)
        };
    }
}
