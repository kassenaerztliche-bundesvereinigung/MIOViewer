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
import { RouteComponentProps } from "react-router";
import { withIonLifeCycle } from "@ionic/react";
import { UI } from "../../../../components";

class Mios extends React.Component<RouteComponentProps> {
    render(): JSX.Element {
        const { history } = this.props;

        return (
            <UI.BasicView
                headline={"Unterstützte MIOs"}
                back={() => history.goBack()}
                id={"mios"}
                className={"info-page"}
            >
                <div className={"page-padded"}>
                    <p>MIOs die derzeit vom MIO Viewer dargestellt werden können:</p>
                    <ul>
                        <li>
                            <a
                                href={"https://mio.kbv.de/display/IM1X1X0"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Impfpass (1.1.0)
                            </a>
                        </li>
                        <li>
                            <a
                                href={"https://mio.kbv.de/display/ZB1X1X0"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Zahnärztliches Bonusheft (1.1.0)
                            </a>
                        </li>
                        <li>
                            <a
                                href={"https://mio.kbv.de/display/MP1X1X0"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Mutterpass (1.1.0)
                            </a>
                        </li>
                        <li>
                            <a
                                href={"https://mio.kbv.de/display/UH1X0X1"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Untersuchungsheft (1.0.1)
                            </a>
                        </li>
                        <li>
                            <a
                                href={"https://mio.kbv.de/display/PKA1X0X0"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Patientenkurzakte (1.0.0)
                            </a>
                        </li>
                    </ul>
                </div>
            </UI.BasicView>
        );
    }
}

export default withIonLifeCycle(Mios);
