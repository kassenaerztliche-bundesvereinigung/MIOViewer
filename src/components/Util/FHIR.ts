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

type _Display = {
    extension?: _Display[];
    valueString?: string;
};

type Coding = {
    system: string;
    version: string;
    code: string;
    display?: string;
    _display?: _Display;
};

type Code = {
    coding: Coding[];
    text?: string;
};

export type { Code, Coding, _Display };

export function translateCode(
    code: string,
    conceptMaps: ParserUtil.ConceptMap[]
): string[] {
    const translated: string[] = [];
    conceptMaps.forEach((conceptMap: ParserUtil.ConceptMap) => {
        if (conceptMap) {
            const translatedCode = ParserUtil.translateCode(code, conceptMap);

            if (code !== translatedCode.join(", ")) {
                translated.push(translatedCode.join(", "));
            }
        } else {
            translated.push(code);
        }
    });

    return translated;
}

export function handleCodingDisplay(display: _Display): string[] {
    const results: string[] = [];

    if (display.extension) {
        const mapped: string[] = display.extension?.map((ext: _Display) => {
            if (ext.valueString) return ext.valueString;
            else if (ext.extension) return handleCodingDisplay(ext).join(", ");
            else return "";
        });
        results.push(mapped.join(", "));
    } else if (display.valueString) {
        results.push(display.valueString);
    }

    return results;
}

export function handleCode(code: Code, conceptMap?: ParserUtil.ConceptMap[]): string[] {
    if (code.coding.length) {
        let translated: string[] = [];

        if (conceptMap) {
            translated = code.coding
                .map((coding) => ParserUtil.multiTranslateCode(coding.code, conceptMap))
                .flat();
        }

        if (!translated.length) {
            const mapped = code.coding.map((coding) => {
                const _display = coding._display;
                if (_display && _display.extension) {
                    return handleCodingDisplay(_display);
                } else {
                    return coding.display ?? coding.code;
                }
            });
            return mapped.flat();
        } else return translated;
    }

    return ["-"];
}

export function getCoding(
    resource?: { code?: Code },
    conceptMap?: ParserUtil.ConceptMap[],
    separator = ", "
): string {
    if (!resource || !resource.code) return "-";
    const code = handleCode(resource.code, conceptMap);
    return Array.from(new Set<string>(code)).join(separator);
}
