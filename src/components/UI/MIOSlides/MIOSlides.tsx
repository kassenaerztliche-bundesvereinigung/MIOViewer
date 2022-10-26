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

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";

import { MIOConnectorType, RouteProps } from "../../../store";

import { UI, Util } from "../../../components";

import {
    KBVBundleResource,
    MR,
    Vaccination,
    ZAEB,
    CMR,
    PKA,
    ParserUtil
} from "@kbv/mioparser";

import "./MIOSlides.scss";

import MIOMap from "./../../../MIOMap";

export type MIOSlidesProps = { children?: React.ReactNode } & MIOConnectorType &
    RouteProps;

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
    swiper?: SwiperClass;
};

abstract class MIOSlides<
    P extends MIOSlidesProps,
    S extends MIOSlidesState
> extends React.Component<P, S> {
    protected listenerAdded = false;

    protected constructor(props: P) {
        super(props);
    }

    protected setSwiper = (): void => {
        const view = document.getElementById(`view-${this.state.id}`);
        const swiperContainer = view?.querySelector(".swiper");
        const swiper = (swiperContainer as unknown as { swiper: SwiperClass }).swiper;

        if (this.state.swiper !== swiper) {
            this.setState({ swiper });
        }
    };

    protected changed = (swiper: SwiperClass): void => {
        this.setSwiper();
        this.setState({ currentIndex: swiper.activeIndex });
    };

    componentDidMount(): void {
        this.clearSlides();
    }

    ionViewWillEnter(): void {
        this.setSlides();

        if (!this.listenerAdded) {
            const handleResize = this.throttle(this.onResize, 250);
            window.addEventListener("resize", handleResize);
            this.listenerAdded = true;
        }

        this.setSwiper();
    }

    ionViewDidLeave(): void {
        this.clearSlides();

        if (this.listenerAdded) {
            window.removeEventListener("resize", this.onResize);
            this.listenerAdded = false;
        }
    }

    setSlides = (): void => {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
    };

    clearSlides = (): void => this.setState({ slides: [] });

    onResize = (): void => {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
    };

    throttle = (func: () => void, delay: number): (() => void) => {
        let inProgress = false;
        return () => {
            if (inProgress) {
                return;
            }

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
        if (w > 767) {
            miosPerPage = 9;
        }
        return miosPerPage;
    };

    protected abstract createSlides(): JSX.Element[][];

    protected mapMioFolders = (
        mios: KBVBundleResource[],
        ungroup?: boolean
    ): JSX.Element[] => {
        const { history, location, match } = this.props;
        const isExample = Util.Misc.isExamplePath(location.pathname);
        const mioFolders: JSX.Element[] = [];

        const id = match.params.id;
        const usedMIOs = MIOMap.filter((v) => (id ? id === v.className : true));

        usedMIOs.forEach((v, i) => {
            const results = mios.filter((m) => v.bundles.some((b) => b.is(m)));
            const mioCount = results.length;

            if (mioCount > 1 && !ungroup) {
                const path = isExample ? "/examples/" : "/mios/";
                mioFolders.push(
                    <UI.MIOFolder
                        key={`${v.className}_${i}`}
                        onClick={() => history.push(path + v.className)}
                        className={v.className}
                        label={v.labelGrouped}
                        labelBG={true}
                        badge={mioCount.toString()}
                    />
                );
            } else if (results.length) {
                results.forEach((mio, index) => {
                    const mioId = ParserUtil.getUuidFromBundle(mio);
                    const path = (isExample ? "/example/" : "/mio/") + mioId;
                    const key = v.className + mioId + index;
                    const onClick = () => history.push(path);

                    if (
                        Vaccination.V1_1_0.Profile.BundleEntry.is(mio) ||
                        ZAEB.V1_1_0.Profile.Bundle.is(mio) ||
                        MR.V1_1_0.Profile.Bundle.is(mio) ||
                        CMR.V1_0_1.Profile.CMRBundle.is(mio) ||
                        CMR.V1_0_1.Profile.PCBundle.is(mio) ||
                        CMR.V1_0_1.Profile.PNBundle.is(mio) ||
                        PKA.V1_0_0.Profile.NFDxDPEBundle.is(mio)
                    ) {
                        mioFolders.push(
                            <UI.MIOFolder
                                key={key}
                                onClick={onClick}
                                className={v.className}
                                label={v.label(mio)}
                                subline={v.subline(mio)}
                                labelBG={true}
                            />
                        );
                    }
                });
            }
        });

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

    protected renderSlides = (): JSX.Element => {
        const { slides } = this.state;

        return (
            <Swiper
                onSwiper={this.setSwiper}
                onSlideChange={this.changed}
                key={slides.length}
            >
                {slides.map((components, index) => (
                    <SwiperSlide key={index}>
                        <div className={"mio-container"} data-testid={`slide-${index}`}>
                            {components}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    render(): JSX.Element {
        const {
            headline,
            id,
            headerClass,
            back,
            isExample,
            testId,
            className,
            slides,
            currentIndex,
            swiper
        } = this.state;

        const classes = [className, "mio-slides"].join(" ");

        return (
            <UI.BasicView
                headline={headline}
                padding={false}
                id={id}
                headerClass={headerClass}
                back={back}
                isExample={isExample}
                testId={testId}
            >
                <div className={classes}>
                    {this.renderSlides()}
                    <UI.Pagination
                        first={(i) => swiper?.slideTo(i)}
                        last={(i) => swiper?.slideTo(i)}
                        prev={() => swiper?.slidePrev()}
                        next={() => swiper?.slideNext()}
                        currentIndex={currentIndex}
                        numSlides={slides.length}
                        showFirstAndLastButton={true}
                    />
                    {this.props.children}
                </div>
            </UI.BasicView>
        );
    }
}

export default MIOSlides;
