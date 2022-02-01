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

import ListItemBullet from "../ListItemBullet";

import "./ListItemHintBox.scss";

export default class ListItemHintBox extends ListItem<ListItemProps, unknown> {
    public static defaultProps = {
        disabled: false,
        className: "info", // "info" | "success" | "warning" | "danger"
        noValue: false,
        clampValue: false,
        innerHTML: false
    };

    static getBulletStrings(value?: string): string[] {
        return value?.split(" - ").filter((s) => s) ?? [];
    }

    render(): JSX.Element {
        const { label, value, className } = this.props;
        const bulletStrings = ListItemHintBox.getBulletStrings(value);

        return (
            <IonItem
                className={
                    "list-item-hint-box ion-no-margin ion-align-items-start ion-nowrap " +
                    className
                }
                detail={false}
            >
                <IonLabel className={"ion-no-padding ion-no-margin ion-text-wrap"}>
                    <h4>{label}</h4>
                    {bulletStrings.length ? (
                        <ListItemBullet
                            liClassName={"hint-box"}
                            label={""}
                            value={bulletStrings.join("\n") ?? ""}
                        />
                    ) : (
                        <p>{value}</p>
                    )}
                </IonLabel>
            </IonItem>
        );
    }
}
