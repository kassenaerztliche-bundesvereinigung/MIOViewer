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
import * as Icons from "react-feather";
import AnimateHeight from "react-animate-height";

import { IonList } from "@ionic/react";

import { UI } from "../../index";

import { ListListSimpleProps } from "./DetailListSimple";
import { isModelValue } from "../../../models/Types";

export type ListGroupProps = {
    expandable: boolean;
    expanded?: boolean;
} & ListListSimpleProps;

export type DetailListCollapsibleState = {
    expanded: boolean;
} & UI.DetailList.StickyHeaderState;

export default class DetailListCollapsible extends React.Component<
    ListGroupProps,
    DetailListCollapsibleState
> {
    constructor(props: ListGroupProps) {
        super(props);

        this.state = {
            stuck: false,
            expanded: props.expanded ?? false
        };
    }

    toggle = (): void => {
        if (this.props.expandable) {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    };

    render(): JSX.Element {
        const { stuck, expanded } = this.state;
        const { type, headline, subline, minorHints, items, expandable } = this.props;

        const content = items.map((item, index) => {
            if (isModelValue(item)) {
                const Component = item.renderAs ?? UI.ListItem.Basic;
                return <Component {...item} key={index} />;
            } else {
                return <UI.ListItem.Basic {...item} key={index} />;
            }
        });

        const height = expanded ? "auto" : 0;
        const hasNoContent = !content || content.length <= 0;

        return (
            <UI.DetailList.StickyHeader
                className={
                    "detail-list" +
                    (expandable ? " expandable" : "") +
                    (expanded ? " expanded" : "")
                }
            >
                <h5
                    className={"green sticky" + (stuck ? " stuck" : "")}
                    onClick={this.toggle}
                >
                    <div className={"inner"}>
                        {expandable ? (
                            <span className={"text"}>{headline}</span>
                        ) : (
                            headline
                        )}
                        {expandable && (
                            <span className={"toggle"}>
                                <Icons.ChevronDown size={16} />
                            </span>
                        )}
                    </div>
                </h5>

                <AnimateHeight
                    duration={300}
                    height={height}
                    className={"animate-height-container"}
                >
                    {subline && <UI.ListItem.HintBox label={"Hinweis"} value={subline} />}
                    {minorHints &&
                        minorHints.map((hint, i) => {
                            if (hint.renderAs) {
                                const Component = hint.renderAs;
                                return (
                                    <Component
                                        key={`${hint.value}-${i}`}
                                        label={hint.label}
                                        value={hint.value}
                                    />
                                );
                            } else {
                                return (
                                    <UI.ListItem.Hint
                                        key={`${hint.value}-${i}`}
                                        label={hint.label}
                                        value={hint.value}
                                    />
                                );
                            }
                        })}
                    {hasNoContent && (
                        <UI.ListItem.Hint
                            label={"Hinweis"}
                            value={`Unter „${headline}“ sind in diesem ${type} derzeit keine Einträge vorhanden.`}
                        />
                    )}
                    <IonList className={"ion-no-padding"}>{content}</IonList>
                </AnimateHeight>
            </UI.DetailList.StickyHeader>
        );
    }
}
