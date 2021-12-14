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
import { RouteComponentProps } from "react-router";
import { withIonLifeCycle } from "@ionic/react";
import { UI } from "../../../../components";

class Technical extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        const parts = [
            {
                label: "Was macht der MIO Viewer?",
                value: "Der MIO Viewer stellt medizinische Informationsobjekte für Patient:innen, Ärzt:innen und weitere interessierte Personen dar. Da die FHIR®-Dateien für Menschen schwer lesbar sind, soll mit dem Viewer Abhilfe geschafft und die Inhalte klar und einfach dargestellt werden."
            },
            {
                label: "Wer hat den MIO Viewer entwickelt?",
                value: "Verantwortlich für die Entwicklung des MIO Viewers ist die Kassenärztliche Bundesvereinigung (KBV)."
            },
            {
                label: "Sind meine Daten hier sicher?",
                value: "Die Anwendung speichert keinerlei Daten von Ihnen. Alles was die Anwendung braucht, um das MIO darzustellen ist bereits auf dem Gerät installiert. Es wird keine Internetverbindung benötigt und es wird keine Auswertung der Daten vorgenommen. Damit der Viewer funktioniert, müssen die MIO-Dateien jedoch vorher aus der elektronischen Patientenakte (ePA) auf das Gerät geladen werden, um sie dann im Viewer zu öffnen."
            },
            {
                label: "Wo kann ich Fehler oder Verbesserungen melden?",
                value: "Idealerweise legen Sie ein <a href='https://github.com/kassenaerztliche-bundesvereinigung/MIOViewer/issues' target='_blank' rel='noopener noreferrer'>GitHub-Ticket</a> an. Alternativ können Sie Kontakt über die Seite <a href='https://mio.kbv.de/support' target='_blank' rel='noopener noreferrer'>MIO-Support</a> aufnehmen. Die Anfrage wird dann geprüft und Rückmeldung wird gegeben."
            },
            {
                label: "Mit welcher Lizenz wird dieses Produkt vertrieben?",
                value: "Der Viewer obliegt der LGPL v3. Das bedeutet, dass dieses Produkt in anderen Anwendungen eingebettet sein kann. Dabei müssen der Sourcecode und Änderungen am Viewer ebenfalls als OpenSource verfügbar sein. Zusätzliche Software kann proprietär lizenziert werden. Weitere Infos dazu hier: <a href='https://www.gnu.org/licenses/lgpl-3.0.de.html' target='_blank' rel='noopener noreferrer'>https://www.gnu.org/licenses/lgpl-3.0.de.html</a>"
            },
            {
                label: "Kann ich diese Anwendung mit meiner ePA verbinden?",
                value: "Derzeit ist diese Funktion nicht in Planung. Die Anwendung akzeptiert lediglich unverschlüsselte Dateien. Daher müssen Sie ihre MIOs im Vorfeld aus der ePA laden um sie dann in dieser Anwendung zu öffnen."
            },
            {
                label: "Welche MIOs sind unterstützt?",
                value: "Unser Ziel ist es zu jeder offiziellen Veröffentlichung eines MIOs den Viewer ebenfalls zu aktualisieren, um die MIOs darstellen zu können."
            },
            {
                label: "Wo finde ich weitere Informationen?",
                value: "Auf <a href='https://mio.kbv.de' target='_blank' rel='noopener noreferrer'>mio.kbv.de</a> gibt es alle Informationen zu den MIOs und deren Definitionen."
            }
        ];
        return (
            <UI.BasicView
                headline={"Technische Fragen"}
                back={() => history.goBack()}
                padding={false}
                id={"technical"}
            >
                <div className={"page-padded"}>
                    {parts.map((part) => (
                        <UI.ListItem.Collapsible
                            value={part.value}
                            label={part.label}
                            key={part.label}
                            innerHTML={true}
                        />
                    ))}
                </div>
            </UI.BasicView>
        );
    }
}

export default withIonLifeCycle(Technical);
