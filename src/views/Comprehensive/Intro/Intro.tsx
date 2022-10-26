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
import * as Icons from "react-feather";

import { RouteComponentProps } from "react-router";
import {
    MIOConnector,
    MIOConnectorType,
    SettingsConnector,
    SettingsConnectorType
} from "../../../store";

import { IonPage, IonContent, withIonLifeCycle } from "@ionic/react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";

import { UI } from "components";

import LottieSlide1 from "../../../assets/lottie/lottie_slide1.json";
import LottieSlide2 from "../../../assets/lottie/lottie_slide2.json";
import LottieSlide3 from "../../../assets/lottie/lottie_slide3.json";
import LottieSlide4 from "../../../assets/lottie/lottie_slide4.json";

import Illustration from "../../../assets/img/illustration.svg";

import lottie, { AnimationItem } from "lottie-web";

import "./Intro.scss";

type IntroState = {
    currentIndex: number;
    slides: JSX.Element[];
    visible: boolean;
};

class Intro extends React.Component<
    SettingsConnectorType & MIOConnectorType & RouteComponentProps,
    IntroState
> {
    protected headline = "";
    protected animations: AnimationItem[] = [];
    protected content = [
        {
            headline: "Der MIO Viewer",
            lottie: LottieSlide1,
            text: "Lassen Sie sich Ihre MIOs aus der ePA im MIO Viewer anzeigen. Browsen Sie durch Impfeinträge, lassen Sie sich Ihre letzte zahnärztliche Behandlung anzeigen und vieles mehr!"
        },
        {
            headline: "Öffnen Sie ein MIO",
            lottie: LottieSlide2,
            text: "Klicken Sie auf „MIO öffnen“, wählen Sie Ihre unverschlüsselte MIO-Datei von ihrem Gerät und schon können Sie die Informationen ansehen!"
        },
        {
            headline: "Export als PDF",
            lottie: LottieSlide3,
            text: "Exportieren Sie Ihre MIOs als PDF und behalten Sie so alle Daten im Überblick. Speichern Sie es ab oder drucken es aus."
        },
        {
            headline: "Bereit?",
            lottie: LottieSlide4,
            text: "Laden Sie jetzt Ihr erstes MIO in die Anwendung!"
        }
    ];

    protected swiper?: SwiperClass;

    constructor(props: SettingsConnectorType & MIOConnectorType & RouteComponentProps) {
        super(props);

        this.state = {
            currentIndex: 0,
            slides: [],
            visible: false
        };
    }

    ionViewWillEnter() {
        this.setState(
            {
                currentIndex: 0,
                slides: this.createSlides()
            },
            () => {
                this.content.forEach((content, index) => {
                    const container = document.getElementById(
                        `lottie-container-slide-${index}`
                    );
                    if (container) {
                        const animation = lottie.loadAnimation({
                            container: container,
                            renderer: "svg",
                            loop: true,
                            autoplay: false,
                            animationData: content.lottie
                        });

                        this.animations.push(animation);
                        if (index === 0) {
                            animation.play();
                        }
                    }
                });
            }
        );
    }

    ionViewDidEnter(): void {
        this.setState({ visible: true });
    }

    ionViewDidLeave() {
        this.animations = [];
        this.setState({
            slides: [],
            visible: false
        });
    }

    ionViewWillLeave(): void {
        this.setState({ visible: false });
    }

    protected createSlides = (): JSX.Element[] => {
        return this.content.map((value, index) => {
            return (
                <div className={"slide-inner"} key={`slide_${index}`}>
                    <h2 className={"green"}>
                        <span>{value.headline}</span>
                    </h2>
                    {value.lottie ? (
                        <div
                            className={"lottie-container"}
                            id={`lottie-container-slide-${index}`}
                        />
                    ) : (
                        <div className={"illustration"}>
                            <img src={Illustration} alt={"Illustration"} />
                        </div>
                    )}
                    <p>{value.text}</p>
                    {index === this.content.length - 1 && (
                        <div className={"buttons"}>
                            <button onClick={this.exit}>{"Los geht's!"}</button>
                        </div>
                    )}
                </div>
            );
        });
    };

    protected setSwiper = (swiper: SwiperClass): void => {
        if (this.swiper !== swiper) {
            this.swiper = swiper;
        }
    };

    protected changed = (swiper: SwiperClass): void => {
        this.setSwiper(swiper);

        const index = swiper.activeIndex;

        if (this.animations[this.state.currentIndex]) {
            this.animations[this.state.currentIndex].goToAndStop(0);
        }
        this.setState({ currentIndex: index }, () => {
            if (this.animations[index]) {
                this.animations[index].play();
            }
        });
    };

    protected exit = (): void => {
        const { mios, location } = this.props;
        const toInfo =
            location.state && (location.state as { fromIntro: boolean }).fromIntro;

        this.props.setShowIntro(false).then(() => {
            this.props.history.push(toInfo ? "/info" : mios.length ? "/main" : "/home");
        });
    };

    render(): JSX.Element {
        const { slides, currentIndex, visible } = this.state;
        // const options = { speed: 300 };

        return (
            <IonPage className={visible ? " current-active-page" : ""}>
                <IonContent id={"page-content"}>
                    <div className={"intro-view"}>
                        <UI.ButtonIcon
                            icon={Icons.XCircle}
                            onClick={this.exit}
                            className={"exit-button"}
                            text={"Abbrechen"}
                            rightToLeft={true}
                        />

                        <Swiper
                            onSwiper={this.setSwiper}
                            onSlideChange={this.changed}
                            key={slides.length}
                        >
                            {slides.map((components, index) => (
                                <SwiperSlide key={`slide-${index}`}>
                                    <div data-testid={`slide-${index}`}>{components}</div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <UI.Pagination
                            first={(i) => this.swiper?.slideTo(i)}
                            last={(i) => this.swiper?.slideTo(i)}
                            prev={() => this.swiper?.slidePrev()}
                            next={() => this.swiper?.slideNext()}
                            currentIndex={currentIndex}
                            numSlides={slides.length}
                        />
                        <p className={"small"}>
                            Einführung kann über die Hilfe wieder angeschaltet werden.
                        </p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}

export default MIOConnector(SettingsConnector(withIonLifeCycle(Intro)));
