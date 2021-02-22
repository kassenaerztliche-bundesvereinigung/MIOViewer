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
import { IonItem, IonLabel, IonNote } from "@ionic/react";
import * as Icons from "react-feather";

import "./ListItem.scss";

export type ListItemProps = {
    value?: string;
    label: string;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    disabled?: boolean;
    className?: string;
    noValue?: boolean;
    noLabel?: boolean;
    clampValue?: boolean;
    innerHTML?: boolean;
    sortValue?: string;
    sortDirection?: "desc" | "asc";
};

export default class ListItem<P extends ListItemProps, S> extends React.Component<P, S> {
    public static defaultProps = {
        disabled: false,
        className: "",
        noValue: false,
        clampValue: false,
        innerHTML: false
    };

    render(): JSX.Element {
        const {
            label,
            value,
            onClick,
            disabled,
            className,
            noValue,
            noLabel,
            clampValue,
            innerHTML
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
                    {!noValue &&
                        (!innerHTML ? (
                            <p>{value ?? (disabled ? "kein Eintrag vorhanden" : "-")}</p>
                        ) : (
                            <p
                                dangerouslySetInnerHTML={{
                                    __html:
                                        value ??
                                        (disabled ? "kein Eintrag vorhanden" : "-")
                                }}
                            />
                        ))}
                    {!noLabel && <label>{label}</label>}
                </IonLabel>
                {onClick && !className?.includes("small") && (
                    <IonNote
                        slot="end"
                        color={"green"}
                        className={
                            "ion-justify-content-center ion-align-items-center ion-no-padding"
                        }
                    >
                        <Icons.ChevronRight size={16} />
                    </IonNote>
                )}
            </IonItem>
        );
    }
}
