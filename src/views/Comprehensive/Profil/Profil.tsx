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

import { UI } from "../../../components";

import { IonItem, IonLabel, withIonLifeCycle } from "@ionic/react";

import { SettingsConnector, SettingsConnectorType } from "../../../store";

import "./Profil.scss";

type ProfilState = {
    showModal: boolean;
    modalText: string;
};

class Profil extends React.Component<SettingsConnectorType, ProfilState> {
    constructor(props: SettingsConnectorType) {
        super(props);
        this.state = {
            showModal: false,
            modalText: ""
        };
    }

    protected setShowModal = (value: boolean, text = "") => {
        this.setState({ showModal: value, modalText: text });
    };

    protected changeShowIntro = async (value: boolean): Promise<void> => {
        await this.props.setShowIntro(value);
    };

    protected changeDevMode = async (value: boolean): Promise<void> => {
        await this.props.setDevMode(value);
    };

    render(): JSX.Element {
        const { showIntro, devMode } = this.props;
        const headline = "Applikationseinstellungen";

        return (
            <UI.BasicView headline={"Profil"} padding={false} id={"profil"}>
                <UI.DetailList.StickyHeader className={"detail-list"}>
                    <h5 className={"ion-padding ion-no-margin green sticky"}>
                        {headline}
                    </h5>
                    <IonItem className={"ion-no-padding ion-margin-horizontal"}>
                        <IonLabel className={"ion-no-margin ion-no-padding only-text"}>
                            <span>Entwicklungsmodus</span>
                            <UI.ButtonIcon
                                icon={Icons.HelpCircle}
                                onClick={() =>
                                    this.setShowModal(
                                        true,
                                        "Diese Option aktiviert die Möglichkeit sich den Quellcode der MIO Beispieldateien ansehen zu können."
                                    )
                                }
                            />
                        </IonLabel>
                        <UI.Toggle checked={devMode} onChange={this.changeDevMode} />
                    </IonItem>

                    <IonItem className={"ion-no-padding ion-margin-horizontal"}>
                        <IonLabel className={"ion-no-margin ion-no-padding only-text"}>
                            <span>MIO Einführung</span>
                            <UI.ButtonIcon
                                icon={Icons.HelpCircle}
                                onClick={() =>
                                    this.setShowModal(
                                        true,
                                        "Diese Option aktiviert einmalig das Anzeigen der „MIO-Einführung“ beim Start der Anwendung"
                                    )
                                }
                            />
                        </IonLabel>
                        <UI.Toggle checked={showIntro} onChange={this.changeShowIntro} />
                    </IonItem>

                    <UI.Modal
                        headline={"Info"}
                        content={<p>{this.state.modalText}</p>}
                        show={this.state.showModal}
                        onClose={() => this.setShowModal(false)}
                    />
                </UI.DetailList.StickyHeader>
            </UI.BasicView>
        );
    }
}

export default SettingsConnector(withIonLifeCycle(Profil));
