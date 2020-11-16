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

import { UI } from "../index";

type ErrorProps = {
    errors: string[];
    backClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export default class Error extends React.Component<ErrorProps> {
    render(): JSX.Element {
        const { errors, backClick } = this.props;
        return (
            <UI.BasicView headline={"Sorry"} back={backClick} id={"error"}>
                <h5 className={"green"}>Folgende Fehler sind aufgetreten:</h5>
                <ul data-testid={"error-list"}>
                    {errors.map((error, index) =>
                        error ? <li key={error + index}>{error}</li> : ""
                    )}
                </ul>
            </UI.BasicView>
        );
    }
}
