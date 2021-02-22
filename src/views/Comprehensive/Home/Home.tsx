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

import { RouteComponentProps } from "react-router";
import { IonRow, withIonLifeCycle } from "@ionic/react";

import { MIOConnector, MIOConnectorType } from "../../../store";

import { UI } from "../../../components";

import LottieMioHinzufuegen from "../../../assets/lottie/lottie_mio_hinzufuegen.json";

import "./Home.scss";

class Home extends UI.AddMIO<RouteComponentProps, UI.AddMIOState> {
    constructor(props: MIOConnectorType & RouteComponentProps) {
        super(props);

        this.state = {
            files: [],
            hasError: false,
            errorMessage: "",
            errorDetailMessage: "",
            errorDetailMessageToCopy: "",
            bigFile: false,
            numErrors: 0
        };
    }

    componentDidMount(): void {
        const container = document.getElementById("lottie-add-mio");
        if (container) {
            lottie.loadAnimation({
                container: container,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: LottieMioHinzufuegen
            });
        }
    }

    parseFiles = (): void => {
        this.handleFiles(this.state.files, () => this.props.history.push("/main"));
    };

    render(): JSX.Element {
        const { hasError, bigFile, files } = this.state;
        const { loading } = this.props;
        const shouldLoad = loading && bigFile;
        return (
            <UI.BasicView headline={"Herzlich Willkommen"} id={"home"}>
                {shouldLoad && (
                    <UI.LoadingAnimation
                        lottieContainerId={"lottie-loading-home"}
                        loadingText={
                            files.length > 1 ? "MIOs werden geladen" : "MIO wird geladen"
                        }
                    />
                )}
                <IonRow>
                    <p
                        className={"intro-text ion-margin-bottom"}
                        data-testid={"intro-text"}
                    >
                        Hier haben Sie die Möglichkeit ein MIO zu öffnen. Bitte beachten
                        Sie, dass sich ausschließlich Dateien im JSON oder XML Format
                        anzeigen lassen.
                    </p>
                </IonRow>
                <IonRow className={"ion-justify-content-center ion-margin-vertical"}>
                    <UI.InputFile
                        label={""}
                        onSelect={this.onSelect}
                        accept={"application/JSON, text/xml"}
                        multiple={true}
                    >
                        <div id={"lottie-add-mio"} data-testid={"lottie-add-mio"} />
                    </UI.InputFile>
                </IonRow>

                <UI.Modal
                    headline={"Fehler"}
                    content={this.renderErrorBox()}
                    show={hasError}
                    onClose={() => this.setState({ hasError: false })}
                />
            </UI.BasicView>
        );
    }
}

export default MIOConnector(withIonLifeCycle(Home));
