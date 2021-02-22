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

import { MR } from "@kbv/mioparser";
import { Util } from "../../components";

import { ObservationModel } from "./Basic";
import { ModelValue } from "../BaseModel";

export default class ObservationMenstrualCycleModel extends ObservationModel<MR.V1_00_000.Profile.ObservationMenstrualCycle> {
    constructor(
        value: MR.V1_00_000.Profile.ObservationMenstrualCycle,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, parent, history, undefined, undefined, undefined, true, false);
        this.headline = this.getCoding();

        const components: ModelValue[] = this.value.component
            ? this.value.component.map((c) => {
                  if (
                      MR.V1_00_000.Profile.ObservationMenstrualCycleZykluslaenge.is(c) ||
                      MR.V1_00_000.Profile.ObservationMenstrualCycleBlutungsdauer.is(c)
                  ) {
                      return {
                          value: c.valueQuantity.value + " " + c.valueQuantity.unit,
                          label: c.code.text
                      };
                  } else {
                      return {
                          value: Util.Misc.formatDate(c.valueDateTime),
                          label: c.code.text
                      };
                  }
              })
            : [];

        this.values = [...this.values, ...components];
    }
}
