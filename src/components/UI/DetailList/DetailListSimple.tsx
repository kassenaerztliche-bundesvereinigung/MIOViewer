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

import { IonList } from "@ionic/react";

import { KBVResource } from "@kbv/mioparser";

import { UI } from "../../index";

export type ListListSimpleProps<T extends KBVResource> = {
    type: string;
} & UI.DetailList.Props;

export default class DetailListSimple<T extends KBVResource> extends React.Component<
    ListListSimpleProps<T>,
    UI.DetailList.StickyHeaderState
> {
    constructor(props: ListListSimpleProps<T>) {
        super(props);

        this.state = {
            stuck: false
        };
    }

    render(): JSX.Element {
        const { stuck } = this.state;
        const { type, headline, subline, items } = this.props;

        const content = items.map((item, index) => {
            if (item.value) {
                return <UI.ListItem {...item} key={index} />;
            } else {
                return <UI.ListItemNoValue {...item} key={index} />;
            }
        });

        return (
            <UI.DetailList.StickyHeader className={"detail-list"}>
                {headline && (
                    <h5 className={"green sticky" + (stuck ? " stuck" : "")}>
                        <div className={"inner"}>{headline}</div>
                    </h5>
                )}
                {subline && <small className={"ion-padding-horizontal"}>{subline}</small>}
                {(!content || content.length <= 0) && (
                    <UI.ListItemHint
                        label={"Hinweis"}
                        value={`Unter „${headline}“ sind in diesem ${type} derzeit keine Einträge vorhanden.`}
                    />
                )}

                <IonList className={"ion-no-padding"}>{content}</IonList>
            </UI.DetailList.StickyHeader>
        );
    }
}
