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

import { IonApp, IonContent, IonPage } from "@ionic/react";

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
import { Route } from "react-router";
import { hot, setConfig } from "react-hot-loader";

import MIOParser from "@kbv/mioparser";

import * as UI from "./components/UI";
import Routing from "./Routing";
import CookiesModal from "./CookiesModal";

import "./App.scss";

type AppState = {
    hasTabBar: boolean;
};

class App extends React.Component<Record<string, unknown>, AppState> {
    protected router: React.RefObject<IonReactHashRouter>;
    protected routing: Routing;

    constructor(props: Record<string, unknown>) {
        super(props);
        MIOParser.setLang("de");
        this.router = React.createRef();
        this.routing = new Routing(this.props);
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
                                {this.routing.render()}
                            </IonContent>
                            <Route
                                render={(props) => (
                                    <UI.TabBar {...props} routing={this.routing} />
                                )}
                            />
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
                        <a
                            href={"https://mio.kbv.de/support"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            MIO-Support
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
