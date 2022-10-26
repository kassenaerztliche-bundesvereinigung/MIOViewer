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

import { MIOConnector, MIOConnectorType } from "../../../store";
import { MR } from "@kbv/mioparser";

import { UI } from "../../../components";

import OverviewSectionMP from "../../MP/OverviewSection";
import { RoutePropsSection } from "../../MP/OverviewSection/Section";

class OverviewSection extends React.Component<MIOConnectorType & RoutePropsSection> {
    render(): JSX.Element {
        const { mio, history, location, match } = this.props;

        let component = undefined;
        const section = match.params.section;

        if (MR.V1_1_0.Profile.Bundle.is(mio)) {
            component = (
                <OverviewSectionMP
                    mio={mio}
                    history={history}
                    location={location}
                    match={match}
                    section={section}
                />
            );
        }

        if (component) {
            return component;
        } else {
            const errors = [
                !mio
                    ? "MIO nicht gefunden"
                    : "Für dieses MIO gibt es noch keine Section Ansicht"
            ];
            return <UI.Error errors={errors} backClick={() => history.goBack()} />;
        }
    }
}

export default MIOConnector(OverviewSection);
