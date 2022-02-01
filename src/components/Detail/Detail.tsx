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
import ReactJson from "react-json-view";
import { IonToast } from "@ionic/react";

import { KBVBundleResource, KBVResource } from "@kbv/mioparser";

import { RouteComponentProps } from "react-router";
import { Model } from "../../models";
import { UI } from "../index";

import { ButtonIcon } from "../UI";
import * as Icons from "react-feather";

import "./Detail.scss";

const jsonViewTheme = {
    base00: "white", // Default Background
    base01: "white", // Lighter Background (Used for status bars, line number and folding marks)
    base02: "#ebeef0", // Selection Background, Lines
    base03: "#91A8CE", // Comments, Invisibles, Line Highlighting
    base04: "#91A8CE", // Dark Foreground (Used for status bars)
    base05: "#23519d", // Default Foreground, Caret, Delimiters, Operators
    base06: "#c3ced2", // Light Foreground (Not often used)
    base07: "#23519d", // Brackets {} []
    base08: "#23519d", // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    base09: "#9d238e", // Integers, Boolean, Constants, XML Attributes, Markup Link Url
    base0A: "#8e9d23", // Classes, Markup Bold, Search Text Background
    base0B: "#8e9d23", // Strings, Inherited Class, Markup Code, Diff Inserted
    base0C: "black", // Array indices
    base0D: "#239398", // Arrow expanded
    base0E: "#239398", // Arrow collapsed
    base0F: "#239d6f" // Numbers
};

type DetailState = {
    showToast: boolean;
};

export type DetailProps = {
    models: Model[];
    mio: KBVBundleResource;
    entry: KBVResource;
    className?: string;
    devMode: boolean;
};

export default class Detail extends React.Component<
    DetailProps & RouteComponentProps,
    DetailState
> {
    static displayName = "Detail";

    constructor(props: DetailProps & RouteComponentProps) {
        super(props);

        this.state = {
            showToast: false
        };
    }

    copyToClipboard = (): void => {
        const { devMode, models } = this.props;
        if (!devMode || !models.length) return;

        const str = JSON.stringify(models[0].getJSON());
        navigator.clipboard.writeText(str).then(() => {
            this.setState({ showToast: true });
        });
    };

    render(): JSX.Element {
        const { models, className, devMode } = this.props;
        const classNames = ["detail", className].join(" ");

        return (
            <>
                {devMode && (
                    <div className={classNames}>
                        {models.length && (
                            <div className={"detail-json-container"}>
                                <div>
                                    <h5 className={"green"}>MIO Quellcode als JSON</h5>
                                    <ButtonIcon
                                        icon={Icons.Clipboard}
                                        className={"green"}
                                        onClick={() => {
                                            this.copyToClipboard();
                                        }}
                                    />
                                </div>
                                <ReactJson
                                    src={models[0].getJSON()}
                                    enableClipboard={false}
                                    collapsed={true}
                                    name={false}
                                    indentWidth={2}
                                    displayDataTypes={false}
                                    theme={jsonViewTheme}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className={classNames}>
                    {models.map((model, index) => (
                        <UI.DetailList.Model model={model} {...this.props} key={index} />
                    ))}
                </div>

                <IonToast
                    mode={"ios"}
                    isOpen={this.state.showToast}
                    duration={1234}
                    onDidDismiss={() => {
                        this.setState({ showToast: false });
                    }}
                    message={"MIO Quellcode wurde in die Zwischenablage kopiert."}
                />
            </>
        );
    }
}
