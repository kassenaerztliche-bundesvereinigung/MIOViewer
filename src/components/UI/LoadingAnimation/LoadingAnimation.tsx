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
import lottie from "lottie-web";

import LoadingLottie from "../../../assets/lottie/lottie_mio_laden.json";

import "./LoadingAnimation.scss";

export type LoadingAnimationProps = {
    lottieContainerId?: string;
    animationData?: any; // eslint-disable-line
    loadingText?: string;
};

class LoadingAnimation extends React.Component<LoadingAnimationProps> {
    public static defaultProps = {
        lottieContainerId: "lottie-loading",
        animationData: LoadingLottie
    };

    componentDidMount(): void {
        const { lottieContainerId, animationData } = this.props;

        if (lottieContainerId) {
            const container = document.getElementById(lottieContainerId);
            if (container) {
                const animation = lottie.loadAnimation({
                    container: container,
                    renderer: "svg",
                    loop: true,
                    autoplay: false,
                    animationData: animationData
                });

                animation.play();
            }
        }
    }

    render(): JSX.Element {
        const { lottieContainerId, loadingText } = this.props;

        return (
            <div className={"loading-animation"}>
                <div className={"content"}>
                    <div id={lottieContainerId} data-testid={"lottie-loading"} />
                    {loadingText && <p className={"green"}>{loadingText}</p>}
                </div>
            </div>
        );
    }
}

export default LoadingAnimation;
