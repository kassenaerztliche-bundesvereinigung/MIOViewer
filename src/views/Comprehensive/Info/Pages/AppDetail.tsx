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
import { RouteComponentProps } from "react-router";
import { withIonLifeCycle } from "@ionic/react";
import { UI } from "../../../../components";

class AppDetail extends React.Component<RouteComponentProps> {
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
                value: "© 2020 - 2021 KASSENÄRZTLICHE BUNDESVEREINIGUNG (KBV)"
            },
            {
                label: "MIO-Support",
                value: "<a href='https://mio.kbv.de/support' target='_blank' rel='noopener noreferrer'>https://mio.kbv.de/support</a>"
            }
        ];

        return (
            <UI.BasicView
                headline={"Details zur App"}
                padding={false}
                back={() => history.goBack()}
                id={"app-detail"}
            >
                <UI.DetailList.StickyHeader className={"detail-list"}>
                    <div className={"ion-padding-bottom"}>
                        {parts.map((part, index) => (
                            <UI.ListItem.Basic
                                label={part.label}
                                value={part.value}
                                key={"item_" + index}
                                innerHTML={true}
                            />
                        ))}
                    </div>
                </UI.DetailList.StickyHeader>
            </UI.BasicView>
        );
    }
}

export default withIonLifeCycle(AppDetail);
