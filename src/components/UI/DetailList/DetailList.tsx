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

import { KBVResource, KBVBundleResource } from "@kbv/mioparser";

import ListItem from "../ListItem";

import "./DetailList.scss";
import DetailListStickyHeader, {
    DetailListStickyHeaderState
} from "../DetailListStickyHeader/DetailListStickyHeader";
import { RouteComponentProps } from "react-router";
import { UI } from "../../index";

export interface DetailListContentPart {
    label: string;
    value: string;
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export type DetailListProps = {
    mio: KBVBundleResource;
    entry: KBVResource;
    className?: string;
};

export type DetailListState = {
    headline: string;
    contentParts: DetailListContentPart[];
};

export default abstract class DetailList<
    T extends KBVResource
> extends DetailListStickyHeader<
    DetailListProps & RouteComponentProps,
    DetailListState & DetailListStickyHeaderState
> {
    constructor(props: DetailListProps & RouteComponentProps) {
        super(props);

        this.state = {
            headline: "DetailList",
            contentParts: [],
            stuck: false
        };
    }

    componentDidMount(): void {
        super.componentDidMount();

        this.setState({
            headline: this.getHeadline(),
            contentParts: this.getContentParts()
        });
    }

    protected getDetailEntry = (): T => {
        const { entry } = this.props;
        return entry as T;
    };

    public abstract getHeadline(): string;
    public abstract getContentParts(): DetailListContentPart[];

    render(): JSX.Element {
        const { headline, contentParts } = this.state;

        return (
            <DetailListStickyHeader className={"detail-list"}>
                <h5 className={"ion-padding ion-no-margin green sticky"}>{headline}</h5>
                <div className={"ion-padding-bottom"}>
                    {contentParts.length ? (
                        contentParts.map((part, index) => (
                            <ListItem
                                label={part.label}
                                value={part.value}
                                onClick={part.onClick}
                                key={"item_" + index}
                                className={
                                    part.onClick
                                        ? ""
                                        : "ion-no-padding ion-margin-horizontal"
                                }
                            />
                        ))
                    ) : (
                        <UI.ListItemHint
                            label={"Hinweis"}
                            value={`Unter „${headline}“ sind derzeit keine Inhalte vorhanden.`}
                        />
                    )}
                </div>
            </DetailListStickyHeader>
        );
    }
}
