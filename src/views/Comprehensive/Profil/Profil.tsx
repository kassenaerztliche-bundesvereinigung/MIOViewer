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
import * as Icons from "react-feather";

import { UI } from "../../../components";

import { IonItem, IonLabel, withIonLifeCycle } from "@ionic/react";

import { SettingsConnector, SettingsConnectorType } from "../../../store";

import "./Profil.scss";

type ProfilState = {
    showModal: boolean;
};

class Profil extends React.Component<SettingsConnectorType, ProfilState> {
    constructor(props: SettingsConnectorType) {
        super(props);
        this.state = { showModal: false };
    }

    protected setShowModal = (value: boolean) => {
        this.setState({ showModal: value });
    };

    protected change = async (value: boolean): Promise<void> => {
        await this.props.setShowIntro(value);
    };

    render(): JSX.Element {
        const { showIntro } = this.props;
        const headline = "Applikationseinstellungen";
        return (
            <UI.BasicView headline={"Profil"} padding={false} id={"profil"}>
                <UI.DetailList.StickyHeader className={"detail-list"}>
                    <h5 className={"ion-padding ion-no-margin green sticky"}>
                        {headline}
                    </h5>
                    <IonItem className={"ion-no-padding ion-margin-horizontal"}>
                        <IonLabel className={"ion-no-margin ion-no-padding only-text"}>
                            <span>MIO Einführung</span>
                            <UI.ButtonIcon
                                icon={Icons.HelpCircle}
                                onClick={() => this.setShowModal(true)}
                            />
                        </IonLabel>
                        <UI.Toggle checked={showIntro} onChange={this.change} />
                    </IonItem>
                    <UI.Modal
                        headline={"Info"}
                        content={
                            <p>
                                Diese Option aktiviert einmalig das Anzeigen der
                                „MIO-Einführung“ beim Start der Anwendung
                            </p>
                        }
                        show={this.state.showModal}
                        onClose={() => this.setShowModal(false)}
                    />
                </UI.DetailList.StickyHeader>
            </UI.BasicView>
        );
    }
}

export default SettingsConnector(withIonLifeCycle(Profil));
