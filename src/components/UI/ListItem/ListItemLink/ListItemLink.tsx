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

import { IonItem, IonLabel } from "@ionic/react";

import { ListItemProps } from "../Interfaces";
import ListItem from "../ListItem";

export default class ListItemLink extends ListItem<ListItemProps, unknown> {
    public static defaultProps = {
        disabled: false,
        className: "info", // "info" | "success" | "warning" | "danger"
        noValue: false,
        clampValue: false,
        innerHTML: false
    };

    render(): JSX.Element {
        const {
            value,
            href,
            label,
            className,
            onClick,
            clampValue,
            noLabel,
            noValue,
            disabled
        } = this.props;

        return (
            <IonItem
                className={
                    "list-item item ios in-list item-label " +
                    (onClick
                        ? " clickable ion-activatable ion-focusable"
                        : "ion-no-padding ion-margin-horizontal") +
                    (clampValue ? " clamp-value" : "") +
                    (noLabel ? " no-label " : " ") +
                    className
                }
                onClick={onClick}
                disabled={disabled}
                data-testid={`list-item-${label}`}
            >
                <IonLabel
                    className={
                        "ion-no-margin ion-align-items-center" +
                        (disabled ? " disabled" : "") +
                        (noValue ? " no-value" : "")
                    }
                >
                    {href ? (
                        <p>
                            <a href={href} target="_blank" rel="noopener noreferrer">
                                {value}
                            </a>
                        </p>
                    ) : (
                        <p>{value}</p>
                    )}
                    {!noLabel && <label>{label}</label>}
                </IonLabel>
            </IonItem>
        );
    }
}
