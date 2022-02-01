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

import React from "react";
import { History } from "history";

import { KBVBundleResource, KBVResource, MIOEntry } from "@kbv/mioparser";

import * as UI from "../components/UI";
import * as Models from "./index";

export type RenderComponent = React.ComponentType<UI.ListItem.Props>;

export type ModelValue = UI.ListItem.Content & {
    value: string; // Override possibility of undefined in UI.ListItem.Content
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    renderAs?: RenderComponent;
    sortBy?: string;
    subEntry?: MIOEntry<KBVResource>;
    subModels?: (new (
        value: any, // eslint-disable-line
        fullUrl: string,
        parent: KBVBundleResource,
        history?: History
    ) => Models.Model)[];
} & UI.Clickable;

export function isModelValue(v: unknown): v is ModelValue {
    return (
        Object.prototype.hasOwnProperty.call(v, "renderAs") ||
        Object.prototype.hasOwnProperty.call(v, "sortBy") ||
        Object.prototype.hasOwnProperty.call(v, "subEntry") ||
        Object.prototype.hasOwnProperty.call(v, "subModels")
    );
}
