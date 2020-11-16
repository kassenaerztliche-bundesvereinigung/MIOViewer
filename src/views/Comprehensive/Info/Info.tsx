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

import { Route, RouteComponentProps } from "react-router";

import { IonPage, IonRouterOutlet } from "@ionic/react";

import { UI } from "../../../components";

import * as Pages from "./Pages";

import lottie from "lottie-web";

import Einfuehrung from "../../../assets/lottie/lottie_mio_einfuehrung.json";

import "./Info.scss";

class InfoMenu extends React.Component<RouteComponentProps> {
    componentDidMount(): void {
        const container = document.getElementById("intro-illustration");
        if (container) {
            container.innerHTML = "";
            const animation = lottie.loadAnimation({
                container: container,
                renderer: "svg",
                loop: true,
                autoplay: false,
                animationData: Einfuehrung
            });

            animation.play();
        }
    }

    render() {
        const { history, match } = this.props;

        const faqsHeadline = "Hilfethemen";
        const faqs = [];

        faqs.push({
            label: "Was sind MIO's?",
            onClick: () => history.push(match.url + "/intro")
        });

        faqs.push({
            label: "Technische Fragen",
            onClick: () => history.push(match.url + "/technical")
        });

        faqs.push({
            label: "MIO Kommentierung",
            onClick: () => history.push(match.url + "/commenting")
        });

        const appInfoHeadline = "App Informationen";
        const appInfo = [
            {
                label: "Details zur App",
                onClick: () => history.push(match.url + "/version")
            },
            {
                label: "Impressum",
                onClick: () => history.push(match.url + "/impressum")
            }
        ];

        return (
            <UI.BasicView headline={"Information"} padding={false} id={"info"}>
                <div
                    id={"intro-illustration"}
                    onClick={() =>
                        history.push({
                            pathname: "/intro",
                            state: { fromIntro: true }
                        })
                    }
                />

                <UI.DetailListStickyHeader className={"detail-list"}>
                    <h5 className={"ion-padding ion-no-margin green sticky"}>
                        {faqsHeadline}
                    </h5>
                    <div className={"ion-padding-bottom"}>
                        {faqs.length ? (
                            faqs.map((part, index) => (
                                <UI.ListItem
                                    label={part.label}
                                    onClick={part.onClick}
                                    key={"item_" + index}
                                    noValue={true}
                                />
                            ))
                        ) : (
                            <UI.ListItemHint
                                label={"Hinweis"}
                                value={`Unter „${faqsHeadline}“ sind derzeit keine Inhalte vorhanden.`}
                            />
                        )}
                    </div>
                </UI.DetailListStickyHeader>
                <UI.DetailListStickyHeader className={"detail-list"}>
                    <h5 className={"ion-padding ion-no-margin green sticky"}>
                        {appInfoHeadline}
                    </h5>
                    <div className={"ion-padding-bottom"}>
                        {appInfo.length ? (
                            appInfo.map((part, index) => (
                                <UI.ListItem
                                    label={part.label}
                                    onClick={part.onClick}
                                    key={"item_" + index}
                                    noValue={true}
                                />
                            ))
                        ) : (
                            <UI.ListItemHint
                                label={"Hinweis"}
                                value={`Unter „${appInfoHeadline}“ sind derzeit keine Inhalte vorhanden.`}
                            />
                        )}
                    </div>
                </UI.DetailListStickyHeader>
            </UI.BasicView>
        );
    }
}

export default class Info extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        return (
            <IonPage>
                <IonRouterOutlet>
                    <Route exact path={"/info"} component={InfoMenu} />
                    <Route exact path={"/info/intro"} component={Pages.Intro} />
                    <Route exact path={"/info/technical"} component={Pages.Technical} />
                    <Route exact path={"/info/commenting"} component={Pages.Commenting} />
                    <Route exact path={"/info/version"} component={Pages.AppDetail} />
                    <Route exact path={"/info/impressum"} component={Pages.Imprint} />
                </IonRouterOutlet>
            </IonPage>
        );
    }
}
