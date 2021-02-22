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

import { RouteComponentProps } from "react-router";
import { IonFooter, IonRouterLink } from "@ionic/react";
import { ButtonIcon } from "../";

import MIOViewerLogo from "../../../assets/img/mio_viewer_logo.svg";

import "./TabBar.scss";
import { MIOConnector, MIOConnectorType } from "../../../store";

type TabBarState = {
    visible: boolean;
};

type TabBarProps = RouteComponentProps & MIOConnectorType;

class TabBar extends React.Component<TabBarProps, TabBarState> {
    constructor(props: TabBarProps) {
        super(props);
        this.state = {
            visible:
                props.location.pathname !== "/" && props.location.pathname !== "/intro"
        };
    }

    componentDidMount(): void {
        this.props.history.listen((location) => {
            this.setState({
                visible: location.pathname !== "/" && location.pathname !== "/intro"
            });
        });
    }

    render(): JSX.Element {
        const { location, mios } = this.props;
        const { visible } = this.state;

        return (
            <IonFooter
                slot="bottom"
                className={visible ? "visible" : ""}
                data-testid={"footer"}
            >
                <div className={"mio-viewer-logo"}>
                    <img src={MIOViewerLogo} alt={"MIO Viwer Logo"} />
                </div>
                <IonRouterLink
                    routerLink={mios.length ? "/main" : "/home"}
                    routerDirection={"back"}
                >
                    <ButtonIcon
                        icon={Icons.Home}
                        className={
                            location.pathname === "/home" ||
                            location.pathname === "/main" ||
                            location.pathname.startsWith("/mio") ||
                            location.pathname.startsWith("/entry") ||
                            location.pathname.startsWith("/subEntry") ||
                            location.pathname.startsWith("/section")
                                ? "black"
                                : ""
                        }
                        text={"Home"}
                    />
                </IonRouterLink>
                <IonRouterLink routerLink={"/info"} routerDirection={"forward"}>
                    <ButtonIcon
                        icon={Icons.BookOpen}
                        className={location.pathname.startsWith("/info") ? "black" : ""}
                        text={"Info"}
                    />
                </IonRouterLink>
                <IonRouterLink routerLink={"/profil"} routerDirection={"forward"}>
                    <ButtonIcon
                        icon={Icons.User}
                        className={location.pathname.startsWith("/profil") ? "black" : ""}
                        text={"Profil"}
                    />
                </IonRouterLink>
            </IonFooter>
        );
    }
}

export default MIOConnector(TabBar);
