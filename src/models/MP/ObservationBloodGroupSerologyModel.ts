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

import { ParserUtil, MR, Reference } from "@kbv/mioparser";
import { UI, Util } from "../../components";

import { ObservationModel } from "./Basic";
import { ModelValue } from "../Types";

export default class ObservationBloodGroupSerologyModel extends ObservationModel<
    | MR.V1_1_0.Profile.ObservationBloodGroupSerology
    | MR.V1_1_0.Profile.ObservationBloodGroupSerologyFetus
> {
    constructor(
        value:
            | MR.V1_1_0.Profile.ObservationBloodGroupSerology
            | MR.V1_1_0.Profile.ObservationBloodGroupSerologyFetus,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        super(
            value,
            fullUrl,
            parent,
            history,
            undefined,
            undefined,
            undefined,
            true,
            false
        );

        this.headline = this.getCoding();

        this.values = [...this.values, ...this.getComponents()];

        const disclaimer = this.getDisclaimer();
        if (disclaimer) {
            this.values.push({
                value: this.getDisclaimer(),
                label: "Hinweis an die behandelnde Person",
                renderAs: UI.ListItem.Collapsible
            });
        }
    }

    public getDisclaimer(): string {
        if (MR.V1_1_0.Profile.ObservationBloodGroupSerology.is(this.value)) {
            if (this.value.extension && this.value.extension.length) {
                return this.value.extension.map((e) => e.valueString).join(", ");
            }
            return "-";
        }

        return "";
    }

    public getComponents(): ModelValue[] {
        if (MR.V1_1_0.Profile.ObservationBloodGroupSerology.is(this.value)) {
            return this.value && this.value.component
                ? this.value.component.map((c) => {
                      if (MR.V1_1_0.Profile.ObservationBloodGroupSerologyAB0.is(c)) {
                          return {
                              value: c.valueCodeableConcept.coding
                                  .map((cm) =>
                                      ParserUtil.translateCode(
                                          cm.code,
                                          MR.V1_1_0.ConceptMap.AB0SystemGerman
                                      )
                                  )
                                  .join(", "),
                              label: "Blutgruppe nach AB0-System"
                          };
                      } else {
                          return {
                              value: c.valueCodeableConcept.coding
                                  .map((cm) =>
                                      ParserUtil.translateCode(
                                          cm.code,
                                          MR.V1_1_0.ConceptMap.RhesusSystemGerman
                                      )
                                  )
                                  .join(", "),
                              label: "Blutgruppe nach Rhesus-System"
                          };
                      }
                  })
                : [];
        } else {
            return this.value && this.value.component
                ? this.value.component.map((c) => {
                      return {
                          value: c.valueCodeableConcept.coding
                              .map((cm) =>
                                  ParserUtil.translateCode(
                                      cm.code,
                                      MR.V1_1_0.ConceptMap.RhesusSystemFetusGerman
                                  )
                              )
                              .join(", "),
                          label: "Blutgruppe nach Rhesus-System"
                      };
                  })
                : [];
        }

        return [];
    }

    getMainValue(): ModelValue {
        return {
            value: this.getComponents()
                .map((c) => c.value)
                .join(", "),
            label: this.customValueLabel ? this.customValueLabel : this.getCoding(),
            onClick: Util.Misc.toEntryByRef(
                this.history,
                this.parent,
                new Reference(this.fullUrl),
                true
            )
        };
    }
}
