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

import React from "react";
import { IonItem, IonLabel } from "@ionic/react";

import { ListItemProps } from "../Interfaces";
import ListItem from "../ListItem";

import "./ListItemBullet.scss";

export default class ListItemBullet extends ListItem<
    ListItemProps & { liClassName?: string },
    unknown
> {
    render(): JSX.Element {
        const { label, value, disabled, className, liClassName } = this.props;

        return (
            <IonItem
                className={
                    "list-item-bullet list-item item ios in-list item-label " + className
                }
                data-testid={`bullet-list-item-${label}`}
                disabled={disabled}
            >
                <IonLabel class={"ion-no-margin ion-align-items-center"}>
                    {value ? (
                        value.split("\n").length > 1 ? (
                            <ul className={"bullet"}>
                                {" "}
                                {value.split("\n").map((e, i) => (
                                    <li className={liClassName} key={i}>
                                        {e}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{value}</p>
                        )
                    ) : (
                        <p>-</p>
                    )}
                    <label>{label}</label>
                </IonLabel>
            </IonItem>
        );
    }
}
