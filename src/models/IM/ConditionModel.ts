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

import { KBVBundleResource, Vaccination } from "@kbv/mioparser";
import { Util } from "../../components";

import BaseModel from "../BaseModel";
import { PractitionerModel } from "./";
import { AdditionalCommentModel, ModelValue, TelecomModel } from "../";

export default class ConditionModel extends BaseModel<Vaccination.V1_00_000.Profile.Condition> {
    constructor(
        value: Vaccination.V1_00_000.Profile.Condition,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.value.code.text;

        let onsetArray: string[] = [];
        const onsetExtension = this.value._onsetString?.extension;

        if (onsetExtension) {
            onsetArray = onsetExtension
                .filter((e) =>
                    Vaccination.V1_00_000.Profile.ConditionOnsetStringLebensphase.is(e)
                )
                .map(
                    (e) =>
                        (e as Vaccination.V1_00_000.Profile.ConditionOnsetStringLebensphase)
                            .valueCodeableConcept.text
                );
        }
        const onset = onsetArray.join(", ");

        const practitioner = Util.IM.getPractitioner(
            this.parent as Vaccination.V1_00_000.Profile.BundleEntry,
            this.value.recorder?.reference
        );

        let recorder = "-";
        if (practitioner) {
            recorder = Util.IM.getPractitionerName(practitioner?.resource);
        }

        const notes = this.value.note?.map((n) => n.text);

        let provenance = Util.IM.getProvenance(
            this.parent as Vaccination.V1_00_000.Profile.BundleEntry
        );

        if (provenance) {
            if (
                provenance.resource.target
                    .map((t: { reference: string }) => t.reference)
                    .includes(this.value.id)
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
                value: provenance ? provenance.resource.agent[0].role[0].text : "-",
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
            value: this.value.code.text,
            label: Util.Misc.formatDate(this.value.recordedDate)
        };
    }
}
