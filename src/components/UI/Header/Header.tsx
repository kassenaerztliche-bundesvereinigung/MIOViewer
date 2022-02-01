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

import { IonHeader } from "@ionic/react";
import ButtonIcon from "../ButtonIcon";

import { ReactFitty } from "react-fitty";

import "./Header.scss";

type HeaderProps = {
    headline: string;
    headerClass?: string;
    percent: number;
    pdfDownload?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    back?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isExample?: boolean;
};

export default class Header extends React.Component<HeaderProps> {
    static defaultProps = {
        percent: 0,
        isExample: false
    };

    render(): JSX.Element {
        const { headline, headerClass, percent, back, pdfDownload, isExample } =
            this.props;

        const p = 64 * percent;
        const divStyle = {
            transform: `translate(0px, ${-p}px)`
        };

        const navStyle = {
            top: `${p}px`
        };

        const textStyle = {
            top: 16 + p,
            bottom: 16
        };

        const hlStyle = {
            opacity: 1 - percent
        };

        const hl5Style = {
            opacity: percent
        };

        const classes = ["miov", headerClass];
        if (isExample) classes.push("example");

        return (
            <IonHeader className={classes.join(" ")} style={divStyle}>
                <nav style={navStyle} data-testid={"header-nav"}>
                    {isExample && (
                        <div className={"example-hint"}>
                            <p>
                                <b>Hinweis:</b> Das ist ein MIO Beispiel.
                            </p>
                        </div>
                    )}
                    {back && (
                        <ButtonIcon
                            icon={Icons.CornerUpLeft}
                            onClick={back}
                            dataTestId={"back-button"}
                            text={"Zurück"}
                        />
                    )}
                    {pdfDownload && (
                        <ButtonIcon
                            icon={Icons.Upload}
                            onClick={pdfDownload}
                            className={"pdf-download"}
                            dataTestId={"pdf-button"}
                            text={"Export"}
                            rightToLeft={true}
                        />
                    )}
                </nav>

                <div className={"headline-container"} style={textStyle}>
                    <h2 style={hlStyle} data-testid={"header-headline"}>
                        <ReactFitty minSize={20} maxSize={32} wrapText={true}>
                            {headline}
                        </ReactFitty>
                    </h2>
                    <h5 style={hl5Style}>
                        <ReactFitty minSize={8} maxSize={16}>
                            {headline}
                        </ReactFitty>
                    </h5>
                </div>
            </IonHeader>
        );
    }
}
