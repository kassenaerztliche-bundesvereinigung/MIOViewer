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
import AnimateHeight from "react-animate-height";

import ListItem from "../ListItem";

import { ListItemProps } from "../ListItem/ListItem";

import "../ListItem/ListItem.scss";
import "./ListItemExpandable.scss";

export interface ListItemExpandableState {
    expanded: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default class ListItemExpandable extends ListItem<
    ListItemProps,
    ListItemExpandableState
> {
    constructor(props: ListItemProps) {
        super(props);

        this.state = {
            onClick: this.toggle,
            expanded: false
        };
    }

    toggle = (): void => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    render(): JSX.Element {
        const { expanded, onClick } = this.state;
        const { label, value, disabled, className, innerHTML } = this.props;

        const height = expanded ? "auto" : 0;

        return (
            <div className={"list-item-expandable"}>
                <div className={"expandable-wrapper" + (expanded ? " expanded" : "")}>
                    <IonItem
                        className={
                            "list-item expandable item ios in-list item-label ion-no-padding" +
                            className +
                            (onClick ? " ion-activatable ion-focusable" : "")
                        }
                        onClick={onClick}
                        disabled={disabled}
                        data-testid={`list-item-${label}`}
                    >
                        <IonLabel class={"ion-no-margin ion-align-items-center"}>
                            <label>{label}</label>
                        </IonLabel>
                        <IonNote
                            slot="end"
                            className={
                                "ion-justify-content-center ion-align-items-center ion-no-padding ion-no-margin"
                            }
                            color={"green"}
                        >
                            <Icons.ChevronDown size={16} />
                        </IonNote>
                    </IonItem>
                </div>
                <AnimateHeight
                    duration={300}
                    height={height}
                    className={"animate-height-container ion-margin-horizontal"}
                >
                    {innerHTML ? (
                        <p
                            className={"ion-no-margin"}
                            dangerouslySetInnerHTML={{
                                __html:
                                    value ?? (disabled ? "kein Eintrag vorhanden" : "-")
                            }}
                        />
                    ) : (
                        <p>{value ?? (disabled ? "kein Eintrag vorhanden" : "-")}</p>
                    )}
                </AnimateHeight>
            </div>
        );
    }
}
