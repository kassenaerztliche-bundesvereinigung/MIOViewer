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

import { Content } from "pdfmake/interfaces";

export const horizontalLine = {
    table: {
        widths: ["*"],
        body: [[" "], [" "]],
        margin: [0, 20, 0, 0]
    },
    layout: {
        // eslint-disable-next-line
        hLineWidth: (i: number, node: any): number => {
            return i === 0 || i === node.table.body.length ? 0 : 0.5;
        },
        vLineWidth: (): number => {
            return 0;
        },
        hLineColor: (): string => {
            return "#d8dfe2";
        }
    }
};

export const pageBreakBefore: Content = { text: "", pageBreak: "before" };

export const pageBreakAfter: Content = { text: "", pageBreak: "after" };
