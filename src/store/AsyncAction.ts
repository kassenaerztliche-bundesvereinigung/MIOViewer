/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import { Dispatch } from "redux";

import { Actions, MIOActions } from "./";

import MIOParser, {
    KBVResource,
    KBVBundleResource,
    MIOParserResult
} from "@kbv/mioparser";

import PDFMaker from "../pdf/PDFMaker";

export async function parseMIO(
    dispatch: Dispatch<MIOActions>,
    file: Blob
): Promise<MIOParserResult | Error> {
    dispatch(Actions.setLoading(true));

    const parser = new MIOParser();

    let result;

    try {
        result = await parser.parseFile(file);
        return result;
    } catch (error) {
        result = error;
    }

    dispatch(Actions.setLoading(false));
    return result;
}

export async function parseMIOs(
    dispatch: Dispatch<MIOActions>,
    files: Blob[]
): Promise<MIOParserResult[] | Error> {
    dispatch(Actions.setLoading(true));

    const parser = new MIOParser();

    let results;

    try {
        results = await parser.parseFiles(files);
    } catch (error) {
        results = error;
    }

    dispatch(Actions.setLoading(false));
    return results;
}

export async function addMIO(
    dispatch: Dispatch<MIOActions>,
    item: KBVBundleResource
): Promise<void> {
    dispatch(Actions.setLoading(true));
    dispatch(Actions.addMIO(item));
    dispatch(Actions.setLoading(false));
}

export async function setLoading(
    dispatch: Dispatch<MIOActions>,
    value: boolean
): Promise<void> {
    dispatch(Actions.setLoading(value));
}

export async function makePDF(
    dispatch: Dispatch<MIOActions>,
    value: KBVResource | KBVBundleResource | undefined
): Promise<void> {
    dispatch(Actions.setLoading(true));
    const pdf = await PDFMaker.create(value);
    pdf.open();
    dispatch(Actions.setLoading(false));
}

export async function setShowIntro(
    dispatch: Dispatch<MIOActions>,
    value: boolean
): Promise<void> {
    dispatch(Actions.setShowIntro(value));
}

export async function acceptCookies(
    dispatch: Dispatch<MIOActions>,
    value: boolean
): Promise<void> {
    dispatch(Actions.acceptCookies(value));
}
