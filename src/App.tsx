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

import React, { RefObject } from "react";

import { IonApp, IonContent, IonPage, IonRouterOutlet } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "theme/default.scss";

import { IonReactHashRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { hot, setConfig } from "react-hot-loader";

import MIOParser from "@kbv/mioparser";

import Intro from "./views/Comprehensive/Intro";
import Home from "./views/Comprehensive/Home";
import Main from "./views/Comprehensive/Main";
import Info from "./views/Comprehensive/Info";
import Profil from "./views/Comprehensive/Profil";
import Overview from "./views/Comprehensive/Overview";

import Detail from "./views/Comprehensive/Detail";
import StartScreen from "./views/Comprehensive/StartScreen";

import { TabBar } from "./components/UI/";

import CookiesModal from "./CookiesModal";

import "./App.scss";

type AppState = {
    hasTabBar: boolean;
};

class App extends React.Component<Record<string, unknown>, AppState> {
    protected router: React.RefObject<IonReactHashRouter>;

    constructor(props: Record<string, unknown>) {
        super(props);
        MIOParser.setLang("de");
        this.router = React.createRef();
        this.state = {
            hasTabBar: false
        };
    }

    componentDidMount(): void {
        if (this.router) {
            const current = this.router.current;

            this.setState({
                hasTabBar:
                    current?.history.location.pathname !== "/" &&
                    current?.history.location.pathname !== "/intro"
            });

            current?.history.listen((location) => {
                this.setState({
                    hasTabBar: location.pathname !== "/" && location.pathname !== "/intro"
                });
            });
        }
    }

    pushOnHistory(direction: string) {
        if (this.router.current) {
            this.router.current.history.push(direction);
        }
    }

    render(): JSX.Element {
        return (
            <>
                <IonApp id="app">
                    <IonReactHashRouter ref={this.router}>
                        <IonPage>
                            <IonContent
                                id={"main-content"}
                                className={this.state.hasTabBar ? "has-tab-bar" : ""}
                            >
                                <IonRouterOutlet>
                                    <Route exact path={"/intro"} component={Intro} />
                                    <Route exact path={"/home"} component={Home} />
                                    <Route exact path={"/main"} component={Main} />
                                    <Route exact path={"/profil"} component={Profil} />

                                    <Route
                                        path={"/entry/:id/:entry"}
                                        component={Detail}
                                    />

                                    <Route
                                        path={"/subEntry/:id/:entry"}
                                        component={Detail}
                                    />

                                    <Route path={"/mio/:id"} component={Overview} />
                                    <Redirect exact from="/mio" to="/main" />

                                    <Route exact path={"/info"} component={Info} />
                                    <Route path={"/info/:id"} component={Info} />

                                    <Route exact path={"/"} component={StartScreen} />
                                </IonRouterOutlet>
                            </IonContent>
                            <Route component={TabBar} />
                        </IonPage>
                    </IonReactHashRouter>
                </IonApp>
                <div id={"desktop-footer"}>
                    Ein Service der Kassenärztlichen Bundesvereinigung (KBV), Dezernat
                    Digitalisierung und IT
                    <nav>
                        <div onClick={() => this.pushOnHistory("/info/impressum")}>
                            Impressum
                        </div>
                        |
                        <a
                            href={"https://www.kbv.de/html/datenschutz.php"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Datenschutz
                        </a>
                        |
                        <a href={"mailto:support.mio@kbv.de"}>
                            E-Mail: support.mio@kbv.de
                        </a>
                    </nav>
                </div>
                <CookiesModal />
            </>
        );
    }
}

// https://stackoverflow.com/questions/54770535/react-hot-loader-react-dom-patch-is-not-detected
setConfig({
    showReactDomPatchNotification: false
});

export default hot(module)(App);
