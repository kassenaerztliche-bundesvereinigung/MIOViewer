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
import * as Icons from "react-feather";

import { RouteComponentProps } from "react-router";
import { IonSlide, IonSlides, withIonLifeCycle } from "@ionic/react";

import { Vaccination, ZAEB } from "@kbv/mioparser";
import { MIOConnector, MIOConnectorType } from "../../../store";

import { UI, IM, ZB } from "../../../components";

import "./Main.scss";

export type MainViewState = {
    slides: JSX.Element[][];
    currentIndex: number;
} & UI.AddMIOState;

class MainView extends UI.AddMIO<RouteComponentProps, MainViewState> {
    protected slidesRef: React.RefObject<HTMLIonSlidesElement>;

    constructor(props: MIOConnectorType & RouteComponentProps) {
        super(props);

        this.slidesRef = React.createRef();

        this.state = {
            files: [],
            hasError: false,
            errorMessage: "",
            errorDetailMessage: "",
            errorDetailMessageToCopy: "",
            numErrors: 0,
            bigFile: false,
            slides: [],
            currentIndex: 0
        };
    }

    protected changed = (): void => {
        this.slidesRef.current?.getActiveIndex().then((index: number) => {
            this.setState({ currentIndex: index });
        });
    };

    componentDidMount() {
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

    ionViewDidLeave() {
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

    throttle = (func: () => void, delay: number) => {
        // TODO: should rather check exceed window size breakpoints
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

    createSlides = (): JSX.Element[][] => {
        const { mios, history } = this.props;

        const w = window.innerWidth;
        let miosPerPage = 4;
        if (w > 767) miosPerPage = 9;

        const components: JSX.Element[] = [];

        components.push(
            <UI.InputFile
                label={""}
                onSelect={this.onSelect}
                accept={"application/JSON, text/xml"}
                green={true}
                multiple={true}
                key={"add"}
                className={"add-mio-main"}
            >
                <UI.MIOFolder outlined={true}>
                    <Icons.PlusCircle />
                </UI.MIOFolder>
            </UI.InputFile>
        );

        const mioComponents = mios.map((mio, index) => {
            if (Vaccination.V1_00_000.Profile.BundleEntry.is(mio)) {
                const patient = IM.Util.getPatient(mio);
                return (
                    <UI.MIOFolder
                        key={mio.identifier.value + index.toString()}
                        onClick={() => history.push("/mio/" + mio.identifier.value)}
                        className={"impfpass"}
                        label={"Impfpass"}
                        subline={patient ? IM.Util.getPatientName(patient.resource) : ""}
                        labelBG={true}
                    />
                );
            } else if (ZAEB.V1_00_000.Profile.Bundle.is(mio)) {
                const patient = ZB.Util.getPatient(mio);
                return (
                    <UI.MIOFolder
                        key={mio.identifier.value + index.toString()}
                        onClick={() => history.push("/mio/" + mio.identifier.value)}
                        className={"zaeb"}
                        label={"Zahnärztliches Bonusheft"}
                        labelBG={true}
                        subline={patient ? ZB.Util.getPatientName(patient.resource) : ""}
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

        components.push(...mioComponents);
        return this.chunk(components, miosPerPage);
    };

    chunk = (array: JSX.Element[], size: number) => {
        const chunked = [];
        let index = 0;
        while (index < array.length) {
            chunked.push(array.slice(index, size + index));
            index += size;
        }
        return chunked;
    };

    parseFiles = (): void => {
        const callback = () =>
            this.setState({
                slides: this.createSlides(),
                currentIndex: 0
            });
        this.handleFiles(this.state.files, callback);
    };

    render(): JSX.Element {
        const { hasError, slides, bigFile, currentIndex, files } = this.state;
        const { loading } = this.props;
        const shouldLoad = loading && bigFile;
        return (
            <UI.BasicView headline={"Meine MIOs"} padding={false} id={"main"}>
                {shouldLoad && (
                    <UI.LoadingAnimation
                        lottieContainerId={"lottie-loading-main"}
                        loadingText={
                            files.length > 1 ? "MIOs werden geladen" : "MIO wird geladen"
                        }
                    />
                )}
                <div className={"main-view"} data-testid={"main-view"}>
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

                    <UI.Modal
                        headline={"Fehler"}
                        content={this.renderErrorBox()}
                        show={hasError}
                        onClose={() => this.setState({ hasError: false })}
                    />
                </div>
            </UI.BasicView>
        );
    }
}

export default MIOConnector(withIonLifeCycle(MainView));
