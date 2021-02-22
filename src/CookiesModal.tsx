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

import { UI } from "./components";
import React from "react";
import { SettingsConnector, SettingsConnectorType } from "./store";

class CookiesModal extends React.Component<SettingsConnectorType> {
    render() {
        const { cookiesAccepted, acceptCookies } = this.props;
        return (
            <UI.Modal
                headline={"Datenschutz"}
                content={
                    <div className={"cookies-modal"}>
                        <p>
                            Wir verwenden Cookies nur um die beste Erfahrung auf unserer
                            Website zu bieten und nutzen den Speicher des Browsers, damit
                            Sie Ihre Profil-Einstellungen speichern können.
                        </p>
                        <p>
                            Mehr zum Datenschutz für alle Online-Angebote der KBV erfahren
                            Sie hier:{" "}
                            <a
                                href={"https://www.kbv.de/html/datenschutz.php"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={"white"}
                            >
                                KBV Datenschutz
                            </a>
                        </p>
                    </div>
                }
                show={!cookiesAccepted}
                hasCloseButton={false}
                onPositive={() => acceptCookies()}
                positiveText={"OK"}
                backdropDismiss={false}
            />
        );
    }
}

export default SettingsConnector(CookiesModal);
