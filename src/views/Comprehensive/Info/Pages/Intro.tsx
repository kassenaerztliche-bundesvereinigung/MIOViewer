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

export default class Intro extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        return (
            <UI.BasicView
                headline={"MIO Einführung"}
                back={() => history.goBack()}
                id={"intro"}
            >
                <div className={"page-padded"}>
                    <p>
                        <b>Medizinische Informationsobjekte</b>, kurz MIOs, können als
                        digitale Informationsbausteine mit medizinischen Daten verstanden
                        werden. Sie sollen interoperabel von jedem System im
                        Gesundheitswesen lesbar und bearbeitbar sein. Um dies zu
                        gewährleisten, werden medizinische Daten in einem festgelegten
                        Format auf Basis internationaler Standards und Terminologien
                        dokumentiert. Dadurch wird der Austausch und die Verarbeitung der
                        Daten zwischen einzelnen Akteuren innerhalb des Gesundheitswesens,
                        unabhängig vom genutzten Softwaresystem, ermöglicht. Auch in
                        Krankenkassen-Apps für Versicherte werden die MIOs zum Einsatz
                        kommen, um beispielsweise den Impfstatus darzustellen. Dabei ist
                        es wichtig, zwischen den MIOs und der elektronischen Patientenakte
                        (ePA) zu unterscheiden.
                    </p>
                    <p>
                        Ein Beispiel für ein MIO ist der Impfpass. Er enthält verschiedene
                        medizinische Informationen, wie Daten zum Patient oder zur
                        Patientin, zum Impfstoff oder zu impfrelevanten Erkrankungen.
                        Bestimmte Daten sind dabei auch für andere MIOs relevant. Aus
                        diesem Grund hat die KBV sogenannte Basis-Profile definiert, die
                        potenziell in allen MIOs Verwendung finden können. Dazu gehören
                        PatientIn, Körperkenngrößen oder die Diagnose. So ist genau
                        festgelegt, dass das Profil ‚PatientIn‘ in immer der gleichen Form
                        beispielsweise den Namen, die Anschrift und das Geburtsdatum
                        enthält.
                    </p>
                    <a
                        href={"https://www.kbv.de/html/mio.php"}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                    >
                        https://www.kbv.de/html/mio.php
                    </a>
                </div>
            </UI.BasicView>
        );
    }
}
