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
import { RouteComponentProps } from "react-router";
import { UI } from "../../../../components";

export default class Commenting extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        return (
            <UI.BasicView
                headline={"MIO Kommentierung"}
                back={() => history.goBack()}
                id={"commenting"}
            >
                <div className={"page-padded"}>
                    <p>
                        Zu Beginn wird jedes medizinische Informationsobjekt zunächst
                        intern nach einer sorgfältigen Analyse des Umfelds erarbeitet.
                        Dabei werden auch beteiligte Verbände und Organisationen zu Rate
                        gezogen. Sie sind teilweise bereits in der Erstellung involviert,
                        werden aber in der ersten Phase, der Kommentierung, besonders
                        relevant.
                    </p>
                    <p>
                        Sobald die KBV das MIO inhaltlich modelliert und die Spezifikation
                        erarbeitet hat, ist es bereit für das erste externe Feedback. Zu
                        diesem Zweck wurde die Plattform{" "}
                        <a
                            href={"https://mio.kbv.de"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            mio.kbv.de
                        </a>{" "}
                        ins Leben gerufen, um der Öffentlichkeit die Möglichkeit zu
                        bieten, MIOs zu kommentieren und aktiv an der Entwicklung
                        teilzuhaben.
                    </p>
                    <p>
                        Während der meist sechswöchigen öffentlichen Kommentierung haben
                        Interessierte die Möglichkeit, Hinweise zu geben,
                        Verbesserungsvorschläge zu machen und Fragen zu stellen. Alle
                        Kommentare werden von der KBV analysiert und nach Abschluss der
                        Kommentierungszeit beantwortet. Nachdem etwaige Änderungen am MIO
                        eingearbeitet wurden, beginnt die zweite Phase. Die Herstellung
                        des Benehmens ist laut gesetzlich vorgeschriebenem Prozess
                        ausschließlich beteiligten Verbänden und Organisationen
                        vorbehalten. Näheres ist in der Verfahrensordnung beschrieben. In
                        dieser Phase können letzte Änderungswünsche und Feedback an die
                        KBV übermittelt werden. Nach Prüfung dieser Stellungnahmen und
                        Einarbeitung etwaiger darauf basierender Änderungen erfolgt die
                        Festlegung des MIOs durch den Vorstand der KBV.
                    </p>
                    <p>
                        Um den Prozess noch integrativer und verständlicher zu gestalten,
                        bietet die KBV Websessions während der Kommentierungsphase eines
                        MIOs an, um alle Interessierten mitzunehmen und bereits frühzeitig
                        Fragen zu beantworten. Die Websessions werden auf{" "}
                        <a
                            href={"https://mio.kbv.de"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            mio.kbv.de
                        </a>{" "}
                        im Bereich ‚Termine‘ angekündigt.
                    </p>
                    <p>
                        Die Erstellung von bestimmten MIOs kann gesetzlich vorgeschrieben,
                        von der KBV erdacht oder von Externen vorgeschlagen werden.
                        Vorschläge werden gerne unter{" "}
                        <a
                            href={"mailto:mio@kbv.de"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            mio@kbv.de
                        </a>{" "}
                        entgegengenommen.
                    </p>
                </div>
            </UI.BasicView>
        );
    }
}
