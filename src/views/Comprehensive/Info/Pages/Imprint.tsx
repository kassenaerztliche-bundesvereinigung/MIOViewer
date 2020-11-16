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

export default class Imprint extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        return (
            <UI.BasicView
                headline={"Impressum"}
                back={() => history.goBack()}
                id={"imprint"}
            >
                <div className={"page-padded"}>
                    <h4>Kassenärztliche Bundesvereinigung KdöR</h4>
                    <p>Herbert-Lewin-Platz 2, 10623 Berlin</p>

                    <p>Postfach 12 02 64, 10592 Berlin</p>

                    <p>
                        gesetzlich vertreten durch den Vorstandsvorsitzenden, Dr. Andreas
                        Gassen
                    </p>
                    <p>Verantwortlich (i. S. d. § 55 RStV): Dr. Andreas Gassen</p>
                    <p>
                        Telefon:{" "}
                        <a
                            href="tel:+4903040050"
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            030 4005-0
                        </a>
                    </p>
                    <p>
                        Telefax:{" "}
                        <a
                            href={"tel:+4903040051590"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            030 4005-1590
                        </a>
                    </p>
                    <p>
                        E-Mail:{" "}
                        <a
                            href={"mailto:info@kbv.de"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                        >
                            info@kbv.de
                        </a>
                    </p>

                    <p>Umsatzsteuer-ID: Nr. DE 123 480 464</p>

                    <p>
                        Die Kassenärztliche Bundesvereinigung ist eine Körperschaft des
                        öffentlichen Rechts. Zuständige Aufsichtsbehörde ist das
                        Bundesministerium für Gesundheit (Rochusstr. 1, 53123 Bonn).
                    </p>
                </div>
            </UI.BasicView>
        );
    }
}
