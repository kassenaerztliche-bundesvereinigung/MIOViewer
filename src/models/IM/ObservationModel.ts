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
import { PractitionerModel } from "./index";
import { AdditionalCommentModel, TelecomModel } from "../Comprehensive";
import { ModelValue } from "../Types";

export default class ObservationModel extends BaseModel<Vaccination.V1_00_000.Profile.ObservationImmunizationStatus> {
    constructor(
        value: Vaccination.V1_00_000.Profile.ObservationImmunizationStatus,
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = this.value.code.text;

        this.values.push({
            value: Util.Misc.formatDate(this.value.issued),
            label: "Datum des Tests"
        });

        this.values.push({
            value: this.value.interpretation.map((i) => i.text).join(", "),
            label: "Ergebnis"
        });

        this.values.push({
            value:
                this.value.note && this.value.note.length
                    ? this.value.note.map((n) => n.text).join(", ")
                    : "-",
            label: "Anmerkungen zum durchgeführten Test"
        });

        let performerName = undefined;
        let performerRef = undefined;
        let performer = undefined;
        if (this.value.performer && this.value.performer.length > 0) {
            performerRef = this.value.performer[0].reference;
            performer = Util.IM.getPractitioner(
                this.parent as Vaccination.V1_00_000.Profile.BundleEntry,
                performerRef
            );
            performerName = Util.IM.getPractitionerName(performer?.resource);
        }

        this.values.push({
            value: performerName ? performerName : "-",
            label: "Dokumentiert von",
            onClick: Util.Misc.toEntryByRef(history, parent, performerRef, true),
            subEntry: performer,
            subModels: [PractitionerModel, TelecomModel, AdditionalCommentModel]
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
            value: this.value.code.text,
            label: Util.Misc.formatDate(this.value.issued)
        };
    }
}
