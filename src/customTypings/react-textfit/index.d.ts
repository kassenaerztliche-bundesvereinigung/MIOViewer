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

declare module "react-textfit" {
    import * as React from "react";

    export interface TextFitProps {
        mode?: "single" | "multi";
        forceSingleModeWidth?: boolean;
        min?: number;
        max?: number;
        throttle?: number;
        readonly?: (fontSize: number) => void;
    }

    export default class TextFit extends React.Component<TextFitProps, any> {}
}
