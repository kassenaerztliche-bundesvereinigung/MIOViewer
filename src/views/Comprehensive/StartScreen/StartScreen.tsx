/*
 * Copyright (c) 2020 - 2022. Kassenärztliche Bundesvereinigung, KBV
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
import lottie, { AnimationItem, AnimationSegment } from "lottie-web";
import { IonPage, withIonLifeCycle } from "@ionic/react";
import { RouteComponentProps } from "react-router";

import { SettingsConnector, SettingsConnectorType } from "../../../store";

import SplashLogos from "../../../assets/img/splash-logos.svg";
import LottieSplash from "../../../assets/lottie/lottie_mio_splash_animation.json";

import "./StartScreen.scss";

class StartScreen extends React.Component<
    RouteComponentProps & SettingsConnectorType,
    Record<string, unknown>
> {
    animation: AnimationItem | undefined = undefined;
    segments: AnimationSegment[] = [
        [0, 430],
        [90, 430]
    ];

    componentDidMount(): void {
        const container = document.getElementById("lottie-splash");

        if (container) {
            this.animation = lottie.loadAnimation({
                container: container,
                renderer: "svg",
                autoplay: false,
                animationData: LottieSplash
            });

            // https://github.com/airbnb/lottie-web/issues/579
        }
    }

    componentDidUpdate(): void {
        if (this.props.cookiesAccepted) {
            this.animation?.playSegments(this.segments, true);
        }
    }

    forward = (): void => {
        const { history, showIntro } = this.props;
        if (this.animation) this.animation.removeEventListener("segmentStart");
        history.push(showIntro ? "/intro" : "/home");
    };

    ionViewDidLeave() {
        if (this.animation) {
            this.animation.removeEventListener("segmentStart");
            this.animation.goToAndStop(0);
        }
    }

    ionViewWillEnter() {
        if (this.animation) {
            let segmentCount = 0;

            this.animation.addEventListener("segmentStart", () => {
                segmentCount++;
                if (segmentCount === this.segments.length) {
                    this.props.history.push(this.props.showIntro ? "/intro" : "/home");
                }
            });

            if (this.props.cookiesAccepted) {
                this.animation.playSegments(this.segments, true);
            }
        }
    }

    render(): JSX.Element {
        return (
            <IonPage key={"start-screen"}>
                <div
                    id={"start-screen"}
                    data-testid={"start-screen"}
                    onClick={this.forward}
                >
                    <div id={"lottie-splash"} data-testid={"lottie-splash"} />
                    <img
                        src={SplashLogos}
                        className={"logos"}
                        alt={"KBV Logo und MIO 42 GmbH Logo"}
                    />
                </div>
            </IonPage>
        );
    }
}

export default SettingsConnector(withIonLifeCycle(StartScreen));
