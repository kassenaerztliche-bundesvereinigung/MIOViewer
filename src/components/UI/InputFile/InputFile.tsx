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
import * as Icon from "react-feather";

import { InputProps } from "../Input/Input";

import "./InputFile.scss";

type InputFileProps = {
    accept: string;
    multiple: boolean;
    onSelect?: (files: File[]) => void;
    green?: boolean;
    className?: string;
} & InputProps;

type InputFileState = {
    files: File[];
    dragOver: boolean;
};

export default class InputFile extends React.Component<InputFileProps, InputFileState> {
    public static defaultProps = {
        accept: "*",
        multiple: false,
        label: "Dateien auswählen",
        disabled: false,
        success: false,
        warning: false,
        error: false,
        placeHolder: "Placeholder",
        green: false
    };

    constructor(props: InputFileProps) {
        super(props);
        this.state = {
            files: [],
            dragOver: false
        };
    }

    // Arrow func important cause of scope
    onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();
        const files = event.target.files;
        this.setFiles(files);
        event.target.value = "";
    };

    onDragOver = (event: React.DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        event.dataTransfer.dropEffect = "copy";
        this.setState({ dragOver: true });
    };

    onDragLeave = (event: React.DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ dragOver: false });
    };

    onDrop = (event: React.DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        if (!this.state.dragOver) return;
        const files = event.dataTransfer.files;
        this.setFiles(files);
    };

    setFiles = (files: FileList | null): void => {
        const filesArr = Array.prototype.slice.call(files);
        this.setState({ files: filesArr });

        if (this.props.onSelect) {
            this.props.onSelect(filesArr);
        }
    };

    render(): JSX.Element {
        const { multiple, accept, green, children, className } = this.props;

        return (
            <div
                className={"input-file" + (className ? " " + className : "")}
                data-testid={"input-file"}
            >
                <label
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                    className={this.state.dragOver ? " drag-over" : ""}
                >
                    <div className={"container"}>
                        <input
                            type={"file"}
                            onChange={this.onChange}
                            multiple={multiple}
                            accept={accept}
                            data-testid={"input-type-file"}
                        />
                        {children ? (
                            children
                        ) : (
                            <div className={"flex centered"}>
                                <Icon.PlusCircle className={green ? "green" : ""} />
                            </div>
                        )}
                        {/*<div className={"text"}>{label}</div>*/}
                    </div>
                </label>
            </div>
        );
    }
}
