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

import { RouteComponentProps } from "react-router";

import { MIOConnector, MIOConnectorType } from "../../../store";
import { ParserUtil, Vaccination, ZAEB, MR, CMR } from "@kbv/mioparser";

import { UI, Util } from "../../../components";

import OverviewIM from "../../IM/Overview";
import OverviewZAEB from "../../ZB/Overview";
import OverviewMP from "../../MP/Overview";
import OverviewUH from "../../UH/Overview";
import OverviewCMR from "../../UH/Overview/CMR";
import OverviewPC from "../../UH/Overview/PC";
import OverviewPN from "../../UH/Overview/PN";

class Overview extends React.Component<MIOConnectorType & RouteComponentProps> {
    render(): JSX.Element {
        const { mio, history, location, match, makePDF } = this.props;

        let headline = "Übersicht";
        let mioClass: UI.MIOClassName = undefined;
        let component = undefined;

        if (match.path.startsWith("/mios") || match.path.startsWith("/examples")) {
            const params = match.params as { id: string };
            if (params.id === "uheft") {
                return <OverviewUH {...this.props} />;
            }
        } else {
            if (mio) {
                if (Vaccination.V1_00_000.Profile.BundleEntry.is(mio)) {
                    headline = "Impfpass";
                    mioClass = "impfpass";
                    component = <OverviewIM mio={mio} history={history} />;
                } else if (ZAEB.V1_00_000.Profile.Bundle.is(mio)) {
                    headline = "Zahnärztliches Bonusheft";
                    mioClass = "zaeb";
                    component = <OverviewZAEB mio={mio} history={history} />;
                } else if (MR.V1_00_000.Profile.Bundle.is(mio)) {
                    headline = "Mutterpass";
                    mioClass = "mutterpass";
                    component = <OverviewMP mio={mio} history={history} />;
                } else if (CMR.V1_00_000.Profile.CMRBundle.is(mio)) {
                    const composition = Util.UH.getUComposition(mio)?.resource;
                    headline = composition
                        ? Util.UH.getType(composition)
                        : Util.UH.getUCompositionTitle(mio);

                    if (Util.UH.getPercentileComposition(mio)) {
                        headline = "Perzentilkurven";
                    }

                    mioClass = "uheft";
                    component = (
                        <OverviewCMR
                            mio={mio}
                            history={history}
                            location={location}
                            match={match}
                        />
                    );
                } else if (CMR.V1_00_000.Profile.PCBundle.is(mio)) {
                    const composition = ParserUtil.getEntry<CMR.V1_00_000.Profile.PCCompositionExaminationParticipation>(
                        mio,
                        [CMR.V1_00_000.Profile.PCCompositionExaminationParticipation]
                    );

                    headline = composition
                        ? composition.resource.title
                        : "Teilnahmekarte";
                    mioClass = "uheft";
                    component = (
                        <OverviewPC
                            mio={mio}
                            history={history}
                            location={location}
                            match={match}
                        />
                    );
                } else if (CMR.V1_00_000.Profile.PNBundle.is(mio)) {
                    headline = "Elternnotiz";
                    mioClass = "uheft";
                    component = (
                        <OverviewPN
                            mio={mio}
                            history={history}
                            location={location}
                            match={match}
                        />
                    );
                }
            }

            if (component) {
                return (
                    <UI.BasicView
                        headline={headline}
                        headerClass={mioClass}
                        padding={false}
                        back={() => history.goBack()}
                        pdfDownload={() => makePDF(mio)}
                        id={mio?.identifier.value}
                        isExample={Util.Misc.isExample(mio)}
                    >
                        {component}
                    </UI.BasicView>
                );
            }
        }

        const errors = [
            !mio ? "MIO nicht gefunden" : "Für dieses MIO gibt es noch keine Ansicht"
        ];
        return <UI.Error errors={errors} backClick={() => history.goBack()} />;
    }
}

export default MIOConnector(Overview);
