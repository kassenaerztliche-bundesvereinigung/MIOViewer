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

import { IonModal } from "@ionic/react";
import { UI } from "../../index";

import "./Modal.scss";

export type ModalProps = {
    headline?: string;
    content: JSX.Element;
    show: boolean;
    onClose?: () => void;
    negativeText?: string;
    onNegative?: () => void;
    positiveText?: string;
    onPositive?: () => void;
    hasCloseButton?: boolean;
    backdropDismiss?: boolean;
};

export default class Modal extends React.Component<ModalProps> {
    protected modal: React.RefObject<HTMLIonModalElement>;
    static defaultProps = {
        hasCloseButton: true,
        backdropDismiss: true
    };

    constructor(props: ModalProps) {
        super(props);
        this.modal = React.createRef();
    }

    protected dismiss = (): void => {
        this.modal.current?.dismiss();
    };

    protected didDismiss = (): void => {
        if (this.props.onClose) this.props.onClose();
    };

    protected negativeClick = (): void => {
        if (this.props.onNegative) this.props.onNegative();
        this.dismiss();
    };

    protected positiveClick = (): void => {
        if (this.props.onPositive) this.props.onPositive();
        this.dismiss();
    };

    render(): JSX.Element {
        const {
            headline,
            content,
            show,
            positiveText,
            onPositive,
            negativeText,
            onNegative,
            hasCloseButton,
            backdropDismiss
        } = this.props;
        return (
            <IonModal
                isOpen={show}
                onDidDismiss={this.didDismiss}
                backdropDismiss={backdropDismiss}
                cssClass="miov-modal"
                ref={this.modal}
            >
                <div className={"modal-header" + (headline ? " has-headline" : "")}>
                    {hasCloseButton && (
                        <UI.ButtonIcon icon={Icons.XCircle} onClick={this.dismiss} />
                    )}
                    {headline && (
                        <h2 className={"green"}>
                            <span>{headline}</span>
                        </h2>
                    )}
                </div>
                <div
                    className={
                        "modal-content " +
                        ((negativeText && onNegative) || (positiveText && onPositive)
                            ? "has-buttons"
                            : "")
                    }
                >
                    {content}
                </div>
                {((positiveText && onPositive) || (negativeText && onNegative)) && (
                    <div className={"modal-buttons"}>
                        {negativeText && onNegative && (
                            <button className={"negative"} onClick={this.negativeClick}>
                                {negativeText}
                            </button>
                        )}
                        {positiveText && onPositive && (
                            <button className={"positive"} onClick={this.positiveClick}>
                                {positiveText}
                            </button>
                        )}
                    </div>
                )}
            </IonModal>
        );
    }
}
