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

import { IonList } from "@ionic/react";

import { UI } from "../../index";
import { isModelValue } from "../../../models/Types";

export type ListListSimpleProps = {
    type: string;
} & UI.DetailList.Props;

export default class DetailListSimple extends React.Component<
    ListListSimpleProps,
    UI.DetailList.StickyHeaderState
> {
    constructor(props: ListListSimpleProps) {
        super(props);

        this.state = {
            stuck: false
        };
    }

    render(): JSX.Element {
        const { stuck } = this.state;
        const { type, headline, subline, items } = this.props;

        const content = items.map((item, index) => {
            if (isModelValue(item)) {
                const Component = item.renderAs ?? UI.ListItem.Basic;
                return <Component {...item} key={index} />;
            } else if (!item.label) {
                return <UI.ListItem.NoLabel {...item} key={index} />;
            } else if (item.value) {
                return <UI.ListItem.Basic {...item} key={index} />;
            } else {
                return <UI.ListItem.NoValue {...item} key={index} />;
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
                    <UI.ListItem.Hint
                        label={"Hinweis"}
                        value={`Unter „${headline}“ sind in diesem ${type} derzeit keine Einträge vorhanden.`}
                    />
                )}

                <IonList className={"ion-no-padding"}>{content}</IonList>
            </UI.DetailList.StickyHeader>
        );
    }
}
