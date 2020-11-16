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
import { RouteComponentProps } from "react-router";
import { UI } from "../../../../components";

export default class AppDetail extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        const parts = [
            {
                label: "App-Name",
                value: "MIO Viewer"
            },
            {
                label: "Version",
                value: process.env.REACT_APP_VERSION
            },
            {
                label: "Lizenz",
                value: "LGPL v3"
            },
            {
                label: "Copyright",
                value: "© 2020 KASSENÄRZTLICHE BUNDESVEREINIGUNG (KBV)"
            },
            {
                label: "E-Mail",
                value:
                    "<a href='mailto:support.mio@kbv.de' target='_blank' rel='noopener noreferrer'>support.mio@kbv.de</a>"
            }
        ];

        return (
            <UI.BasicView
                headline={"Details zur App"}
                padding={false}
                back={() => history.goBack()}
                id={"app-detail"}
            >
                <UI.DetailListStickyHeader className={"detail-list"}>
                    <div className={"ion-padding-bottom"}>
                        {parts.map((part, index) => (
                            <UI.ListItem
                                label={part.label}
                                value={part.value}
                                key={"item_" + index}
                                innerHTML={true}
                            />
                        ))}
                    </div>
                </UI.DetailListStickyHeader>
            </UI.BasicView>
        );
    }
}
