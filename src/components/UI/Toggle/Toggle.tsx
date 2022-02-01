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

import { IonToggle } from "@ionic/react";

import "./Toggle.scss";

export type ToggleProps = {
    checked: boolean;
    onChange?: (checked: boolean) => void;
};

export default class Toggle extends React.Component<ToggleProps> {
    public static defaultProps = {
        checked: false
    };

    protected onChange = (checked: boolean): void => {
        if (this.props.onChange) this.props.onChange(checked);
    };

    render(): JSX.Element {
        return (
            <IonToggle
                checked={this.props.checked}
                onIonChange={(e) => this.onChange(e.detail.checked)}
                mode={"ios"}
            />
        );
    }
}
