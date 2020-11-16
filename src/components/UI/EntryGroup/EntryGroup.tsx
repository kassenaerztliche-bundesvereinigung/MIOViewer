/*
 * Copyright (c) 2020. Kassenärztliche Bundesvereinigung, KBV
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

import { KBVResource, MIOEntry } from "@kbv/mioparser";

import { UI } from "../../index";

import "../DetailList/DetailList.scss";

export type EntryGroupTemplateValues<T extends KBVResource> = {
    entry: MIOEntry<T>;
    index: number;
};

export type EntryGroupProps<T extends KBVResource> = {
    type: string;
    headline: string;
    subline?: string;
    entries: MIOEntry<KBVResource>[];
    baseValues: (MIOEntry<T> | unknown)[];
    template: (values: EntryGroupTemplateValues<T>) => JSX.Element | undefined;
    compare?: (a: MIOEntry<T>, b: MIOEntry<T>) => number;
    smallLinkText?: string;
    toSmallLink?: () => void;
};

export default class EntryGroup<T extends KBVResource> extends React.Component<
    EntryGroupProps<T>,
    UI.DetailListStickyHeaderState
> {
    constructor(props: EntryGroupProps<T>) {
        super(props);

        this.state = {
            stuck: false
        };
    }

    render(): JSX.Element {
        const {
            type,
            headline,
            subline,
            template,
            compare,
            smallLinkText,
            toSmallLink
        } = this.props;

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
            <UI.DetailListStickyHeader className={"entry-group"}>
                <h5
                    className={
                        "ion-padding ion-no-margin green sticky" +
                        (this.state.stuck ? " stuck" : "")
                    }
                >
                    {headline}
                </h5>
                {subline && <small className={"ion-padding-horizontal"}>{subline}</small>}

                {(!content || content.length <= 0) && (
                    <UI.ListItemHint
                        label={"Hinweis"}
                        value={`Unter „${headline}“ sind in diesem ${type} derzeit keine Einträge vorhanden.`}
                    />
                )}

                <IonList className={"ion-no-padding"}>{content}</IonList>

                {toSmallLink && smallLinkText && (
                    <UI.ListItem
                        label={smallLinkText}
                        noValue={true}
                        onClick={toSmallLink}
                        className={"small"}
                    />
                )}
            </UI.DetailListStickyHeader>
        );
    }
}
