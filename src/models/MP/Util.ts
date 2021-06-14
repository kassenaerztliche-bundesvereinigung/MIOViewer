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

import { ParserUtil } from "@kbv/mioparser";
import { Util } from "../../components";

export function getCoding(
    resource?: { code?: Util.FHIR.Code }, // eslint-disable-line
    codeConceptMap?: ParserUtil.ConceptMap[]
): string {
    const translated = resource?.code?.coding?.map((c: Util.FHIR.Coding) => {
        if (c._display && c._display.extension) {
            return c._display.extension
                .map((e) => e.extension?.map((ex) => ex.valueString))
                .join(", ");
        } else {
            if (codeConceptMap) {
                const translatedCode = Util.FHIR.translateCode(c.code, codeConceptMap);
                if (translatedCode.length) return translatedCode;
            }

            if (c.display) {
                if (c.code && c.code === "364599001") return "Angaben zum Fötus/Kind";
                else return c.display;
            } else {
                return c.code;
            }
        }
    });
    return translated ? Array.from(new Set<string>(translated.flat())).join(", ") : "-";
}
