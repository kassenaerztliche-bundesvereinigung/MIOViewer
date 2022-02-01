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

import { MIOClassName } from "../";

import "./MIOFolder.scss";

export interface MIOFolderProps {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    outlined?: boolean;
    className?: MIOClassName;
    label?: string;
    subline?: string;
    labelBG?: boolean;
    badge?: string;
}

export default class MIOFolder extends React.Component<MIOFolderProps> {
    public static defaultProps = {
        outlined: false,
        className: "",
        label: "",
        labelBG: false
    };

    render(): JSX.Element {
        const { children, className, onClick, outlined, label, subline, labelBG, badge } =
            this.props;

        return (
            <div className={"mio-folder " + className} onClick={onClick}>
                <svg
                    width="160"
                    height="128"
                    viewBox="0 0 160 128"
                    version="1.1"
                    className={"folder" + (outlined ? " outlined" : "")}
                >
                    <title>Ein Ordner-Symbol das ein MIO repräsentiert</title>
                    {!outlined ? (
                        <path d="M148,128 L12,128 C 5.5,128 0,122.5 0,116 L0,12 C 0,5.5 5.5,0 12,0 L56,0 L56,0 L67,13 L148,13 C 154.5,13 160,18.5 160,25 L160,116 C 160,122.5 154.5,128 148,128 Z" />
                    ) : (
                        <path d="M147,127 L12,127 C 5.5,127 1,122.5 1,116 L1,12 C 1,5.5 5.5,1 12,1 L56,1 L56,1 L67,13 L147,13 C 154.5,13 159,18.5 159,25 L159,116 C 159,122.5 154.5,127 147,127 Z" />
                    )}
                    {label && labelBG ? (
                        <path
                            className={"label-bg"}
                            d="M0,78 L160,78 L160,116 C 160,122.5 154.5,128 148,128 L12,128 C 5.5,128 0,122.5 0,116 L0,12 L0,78 Z"
                            opacity="0.4"
                            fill="#385C6B"
                        />
                    ) : undefined}
                </svg>
                <div className={"content " + (label ? "hasLabel" : "")}>
                    {badge && <div className="badge">{badge}</div>}
                    {children}
                </div>
                {label ? (
                    <div className={"text-container"}>
                        <div className={"inner" + (subline ? " has-subline" : "")}>
                            <label>{label}</label>
                            {subline && <p>{subline}</p>}
                        </div>
                    </div>
                ) : undefined}
            </div>
        );
    }
}
