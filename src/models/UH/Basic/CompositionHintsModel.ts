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

import { CMR } from "@kbv/mioparser";
import { UI } from "../../../components";

import BaseModel from "./CMRBaseModel";
import { ModelValue } from "../../Types";

export type CompositionHintsType =
    | CMR.V1_0_1.Profile.CMRCompositionU1
    | CMR.V1_0_1.Profile.CMRCompositionU2
    | CMR.V1_0_1.Profile.CMRCompositionU3
    | CMR.V1_0_1.Profile.CMRCompositionU4
    | CMR.V1_0_1.Profile.CMRCompositionU5
    | CMR.V1_0_1.Profile.CMRCompositionU6
    | CMR.V1_0_1.Profile.CMRCompositionU7
    | CMR.V1_0_1.Profile.CMRCompositionU7a
    | CMR.V1_0_1.Profile.CMRCompositionU8
    | CMR.V1_0_1.Profile.CMRCompositionU9
    | CMR.V1_0_1.Profile.PCCompositionExaminationParticipation
    | CMR.V1_0_1.Profile.PNCompositionParentalNotes;

export default class CompositionHintsModel extends BaseModel<CompositionHintsType> {
    constructor(
        value: CompositionHintsType,
        fullUrl: string,
        parent:
            | CMR.V1_0_1.Profile.CMRBundle
            | CMR.V1_0_1.Profile.PCBundle
            | CMR.V1_0_1.Profile.PNBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Hinweise";

        const extension = this.value?.extension;
        if (!extension) return;

        const urlComment = "KBV_EX_Base_Additional_Comment";
        const urlNote = "KBV_EX_MIO_CMR_Note";
        const urlInstruction = "KBV_EX_MIO_CMR_Instruction";

        extension.forEach((ext: { url: string; valueString?: string }) => {
            const pre = "https://fhir.kbv.de/StructureDefinition/";

            if (ext.url === pre + urlComment) {
                this.values.push({
                    value: ext.valueString ?? "-",
                    label: "Einleitung",
                    renderAs: UI.ListItem.Collapsible
                });
            } else if (ext.url === pre + urlNote) {
                this.values.push({
                    value: ext.valueString ?? "-",
                    label: "Information für die Eltern",
                    renderAs: UI.ListItem.Collapsible
                });
            } else if (ext.url === pre + urlInstruction) {
                this.values.push({
                    value: ext.valueString ?? "-",
                    label: "Hinweis",
                    renderAs: UI.ListItem.Collapsible
                });
            }
        });
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value: this.headline,
            label: "-"
        };
    }
}
