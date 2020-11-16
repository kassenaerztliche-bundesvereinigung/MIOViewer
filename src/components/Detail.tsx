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
import { KBVBundleResource, KBVResource } from "@kbv/mioparser";
import { RouteComponentProps } from "react-router";
import { Model } from "../models";
import { UI } from "./";

export type DetailProps = {
    models: Model[];
    mio: KBVBundleResource;
    entry: KBVResource;
    className?: string;
};

export default class Detail extends React.Component<DetailProps & RouteComponentProps> {
    static displayName = "Detail";

    render(): JSX.Element {
        const { models, className } = this.props;
        const classNames = ["detail", className].join(" ");
        return (
            <div className={classNames}>
                {models.map((model, index) => (
                    <UI.DetailListModel model={model} {...this.props} key={index} />
                ))}
            </div>
        );
    }
}
