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
import lottie from "lottie-web";
import { withIonLifeCycle } from "@ionic/react";
import { RouteComponentProps } from "react-router";

import { UI } from "../../../../components";
import Einfuehrung from "../../../../assets/lottie/lottie_mio_einfuehrung.json";

import "../Info.scss";

class Info extends React.Component<RouteComponentProps> {
    protected content: {
        headline: string;
        items: UI.ListItemProps[];
    }[];

    constructor(props: RouteComponentProps) {
        super(props);

        const { history, match } = this.props;

        this.content = [
            {
                headline: "Hilfethemen",
                items: [
                    {
                        label: "Was sind MIOs?",
                        onClick: () => history.push(match.url + "/intro")
                    },
                    {
                        label: "Technische Fragen",
                        onClick: () => history.push(match.url + "/technical")
                    },
                    {
                        label: "MIO Kommentierung",
                        onClick: () => history.push(match.url + "/commenting")
                    }
                ]
            },
            {
                headline: "App Informationen",
                items: [
                    {
                        label: "Details zur App",
                        onClick: () => history.push(match.url + "/version")
                    },
                    {
                        label: "Impressum",
                        onClick: () => history.push(match.url + "/impressum")
                    }
                ]
            }
        ];
    }

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
        const { history } = this.props;

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

                {this.content.map((content) => {
                    return (
                        <UI.DetailList.StickyHeader
                            className={"detail-list"}
                            key={content.headline}
                        >
                            <h5 className={"ion-padding ion-no-margin green sticky"}>
                                {content.headline}
                            </h5>
                            <div className={"ion-padding-bottom"}>
                                {content.items.length ? (
                                    content.items.map((part, index) => (
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
                                        value={`Unter „${content.headline}“ sind derzeit keine Inhalte vorhanden.`}
                                    />
                                )}
                            </div>
                        </UI.DetailList.StickyHeader>
                    );
                })}
            </UI.BasicView>
        );
    }
}

export default withIonLifeCycle(Info);
