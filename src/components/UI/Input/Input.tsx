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
import * as Icons from "react-feather";
import "./Input.scss";

export type InputProps = {
    label?: string;
    disabled?: boolean;
    success?: boolean;
    warning?: boolean;
    error?: boolean;
    className?: string;
    placeHolder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default class Input extends React.Component<InputProps> {
    public static defaultProps = {
        label: "Label",
        disabled: false,
        success: false,
        warning: false,
        error: false,
        placeHolder: "Placeholder",
        className: ""
    };

    render(): JSX.Element {
        const isError = this.props.error;
        const isWarning = this.props.warning && !this.props.error;
        const isSuccess = this.props.success && !this.props.warning && !this.props.error;

        return (
            <div className={"input-container " + this.props.className}>
                <label>{this.props.label}</label>
                <input
                    type={"text"}
                    placeholder={this.props.placeHolder}
                    onChange={this.props.onChange}
                    disabled={this.props.disabled}
                    className={
                        this.props.className +
                        (this.props.success ? " success " : "") +
                        (this.props.warning ? "warning " : "") +
                        (this.props.error ? "danger" : "")
                    }
                />
                <Icons.X className={"danger" + (isError ? " visible" : "")} />
                <Icons.AlertCircle
                    className={"warning" + (isWarning ? " visible" : "")}
                />
                <Icons.Check className={"success" + (isSuccess ? " visible" : "")} />
            </div>
        );
    }
}
