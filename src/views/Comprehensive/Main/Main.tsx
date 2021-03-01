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
import * as Icons from "react-feather";
import { withIonLifeCycle } from "@ionic/react";

import { MIOConnector } from "../../../store";
import { UI } from "../../../components";

import "./Main.scss";

class Main extends UI.MIOSlides<UI.MIOSlidesProps, UI.MIOSlidesState> {
    protected addMIOHelper: UI.AddMIOHelper;

    constructor(props: UI.MIOSlidesProps) {
        super(props);

        this.state = {
            headline: "Meine MIOs",
            id: "main",
            testId: "main-view",
            slides: [],
            currentIndex: 0
        };

        this.addMIOHelper = new UI.AddMIOHelper(
            this.props,
            this.onAddMIOHelperParseFiles,
            this.onAddMIOHelperStateChange
        );
    }

    onAddMIOHelperStateChange = (): void => {
        this.setState({});
    };

    onAddMIOHelperParseFiles = (): void => {
        this.setState({
            slides: this.createSlides(),
            currentIndex: 0
        });
    };

    createSlides = (): JSX.Element[][] => {
        const { mios, history } = this.props;
        const components: JSX.Element[] = [];

        components.push(
            <UI.InputFile
                label={""}
                onSelect={this.addMIOHelper.onSelect}
                accept={"application/JSON, text/xml"}
                green={true}
                multiple={true}
                key={"add"}
                className={"add-mio"}
            >
                <UI.MIOFolder label={"MIO Datei öffnen"}>
                    <Icons.PlusCircle />
                </UI.MIOFolder>
            </UI.InputFile>
        );

        components.push(
            <div className={"mio-examples"} key={"examples"}>
                <UI.MIOFolder
                    outlined={true}
                    labelBG={false}
                    label={"MIO Beispiele"}
                    onClick={() => history.push("/examples")}
                >
                    <Icons.ArrowRight />
                </UI.MIOFolder>
            </div>
        );

        components.push(...this.mapMioFolders(mios));
        return this.chunk(components, this.miosPerPage());
    };

    render(): JSX.Element {
        const { loading } = this.props;

        return (
            <UI.BasicView headline={"Meine MIOs"} padding={false} id={"main"}>
                {this.renderSlides(this.addMIOHelper.render(loading, "main"))}
            </UI.BasicView>
        );
    }
}

export default MIOConnector(withIonLifeCycle(Main));
