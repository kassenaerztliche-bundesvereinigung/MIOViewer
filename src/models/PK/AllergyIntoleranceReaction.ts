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

import { PKA, PS } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

export default class AllergyIntoleranceModel extends BaseModel<PKA.V1_0_0.Profile.NFDAllergyIntolerance> {
    constructor(
        value: PKA.V1_0_0.Profile.NFDAllergyIntolerance,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = (value.reaction?.length ?? 0) > 1 ? "Reaktionen" : "Reaktion";

        this.values = [...AllergyIntoleranceModel.getReactions(value)];
    }

    public static getReactions(
        value: PKA.V1_0_0.Profile.NFDAllergyIntolerance
    ): ModelValue[] {
        const values: ModelValue[] = [];

        value.reaction?.forEach((r) => {
            const s = r.substance;

            const m = r.manifestation;

            values.push({
                value: m
                    ?.map((m) => {
                        const dataAbsent = m.extension?.some((e) =>
                            PKA.V1_0_0.Profile.NFDAllergyIntoleranceReactionManifestationDataabsentreason.is(
                                e
                            )
                        );

                        return dataAbsent
                            ? "Nicht bekannt"
                            : Util.FHIR.handleCode(m, [
                                  PKA.V1_0_0.ConceptMap.NFDReactionAllergyGerman
                              ]).join(", ");
                    })
                    .join(", "),
                label: s
                    ? "durch " +
                      Util.FHIR.handleCode(s, [
                          PS.V1_0_0.ConceptMap.SubstanceTopATCSnomedGerman,
                          PS.V1_0_0.ConceptMap.TopSubstanceSNOMEDCTGerman
                      ]).join(", ")
                    : "-"
            });
        });

        return values;
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        const reactions = AllergyIntoleranceModel.getReactions(this.value);
        return {
            value: reactions
                .filter((r) => r.label === "Substanz")
                .map((r) => r.value)
                .join(""),
            label: reactions
                .filter((r) => r.label === "Reaktion")
                .map((r) => r.value)
                .join("")
        };
    }
}
