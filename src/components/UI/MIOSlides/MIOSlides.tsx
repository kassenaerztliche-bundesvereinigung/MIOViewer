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

import React, { ReactNode } from "react";

import { RouteComponentProps } from "react-router";
import { IonSlide, IonSlides } from "@ionic/react";

import { MIOConnectorType } from "../../../store";

import { UI, Util } from "../../../components";

import { KBVBundleResource, MR, Vaccination, ZAEB, ParserUtil } from "@kbv/mioparser";

import "./MIOSlides.scss";

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
};

abstract class MIOSlides<
    P extends MIOSlidesProps,
    S extends MIOSlidesState
> extends React.Component<P, S> {
    protected slidesRef: React.RefObject<HTMLIonSlidesElement>;

    protected constructor(props: P) {
        super(props);
        this.slidesRef = React.createRef();
    }

    protected changed = (): void => {
        this.slidesRef.current?.getActiveIndex().then((index: number) => {
            this.setState({ currentIndex: index });
        });
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

    protected mapMioFolders = (mios: KBVBundleResource[]): JSX.Element[] => {
        const { history } = this.props;

        return mios.map((mio, index) => {
            const mioId = ParserUtil.getUuid(mio.identifier.value);

            if (Vaccination.V1_00_000.Profile.BundleEntry.is(mio)) {
                const patient = Util.IM.getPatient(mio);
                return (
                    <UI.MIOFolder
                        key={mio.identifier.value + index.toString()}
                        onClick={() => history.push("/mio/" + mioId)}
                        className={"impfpass"}
                        label={"Impfpass"}
                        subline={patient ? Util.IM.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else if (ZAEB.V1_00_000.Profile.Bundle.is(mio)) {
                const patient = Util.ZB.getPatient(mio);
                return (
                    <UI.MIOFolder
                        key={mio.identifier.value + index.toString()}
                        onClick={() => history.push("/mio/" + mioId)}
                        className={"zaeb"}
                        label={"Zahnärztliches Bonusheft"}
                        labelBG={true}
                        subline={patient ? Util.ZB.getPatientName(patient.resource) : ""}
                    />
                );
            } else if (MR.V1_00_000.Profile.Bundle.is(mio)) {
                const patient = Util.MP.getPatientMother(mio);
                return (
                    <UI.MIOFolder
                        key={mio.identifier.value + index.toString()}
                        onClick={() => history.push("/mio/" + mioId)}
                        className={"mutterpass"}
                        label={"Mutterpass"}
                        labelBG={true}
                        subline={
                            patient ? Util.MP.getPatientMotherName(patient.resource) : ""
                        }
                    />
                );
            } else {
                return (
                    <UI.MIOFolder
                        key={"undefined-" + index}
                        onClick={() => console.log(mio)}
                        className={"undefined"}
                        label={"Undefined"}
                        labelBG={true}
                    />
                );
            }
        });
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
                {slides && slides.length && (
                    <IonSlides
                        pager={true}
                        key={slides.length}
                        onIonSlideDidChange={this.changed}
                        ref={this.slidesRef}
                    >
                        {slides.map((components, index) => (
                            <IonSlide key={index}>
                                <div
                                    className={"mio-container"}
                                    data-testid={`slide-${index}`}
                                >
                                    {components}
                                </div>
                            </IonSlide>
                        ))}
                    </IonSlides>
                )}
                <UI.Pagination
                    currentIndex={currentIndex}
                    ionSlides={this.slidesRef}
                    numSlides={slides.length}
                    showFirstAndLastButton={true}
                />
                {children}
            </div>
        );
    };

    render(): JSX.Element {
        const { headline, id, headerClass, back } = this.state;

        return (
            <UI.BasicView
                headline={headline}
                padding={false}
                id={id}
                headerClass={headerClass}
                back={back}
            >
                {this.renderSlides(this.props.children)}
            </UI.BasicView>
        );
    }
}

export default MIOSlides;
