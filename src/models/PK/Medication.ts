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

import { PKA } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { UI, Util } from "../../components";

export default class MedicationModel extends BaseModel<
    PKA.V1_0_0.Profile.NFDMedication | PKA.V1_0_0.Profile.NFDMedicationRecipe
> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDMedication | PKA.V1_0_0.Profile.NFDMedicationRecipe,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        let name = undefined;
        if (PKA.V1_0_0.Profile.NFDMedication.is(this.value)) {
            name = this.value.extension?.map((m) => m.valueString).join(", ");
            this.values.push({ value: name ?? "-", label: "Arzneimittelname" });
            this.headline = name ? name : "Medikationseintrag";
            const label =
                (this.value.code?.coding?.length ?? 0) > 1 ? "Medikamente" : "Medikament";
            this.values.push({ value: this.getCoding(), label });
        } else {
            this.headline = "Rezeptur eines Medikaments";
            this.values = [
                {
                    value: this.value.code.text,
                    label: this.getCoding(),
                    renderAs: UI.ListItem.NoLabel
                }
            ];
        }

        const form = this.getForm();
        if (form) {
            this.values.push(form);
        }

        this.values.push(...this.getIngredient());
    }

    protected getForm(): ModelValue | undefined {
        if (PKA.V1_0_0.Profile.NFDMedication.is(this.value)) {
            const coding = this.value.form?.coding;
            const form = coding?.map((c) =>
                Util.FHIR.handleCodeVS(c, [
                    PKA.V1_0_0.ValueSet.NFDSKBVDOSAGEFORMValueSet
                ]).join(", ")
            );

            return {
                value: form?.join(", ") ?? "-",
                label: "Applikationsform"
            };
        }
    }

    protected getIngredient(): ModelValue[] {
        const values: ModelValue[] = [];

        if (PKA.V1_0_0.Profile.NFDMedication.is(this.value)) {
            this.value.ingredient?.forEach((i) => {
                const value = Util.FHIR.handleCode(i.itemCodeableConcept).join(", ");
                let strength = "-";

                if (i.strength) {
                    const n = i.strength.numerator;
                    const d = i.strength.denominator;
                    const nstr = (n?.value ?? "") + (n?.unit ?? "");
                    const dstr = (d?.value ?? "") + (d?.unit ?? "");
                    const value = nstr !== dstr ? nstr + " / " + dstr : nstr;

                    strength = `${value}`;
                }

                values.push({ value, label: strength });
            });
        }

        return values;
    }

    public getCoding(): string {
        return Util.FHIR.handleCode(this.value.code).join(", ");
    }

    public getMainValue(): ModelValue {
        let renderAs = undefined;
        if (PKA.V1_0_0.Profile.NFDMedication.is(this.value)) {
            renderAs = UI.ListItem.NoLabel;
        }

        if (PKA.V1_0_0.Profile.NFDMedicationRecipe.is(this.value)) {
            return this.values[0];
        } else {
            return {
                label: this.getCoding(),
                value: this.headline,
                renderAs
            };
        }
    }
}
