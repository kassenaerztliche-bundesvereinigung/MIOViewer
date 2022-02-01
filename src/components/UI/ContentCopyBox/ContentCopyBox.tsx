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

import { ButtonIcon } from "../index";

import { IonToast } from "@ionic/react";

import "./ContentCopyBox.scss";

export type ContentCopyBoxProps = {
    headline: string;
    content: string;
    contentToCopy?: string;
};

type ContentCopyBoxState = {
    showToast: boolean;
};

export default class ContentCopyBox extends React.Component<
    ContentCopyBoxProps,
    ContentCopyBoxState
> {
    constructor(props: ContentCopyBoxProps) {
        super(props);

        this.state = {
            showToast: false
        };
    }

    copyToClipboard = (): void => {
        const { contentToCopy, content } = this.props;

        navigator.clipboard
            .writeText(contentToCopy ? contentToCopy : content)
            .then(() => /* Alert the copied text */ {
                this.setState({ showToast: true });
            });
    };

    render(): JSX.Element {
        const { headline, content } = this.props;
        return (
            <div className={"copy-content-box"}>
                <h5>{headline}</h5>
                <ButtonIcon
                    icon={Icons.Clipboard}
                    className={"white"}
                    onClick={() => {
                        this.copyToClipboard();
                    }}
                />

                <div className={"content"}>{content}</div>

                <IonToast
                    mode={"ios"}
                    isOpen={this.state.showToast}
                    duration={1234}
                    onDidDismiss={() => {
                        this.setState({ showToast: false });
                    }}
                    message={"Fehler wurden in die Zwischenablage kopiert."}
                />
            </div>
        );
    }
}
