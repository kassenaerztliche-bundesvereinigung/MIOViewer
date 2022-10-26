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
import { IonRow, withIonLifeCycle } from "@ionic/react";

import { MIOConnector, MIOConnectorType } from "../../../store";

import { UI } from "../../../components";

import "./Home.scss";

class Home extends React.Component<MIOConnectorType & RouteComponentProps> {
    protected addMIOHelper: UI.AddMIOHelper;

    constructor(props: MIOConnectorType & RouteComponentProps) {
        super(props);

        this.addMIOHelper = new UI.AddMIOHelper(
            this.props,
            this.onAddMIOHelperParseFiles,
            this.onAddMIOHelperStateChange
        );
    }

    onAddMIOHelperStateChange = (): void => {
        this.setState({});
    };

    onAddMIOHelperParseFiles = (): void => {
        if (this.props.location.pathname === "/home") {
            this.props.history.push("/main");
        }
    };

    render(): JSX.Element {
        const { loading, history } = this.props;

        return (
            <UI.BasicView headline={"Herzlich Willkommen"} id={"home"}>
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
                    <div className={"folders"}>
                        <div className={"add-mio"}>
                            <UI.InputFile
                                label={""}
                                onSelect={this.addMIOHelper.onSelect}
                                accept={"application/JSON, text/xml"}
                                multiple={true}
                            >
                                <UI.MIOFolder label={"MIO Datei öffnen"}>
                                    <Icons.PlusCircle />
                                </UI.MIOFolder>
                            </UI.InputFile>
                        </div>

                        <div className={"mio-examples"}>
                            <UI.MIOFolder
                                outlined={true}
                                labelBG={false}
                                label={"MIO Beispiele"}
                                onClick={() => history.push("/examples")}
                            >
                                <Icons.ArrowRight />
                            </UI.MIOFolder>
                        </div>
                    </div>
                </IonRow>
                {this.addMIOHelper.renderMain(loading, "home")}
            </UI.BasicView>
        );
    }
}

export default MIOConnector(withIonLifeCycle(Home));
