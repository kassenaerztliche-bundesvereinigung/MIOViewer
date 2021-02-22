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

import { DetailListProps } from "./Interfaces";

import DetailListModel, { DetailListModelProps } from "./DetailListModel";

import DetailListSimple from "./DetailListSimple";

import DetailListCollapsible from "./DetailListCollapsible";

import DetailListStickyHeader, {
    DetailListStickyHeaderProps,
    DetailListStickyHeaderState
} from "./DetailListStickyHeader";

export type {
    DetailListProps as Props,
    DetailListModelProps as ModelProps,
    DetailListStickyHeaderProps as StickyHeaderProps,
    DetailListStickyHeaderState as StickyHeaderState
};

export {
    DetailListModel as Model,
    DetailListStickyHeader as StickyHeader,
    DetailListSimple as Simple,
    DetailListCollapsible as Collapsible
};
