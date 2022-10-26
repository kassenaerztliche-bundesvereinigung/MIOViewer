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

import { MIOConnector, MIOConnectorType, RouteProps } from "../../../store";
import { ParserUtil, Vaccination, ZAEB, MR, CMR, PKA } from "@kbv/mioparser";
import { withIonLifeCycle } from "@ionic/react";

import { UI, Util } from "../../../components";

import OverviewIM from "../../IM/Overview";
import OverviewZAEB from "../../ZB/Overview";
import OverviewMP from "../../MP/Overview";
import OverviewCMR from "../../UH/Overview/CMR";
import OverviewPC from "../../UH/Overview/PC";
import OverviewPN from "../../UH/Overview/PN";
import OverviewPK from "../../PK/Overview";

import OverviewList from "../OverviewList";

import MIOMap from "../../../MIOMap";

class Overview extends React.Component<MIOConnectorType & RouteProps> {
    render(): JSX.Element {
        const { mio, history, location, match, makePDF } = this.props;

        let headline = "Übersicht";
        let mioClass: UI.MIOClassName = undefined;
        let component = undefined;

        if (match.path.startsWith("/mios") || match.path.startsWith("/examples")) {
            const id = match.params.id;
            const supported = ["impfpass", "zaeb", "mutterpass", "uheft", "pka"];
            const isSupported = supported.includes(id);

            if (isSupported) {
                const matching = MIOMap.filter((b) => b.className === id)[0];
                if (matching) {
                    return <OverviewList {...matching} {...this.props} />;
                }
            }
        } else {
            if (mio) {
                if (Vaccination.V1_1_0.Profile.BundleEntry.is(mio)) {
                    headline = "Impfpass";
                    mioClass = "impfpass";
                    component = <OverviewIM mio={mio} history={history} />;
                } else if (ZAEB.V1_1_0.Profile.Bundle.is(mio)) {
                    headline = "Zahnärztliches Bonusheft";
                    mioClass = "zaeb";
                    component = <OverviewZAEB mio={mio} history={history} />;
                } else if (MR.V1_1_0.Profile.Bundle.is(mio)) {
                    headline = "Mutterpass";
                    mioClass = "mutterpass";
                    component = <OverviewMP mio={mio} history={history} />;
                } else if (CMR.V1_0_1.Profile.CMRBundle.is(mio)) {
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
                } else if (CMR.V1_0_1.Profile.PCBundle.is(mio)) {
                    const composition =
                        ParserUtil.getEntry<CMR.V1_0_1.Profile.PCCompositionExaminationParticipation>(
                            mio,
                            [CMR.V1_0_1.Profile.PCCompositionExaminationParticipation]
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
                } else if (CMR.V1_0_1.Profile.PNBundle.is(mio)) {
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
                } else if (PKA.V1_0_0.Profile.NFDxDPEBundle.is(mio)) {
                    headline = Util.PK.getCompositionTitle(mio) ?? "Patientenkurzakte";
                    mioClass = "pka";
                    component = <OverviewPK mio={mio} history={history} />;
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

export default MIOConnector(withIonLifeCycle(Overview));
