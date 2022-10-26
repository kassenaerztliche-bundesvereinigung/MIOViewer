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
import AnimateHeight from "react-animate-height";
import * as Icons from "react-feather";

import { IonList } from "@ionic/react";

import { KBVResource, MIOEntry } from "@kbv/mioparser";

import { UI } from "../../index";

import "../DetailList/DetailList.scss";

export type EntryGroupTemplateValues<T extends KBVResource> = {
    entry: MIOEntry<T>;
    index: number;
};

export type EntryGroupProps<T extends KBVResource> = {
    type: string;
    headline?: string;
    subline?: string;
    entries: MIOEntry<KBVResource>[];
    baseValues: (MIOEntry<T> | unknown)[];
    template: (values: EntryGroupTemplateValues<T>) => JSX.Element | undefined;
    compare?: (a: MIOEntry<T>, b: MIOEntry<T>) => number;
    smallLinkText?: string;
    toSmallLink?: () => void;
    expandable?: boolean;
};

export type EntryGroupState = {
    expanded: boolean;
} & UI.DetailList.StickyHeaderState;

export default class EntryGroup<T extends KBVResource> extends React.Component<
    EntryGroupProps<T>,
    EntryGroupState
> {
    constructor(props: EntryGroupProps<T>) {
        super(props);

        this.state = {
            stuck: false,
            expanded: !props.expandable
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

        const {
            type,
            headline,
            subline,
            template,
            compare,
            smallLinkText,
            toSmallLink,
            expandable
        } = this.props;

        const height = expanded ? "auto" : 0;

        const filtered: MIOEntry<T>[] = [];
        this.props.entries.forEach((entry) => {
            // eslint-disable-next-line
            if (this.props.baseValues.some((b) => (b as any).is(entry.resource))) {
                filtered.push({
                    fullUrl: entry.fullUrl,
                    resource: entry.resource as T
                });
            }
        });
        filtered.sort(compare);

        const notUndefined = (v: JSX.Element | undefined | boolean) =>
            v !== undefined && v !== false;

        const content = filtered
            .map((entry: MIOEntry<T>, index) =>
                template({
                    entry: entry,
                    index: index
                })
            )
            .filter(notUndefined);

        return (
            <UI.DetailList.StickyHeader
                className={
                    "detail-list" +
                    (expandable ? " expandable" : "") +
                    (expanded ? " expanded" : "")
                }
            >
                {headline && (
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
                )}

                <AnimateHeight
                    duration={300}
                    height={height}
                    className={"animate-height-container"}
                >
                    {subline && (
                        <small className={"ion-padding-horizontal"}>{subline}</small>
                    )}
                    {(!content || content.length <= 0) && (
                        <UI.ListItem.Hint
                            label={"Hinweis"}
                            value={`Unter „${headline}“ sind in ${
                                type === "Patientenkurzakte" ? "dieser" : "diesem"
                            } ${type} derzeit keine Einträge vorhanden.`}
                        />
                    )}
                    <IonList className={"ion-no-padding"}>{content}</IonList>
                </AnimateHeight>

                {toSmallLink && smallLinkText && (
                    <UI.ListItem.Basic
                        label={smallLinkText}
                        noValue={true}
                        onClick={toSmallLink}
                        className={"small"}
                    />
                )}
            </UI.DetailList.StickyHeader>
        );
    }
}
