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

import { ParserUtil } from "@kbv/mioparser";

type _Display = {
    extension?: _Display[];
    valueString?: string;
};

type Coding = {
    resourceType?: "Coding";
    id?: string;
    system: string;
    version: string;
    code: string;
    display?: string;
    _display?: _Display;
    userSelected?: boolean;
};

type Code = {
    coding: Coding[];
    text?: string;
};

type CodingEmpty = {
    resourceType?: "Coding";
    id?: string;
    system?: string;
    version?: string;
    code?: string;
    display?: string;
    _display?: _Display;
    userSelected?: boolean;
};

type CodeEmpty = {
    coding?: CodingEmpty[];
    id?: string;
    text?: string;
};

export type { Code, Coding, CodeEmpty, CodingEmpty, _Display };

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
            if (ext.valueString) {
                return ext.valueString;
            } else if (ext.extension) {
                return handleCodingDisplay(ext).join(", ");
            } else {
                return "";
            }
        });
        results.push(mapped.join(", "));
    } else if (display.valueString) {
        results.push(display.valueString);
    }

    return results;
}

export function handleCode(
    code: Code | CodeEmpty,
    conceptMap?: ParserUtil.ConceptMap[]
): string[] {
    const codings = code.coding;
    if (codings && codings.length) {
        const translated: string[] = [];

        if (conceptMap) {
            codings.forEach((coding) => {
                if (!coding.code) {
                    return;
                }
                translated.push(
                    ...ParserUtil.multiTranslateCode(coding.code, conceptMap)
                );
            });
        }

        if (!translated.length) {
            const mapped: string[] = [];

            codings.forEach((coding) => {
                const _display = coding._display;
                if (_display && _display.extension) {
                    mapped.push(...handleCodingDisplay(_display));
                } else if (coding.display) {
                    mapped.push(coding.display);
                } else if (coding.code) {
                    mapped.push(coding.code);
                }
            });

            return Array.from(new Set(mapped));
        } else {
            return Array.from(new Set(translated));
        }
    } else if (code.text) {
        return [code.text];
    }

    return ["-"];
}

export function getCoding(
    resource?: { code?: Code },
    conceptMap?: ParserUtil.ConceptMap[],
    separator = ", "
): string {
    if (!resource || !resource.code) {
        return "-";
    }
    const code = handleCode(resource.code, conceptMap);
    return Array.from(new Set<string>(code)).join(separator);
}

export function handleCodeVS(
    c: Coding | CodingEmpty,
    valueSets: ParserUtil.ValueSet[]
): string[] {
    const results: Set<string> = new Set<string>();
    valueSets.forEach((valueSet) => {
        valueSet.forEach((include) => {
            const result = include.concept.filter((concept) => c.code === concept.code);
            if (result.length) {
                results.add(result[0].display ?? "-");
            }
        });
    });

    return Array.from(results);
}
