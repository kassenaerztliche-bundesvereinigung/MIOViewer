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

import { ProcedureBaseModel } from "./Basic";
import { UI } from "../../components/";

export default class ProcedureCounsellingModel extends ProcedureBaseModel<MR.V1_00_000.Profile.ProcedureCounselling> {
    constructor(
        value: MR.V1_00_000.Profile.ProcedureCounselling,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History
    ) {
        super(value, parent, history);

        this.headline = this.getCoding();

        this.values = [
            ...this.values,
            {
                value: this.value.reasonCode
                    ? this.value.reasonCode
                          .map((code) => {
                              return code.coding.map((c) => {
                                  return ParserUtil.translateCode(
                                      c.code,
                                      MR.V1_00_000.ConceptMap.CounsellingGerman
                                  );
                              });
                          })
                          .join("\n")
                    : "-",
                label: "Beratungsgegenstand",
                renderAs: UI.ListItem.Bullet
            }
        ];
    }
}
