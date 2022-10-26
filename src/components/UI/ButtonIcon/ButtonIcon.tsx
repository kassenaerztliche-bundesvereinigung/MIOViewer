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

import React, { ReactNode } from "react";

import * as Icons from "react-feather";

import "./ButtonIcon.scss";

type ButtonIconProps = {
    icon: React.FC<Icons.IconProps>;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
    dataTestId?: string;
    text?: string;
    rightToLeft?: boolean;
    children?: ReactNode;
};

export default class ButtonIcon extends React.Component<ButtonIconProps> {
    public static defaultProps = {
        disabled: false,
        className: ""
    };

    render(): JSX.Element {
        const { icon, className, onClick, disabled, dataTestId, text, rightToLeft } =
            this.props;

        const Icon = icon;
        const classes = ["icon", className, rightToLeft ? "rtl" : ""];

        return (
            <button
                className={classes.join(" ")}
                onClick={onClick}
                disabled={disabled}
                data-testid={dataTestId ? dataTestId : "icon-button"}
            >
                {this.props.children ? (
                    this.props.children
                ) : (
                    <>
                        <Icon />
                        {text && <div className={"button-text"}>{text}</div>}
                    </>
                )}
            </button>
        );
    }
}
