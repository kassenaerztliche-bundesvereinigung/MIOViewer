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

import { RouteComponentProps } from "react-router";
import ListItem from "../ListItem";

import DetailListStickyHeader, {
    DetailListStickyHeaderState
} from "../DetailListStickyHeader";

import { UI } from "../../index";

import * as Models from "../../../models/";

import { ListItemProps } from "../ListItem/ListItem";

import "./DetailListModel.scss";

export type DetailListModelProps = {
    model: Models.Model;
    mio: KBVBundleResource;
    entry: KBVResource;
    className?: string;
};

export default abstract class DetailListModel extends DetailListStickyHeader<
    DetailListModelProps & RouteComponentProps,
    DetailListStickyHeaderState
> {
    protected constructor(props: DetailListModelProps & RouteComponentProps) {
        super(props);

        this.state = {
            stuck: false
        };
    }

    render(): JSX.Element {
        const headline = this.props.model.getHeadline();
        const values = this.props.model.getValues();

        return (
            <DetailListStickyHeader className={"detail-list"}>
                <h5 className={"ion-padding ion-no-margin green sticky"}>{headline}</h5>
                <div className={"ion-padding-bottom"}>
                    {values.length ? (
                        values.map((part: Models.ModelValue, index: number) => {
                            if (part.renderAs) {
                                const Component = part.renderAs as React.ComponentType<
                                    ListItemProps
                                >;
                                return (
                                    <Component
                                        label={part.label}
                                        value={part.value}
                                        key={"item_" + index}
                                    />
                                );
                            } else {
                                return (
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
                                );
                            }
                        })
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
