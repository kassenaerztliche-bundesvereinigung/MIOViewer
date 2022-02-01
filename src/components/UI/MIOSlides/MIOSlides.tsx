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

import React, { ReactNode } from "react";

import { RouteComponentProps } from "react-router";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";

import { MIOConnectorType } from "../../../store";

import { UI, Util } from "../../../components";

import {
    KBVBundleResource,
    MR,
    Vaccination,
    ZAEB,
    CMR,
    ParserUtil
} from "@kbv/mioparser";

import "./MIOSlides.scss";
import SwiperClass from "swiper/types/swiper-class";

export type MIOSlidesProps = MIOConnectorType & RouteComponentProps;

export type MIOSlidesState = {
    headline: string;
    id: string;
    testId?: string;
    className?: string;
    headerClass?: string;
    back?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    slides: JSX.Element[][];
    currentIndex: number;
    isExample?: boolean;
};

abstract class MIOSlides<
    P extends MIOSlidesProps,
    S extends MIOSlidesState
> extends React.Component<P, S> {
    protected swiper?: SwiperClass;

    protected constructor(props: P) {
        super(props);
    }

    protected setSwiper = (swiper: SwiperClass): void => {
        if (this.swiper !== swiper) this.swiper = swiper;
    };

    protected changed = (swiper: SwiperClass): void => {
        this.setSwiper(swiper);
        this.setState({ currentIndex: swiper.activeIndex });
    };

    componentDidMount(): void {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
    }

    ionViewWillEnter(): void {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
        const handleResize = this.throttle(() => {
            this.onResize();
        }, 250);
        window.addEventListener("resize", handleResize);
    }

    ionViewDidLeave(): void {
        this.setState({
            slides: []
        });

        window.removeEventListener("resize", this.onResize);
    }

    onResize = (): void => {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
    };

    throttle = (func: () => void, delay: number): (() => void) => {
        let inProgress = false;
        return () => {
            if (inProgress) return;

            inProgress = true;
            setTimeout(() => {
                func();
                inProgress = false;
            }, delay);
        };
    };

    miosPerPage = (): number => {
        const w = window.innerWidth;
        let miosPerPage = 4;
        if (w > 767) miosPerPage = 9;
        return miosPerPage;
    };

    protected abstract createSlides(): JSX.Element[][];

    protected mapMioFolders = (
        mios: KBVBundleResource[],
        ungroup?: boolean
    ): JSX.Element[] => {
        const { history, location } = this.props;
        const isExample = Util.Misc.isExamplePath(location.pathname);
        const mioFolders = [];

        mios.forEach((mio, index) => {
            const mioId = ParserUtil.getUuidFromBundle(mio);
            const path = (isExample ? "/example/" : "/mio/") + mioId;

            if (Vaccination.V1_1_0.Profile.BundleEntry.is(mio)) {
                const patient = Util.IM.getPatient(mio);
                mioFolders.push(
                    <UI.MIOFolder
                        key={mioId + index.toString()}
                        onClick={() => history.push(path)}
                        className={"impfpass"}
                        label={"Impfpass"}
                        subline={patient ? Util.IM.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else if (ZAEB.V1_1_0.Profile.Bundle.is(mio)) {
                const patient = Util.ZB.getPatient(mio);
                mioFolders.push(
                    <UI.MIOFolder
                        key={mioId + index.toString()}
                        onClick={() => history.push(path)}
                        className={"zaeb"}
                        label={"Zahnärztliches Bonusheft"}
                        labelBG={true}
                        subline={patient ? Util.ZB.getPatientName(patient.resource) : ""}
                    />
                );
            } else if (MR.V1_1_0.Profile.Bundle.is(mio)) {
                const patient = Util.MP.getPatientMother(mio);

                mioFolders.push(
                    <UI.MIOFolder
                        key={mioId + index.toString()}
                        onClick={() => history.push(path)}
                        className={"mutterpass"}
                        label={"Mutterpass"}
                        labelBG={true}
                        subline={
                            patient ? Util.MP.getPatientMotherName(patient.resource) : ""
                        }
                    />
                );
            } else if (CMR.V1_0_1.Profile.CMRBundle.is(mio) && ungroup) {
                const type = Util.UH.getTypeFromBundle(mio);
                const patient = Util.UH.getPatient(mio);

                mioFolders.push(
                    <UI.MIOFolder
                        key={"uheft-" + index}
                        onClick={() => history.push(path)}
                        className={"uheft"}
                        label={type ? type : "Undefined"}
                        subline={patient ? Util.UH.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else if (CMR.V1_0_1.Profile.PCBundle.is(mio) && ungroup) {
                const type = Util.UH.getEncounterTypeFromBundle(mio);
                const patient = Util.UH.getPatient(mio);

                mioFolders.push(
                    <UI.MIOFolder
                        key={"uheft-" + index}
                        onClick={() => history.push(path)}
                        className={"uheft"}
                        label={"Teilnahmekarte " + type}
                        subline={patient ? Util.UH.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else if (CMR.V1_0_1.Profile.PNBundle.is(mio) && ungroup) {
                const type = Util.UH.getEncounterTypeFromBundle(mio);
                const patient = Util.UH.getPatient(mio);

                mioFolders.push(
                    <UI.MIOFolder
                        key={"uheft-" + index}
                        onClick={() => history.push(path)}
                        className={"uheft"}
                        label={"Elternnotiz " + type}
                        subline={patient ? Util.UH.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else {
                if (!Util.UH.isBundle(mio)) {
                    mioFolders.push(
                        <UI.MIOFolder
                            key={"undefined-" + index}
                            onClick={() => console.log(mio)}
                            className={"undefined"}
                            label={"Undefined"}
                            labelBG={true}
                        />
                    );
                } else if (ungroup) {
                    mioFolders.push(
                        <UI.MIOFolder
                            key={"uheft-" + index}
                            onClick={() => console.log(mio)}
                            className={"uheft"}
                            label={"U-Heft"}
                            labelBG={true}
                        />
                    );
                }
            }
        });

        const countUH = Util.UH.countBundles(mios);

        if (countUH && !ungroup) {
            const path = isExample ? "/examples/" : "/mios/";

            mioFolders.push(
                <UI.MIOFolder
                    key={"uheft"}
                    onClick={() => history.push(path + "uheft")}
                    className={"uheft"}
                    label={"Kinderuntersuchungsheft"}
                    labelBG={true}
                    badge={countUH.toString()}
                />
            );
        }

        return mioFolders;
    };

    chunk = (array: JSX.Element[], size: number): JSX.Element[][] => {
        const chunked = [];
        let index = 0;
        while (index < array.length) {
            chunked.push(array.slice(index, size + index));
            index += size;
        }
        return chunked;
    };

    protected renderSlides = (children?: ReactNode): JSX.Element => {
        const { testId, className, slides, currentIndex } = this.state;

        const classes = [className, "mio-slides"].join(" ");

        return (
            <div className={classes} data-testid={testId}>
                {slides && (
                    <Swiper
                        onSwiper={this.setSwiper}
                        onSlideChange={this.changed}
                        key={slides.length}
                    >
                        {slides.map((components, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className={"mio-container"}
                                    data-testid={`slide-${index}`}
                                >
                                    {components}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                <UI.Pagination
                    currentIndex={currentIndex}
                    swiper={this.swiper}
                    numSlides={slides.length}
                    showFirstAndLastButton={true}
                />
                {children}
            </div>
        );
    };

    render(): JSX.Element {
        const { headline, id, headerClass, back, isExample } = this.state;

        return (
            <UI.BasicView
                headline={headline}
                padding={false}
                id={id}
                headerClass={headerClass}
                back={back}
                isExample={isExample}
            >
                {this.renderSlides(this.props.children)}
            </UI.BasicView>
        );
    }
}

export default MIOSlides;
