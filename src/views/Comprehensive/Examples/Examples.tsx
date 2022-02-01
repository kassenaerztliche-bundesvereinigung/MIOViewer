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

import { withIonLifeCycle } from "@ionic/react";

import { MIOConnector } from "../../../store";

import { UI } from "../../../components";

import "./Examples.scss";

class Examples extends UI.MIOSlides<UI.MIOSlidesProps, UI.MIOSlidesState> {
    constructor(props: UI.MIOSlidesProps) {
        super(props);

        this.state = {
            headline: "MIO Beispiele",
            id: "examples",
            testId: "example-slides",
            headerClass: "basic",
            slides: [],
            currentIndex: 0,
            back: () => this.props.history.goBack()
        };
    }

    createSlides = (): JSX.Element[][] => {
        const { examples } = this.props;
        const components: JSX.Element[] = [];
        components.push(...this.mapMioFolders(examples));

        // Sort by MIO name
        components.sort((a: JSX.Element, b: JSX.Element) => {
            return a.props.label > b.props.label
                ? 1
                : b.props.label > a.props.label
                ? -1
                : 0;
        });

        return this.chunk(components, this.miosPerPage());
    };
}

export default MIOConnector(withIonLifeCycle(Examples));
