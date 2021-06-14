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

import { IonRouterOutlet } from "@ionic/react";

import { Route, RouteProps, Redirect, matchPath } from "react-router";

import Intro from "./views/Comprehensive/Intro";
import Home from "./views/Comprehensive/Home";
import Main from "./views/Comprehensive/Main";
import Profil from "./views/Comprehensive/Profil";
import Examples from "./views/Comprehensive/Examples";
import Overview from "./views/Comprehensive/Overview";
import OverviewSection from "./views/Comprehensive/OverviewSection";
import * as Info from "./views/Comprehensive/Info";

import Detail from "./views/Comprehensive/Detail";
import StartScreen from "./views/Comprehensive/StartScreen";

export type TabType = "none" | "home" | "info" | "profil";

export default class Routing extends React.Component {
    protected tabs: { tab: TabType; routes: RouteProps[] }[] = [
        {
            tab: "none",
            routes: [
                { path: "/", component: StartScreen, exact: true },
                { path: "/intro", component: Intro, exact: true }
            ]
        },
        {
            tab: "home",
            routes: [
                // BASIC
                { path: "/home", component: Home, exact: true },
                { path: "/main", component: Main, exact: true },
                // MIOs
                { path: "/mio/:id", component: Overview },
                { path: "/mios/:id", component: Overview },
                { path: "/entry/:id/:entry/:filter?/:filterValue?", component: Detail },
                {
                    path: "/subEntry/:id/:entry/:filter?/:filterValue?",
                    component: Detail
                },
                { path: "/section/:id/:section/:patient?", component: OverviewSection },
                // EXAMPLES
                { path: "/examples", component: Examples, exact: true },
                { path: "/example/:id", component: Overview },
                { path: "/examples/:id", component: Overview }
                // TODO: solve example stuff via routing??? (not via EXAMPLE_PREFIX)
            ]
        },
        {
            tab: "info",
            routes: [
                { path: "/info", component: Info.Info, exact: true },
                { path: "/info/intro", component: Info.Intro, exact: true },
                { path: "/info/technical", component: Info.Technical, exact: true },
                { path: "/info/commenting", component: Info.Commenting, exact: true },
                { path: "/info/version", component: Info.AppDetail, exact: true },
                { path: "/info/impressum", component: Info.Imprint, exact: true }
            ]
        },
        {
            tab: "profil",
            routes: [{ path: "/profil", component: Profil, exact: true }]
        }
    ];

    public isTab(tabType: TabType, path: string): boolean {
        const result = this.tabs.filter((tab) => {
            return (
                tab.tab === tabType &&
                tab.routes.filter((route) => matchPath(path, route)).length > 0
            );
        });
        return result.length > 0;
    }

    render(): JSX.Element {
        return (
            <IonRouterOutlet>
                {this.tabs.map((tab) =>
                    tab.routes.map((route, index) => (
                        <Route
                            exact={route.exact}
                            path={route.path}
                            component={route.component}
                            key={`route_${tab.tab}_${index}`}
                        />
                    ))
                )}

                <Redirect exact from="/mio" to="/main" />
                <Redirect exact from="/mios" to="/main" />

                <Redirect exact from="/example" to="/main" />
            </IonRouterOutlet>
        );
    }
}
