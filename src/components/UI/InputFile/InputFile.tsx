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
import { withIonLifeCycle } from "@ionic/react";
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

class InputFile extends React.Component<InputFileProps, InputFileState> {
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

    protected dragAndDropZone: HTMLDivElement | undefined;

    constructor(props: InputFileProps) {
        super(props);
        this.state = {
            files: [],
            dragOver: false
        };
    }

    ionViewDidEnter(): void {
        this.dragAndDropZone = document.createElement("div");
        this.dragAndDropZone.textContent = "Loslassen um MIO zu öffnen";
        this.dragAndDropZone.classList.add("drag-drop-zone");
        document.body.appendChild(this.dragAndDropZone);
        document
            .getElementById("root")
            ?.addEventListener("dragenter", () => this.showDropZone());

        this.dragAndDropZone.addEventListener("dragleave", this.onDragLeave);
        this.dragAndDropZone.addEventListener("dragenter", this.onDragOver);
        this.dragAndDropZone.addEventListener("dragover", this.onDragOver);
        this.dragAndDropZone.addEventListener("drop", this.onDrop);
    }

    ionViewWillLeave(): void {
        document
            .getElementById("root")
            ?.removeEventListener("dragenter", () => this.showDropZone());

        if (this.dragAndDropZone) {
            this.dragAndDropZone.removeEventListener("dragleave", this.onDragLeave);
            this.dragAndDropZone.removeEventListener("dragenter", this.onDragOver);
            this.dragAndDropZone.removeEventListener("dragover", this.onDragOver);
            this.dragAndDropZone.removeEventListener("drop", this.onDrop);
            this.dragAndDropZone.remove();
        }
    }

    showDropZone(): void {
        if (this.dragAndDropZone) {
            this.dragAndDropZone.style.display = "flex";
        }
    }

    hideDropZone(): void {
        if (this.dragAndDropZone) {
            this.dragAndDropZone.style.display = "none";
        }
    }

    // Arrow func important cause of scope
    onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();
        const files = event.target.files;
        this.setFiles(files);
        event.target.value = "";
    };

    onDragOver = (event: DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        this.setState({ dragOver: true });
    };

    onDragLeave = (event: DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ dragOver: false });
        this.hideDropZone();
    };

    onDrop = (event: DragEvent): void => {
        event.stopPropagation();
        event.preventDefault();
        if (!this.state.dragOver || !event.dataTransfer) return;
        const files = event.dataTransfer.files;
        this.setFiles(files);
        this.hideDropZone();
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
                <label className={this.state.dragOver ? " drag-over" : ""}>
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
                    </div>
                </label>
            </div>
        );
    }
}

export default withIonLifeCycle(InputFile);
