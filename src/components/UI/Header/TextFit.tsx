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
import _debounce from "lodash.debounce";

export type TextFitProps = {
    compressor: number;
    debounce: number;
    defaultFontSize: number | string;
    minFontSize: number;
    maxFontSize: number;
    parent?: HTMLElement | string;
    vertical: true;
};

export type TextFitState = {
    fontSize: string;
};

export default class TextFit extends React.Component<TextFitProps, TextFitState> {
    public static defaultProps = {
        compressor: 1.0,
        debounce: 100,
        defaultFontSize: "inherit",
        minFontSize: Number.NEGATIVE_INFINITY,
        maxFontSize: Number.POSITIVE_INFINITY,
        vertical: false
    };

    private _parentNode: HTMLElement | null;
    private element: React.RefObject<HTMLDivElement>;

    constructor(props: TextFitProps) {
        super(props);

        let defaultFontSize = props.defaultFontSize;

        if (typeof props.defaultFontSize === "number") {
            defaultFontSize = `${props.defaultFontSize}px`;
        }

        this.state = {
            fontSize: defaultFontSize as string
        };

        this._onBodyResize = this._onBodyResize.bind(this);
        this._parentNode = null;

        this.element = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<TextFitProps>): void {
        // When a new parent ID is passed in, or the new parentNode
        // is available, run resize again
        if (this.props.parent !== prevProps.parent) {
            this._onBodyResize();
        }
    }

    componentDidMount(): void {
        const { compressor, parent } = this.props;

        if (0 >= compressor) {
            console.warn("Warning: The compressor should be greater than 0.");
        }

        if (parent) {
            this._parentNode =
                typeof parent === "string" ? document.getElementById(parent) : parent;
        }

        window.addEventListener(
            "resize",
            _debounce(this._onBodyResize, this.props.debounce)
        );
        this._onBodyResize();
    }

    componentWillUnmount(): void {
        window.removeEventListener(
            "resize",
            _debounce(this._onBodyResize, this.props.debounce)
        );
    }

    _getFontSize(value: number): number {
        const props = this.props;

        return Math.max(
            Math.min(value / (props.compressor * 10), props.maxFontSize),
            props.minFontSize
        );
    }

    _onBodyResize(): void {
        if (this.element.current && this.element.current.offsetWidth) {
            let value = this.element.current.offsetWidth;

            if (this.props.vertical) {
                const parent =
                    this._parentNode || (this.element.current.parentNode as HTMLElement);
                value = parent?.offsetHeight;
            }

            const newFontSize = this._getFontSize(value);

            this.setState({
                fontSize: `${newFontSize}px`
            });
        }
    }

    render(): JSX.Element {
        return (
            <div
                className={"text-fit-container"}
                ref={this.element}
                style={{ fontSize: this.state.fontSize }}
            >
                {this.props.children}
            </div>
        );
    }
}
