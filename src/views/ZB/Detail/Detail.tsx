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

import { RouteComponentProps } from "react-router";
import { MIOConnector, MIOConnectorType } from "../../../store";

import { ZAEB } from "@kbv/mioparser";
import { UI, ZB } from "../../../components/";
import * as Models from "../../../models";
import DetailComponent from "../../../components/Detail";
import PatientDetailList from "../../../components/PatientDetailList";

type DetailProps = MIOConnectorType & RouteComponentProps;

class Detail extends React.Component<DetailProps, Record<string, unknown>> {
    getDetail = ():
        | { headline: string; testIdSuffix?: string; component: JSX.Element }
        | undefined => {
        const { mio, entry, history, location, match } = this.props;

        if (mio && entry) {
            const resource = entry.resource;
            const props = {
                mio: mio,
                entry: resource,
                history: history,
                location: location,
                match: match
            };

            if (ZAEB.V1_00_000.Profile.Observation.is(resource)) {
                const model = new Models.ZB.ObservationModel(resource, mio, history);
                return {
                    headline: "Details der Untersuchung",
                    testIdSuffix: "observation",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (ZAEB.V1_00_000.Profile.GaplessDocumentation.is(resource)) {
                const model = new Models.ZB.GaplessDocumentationModel(
                    resource,
                    mio,
                    history
                );
                return {
                    headline: "Lückenlose Dokumentation",
                    testIdSuffix: "gapless-documentation",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (ZAEB.V1_00_000.Profile.Patient.is(resource)) {
                const patient = new Models.ZB.PatientModel(resource, mio, history);
                const address = new Models.AddressModel<ZAEB.V1_00_000.Profile.Patient>(
                    resource,
                    mio,
                    history
                );
                return {
                    headline: "Patient/-in",
                    testIdSuffix: "patient",
                    component: <DetailComponent {...props} models={[patient, address]} />
                };
            } else if (ZAEB.V1_00_000.Profile.Organization.is(resource)) {
                const organization = new Models.ZB.OrganizationModel(
                    resource,
                    mio,
                    history
                );
                const address = new Models.AddressModel<
                    ZAEB.V1_00_000.Profile.Organization
                >(resource, mio, history);
                const telecom = new Models.TelecomModel<
                    ZAEB.V1_00_000.Profile.Organization
                >(resource, mio, history);
                return {
                    headline: "Details zur Organisation",
                    testIdSuffix: "organization",
                    component: (
                        <DetailComponent
                            {...props}
                            models={[organization, address, telecom]}
                        />
                    )
                };
            } else {
                const profile: string = entry.resource.meta.profile[0];
                return {
                    headline: "Sorry",
                    component: (
                        <UI.Error
                            errors={[
                                `Das Detail zum Profil ${profile
                                    .split("/")
                                    .pop()} kann nicht angezeigt werden`
                            ]}
                            backClick={() => history.goBack()}
                        />
                    )
                };
            }
        }
    };

    render(): JSX.Element {
        const { mio, entry, history, location, match, makePDF } = this.props;
        const detail = this.getDetail();

        if (mio && entry && detail) {
            const patient = ZB.Util.getPatient(mio as ZAEB.V1_00_000.Profile.Bundle);

            const showPatient =
                ZAEB.V1_00_000.Profile.Observation.is(entry.resource) ||
                ZAEB.V1_00_000.Profile.GaplessDocumentation.is(entry.resource);

            return (
                <UI.BasicView
                    headline={detail.headline}
                    headerClass={"zaeb"}
                    padding={false}
                    back={() => history.goBack()}
                    pdfDownload={() => makePDF(mio)}
                    testId={"zb-detail"}
                    id={mio.identifier.value + "-" + entry.fullUrl}
                >
                    <div
                        className={"zb-detail"}
                        data-testid={
                            "zb-detail" +
                            (detail.testIdSuffix ? `-${detail.testIdSuffix}` : "")
                        }
                    >
                        {detail.component}

                        {showPatient && patient && (
                            <PatientDetailList
                                mio={mio}
                                entry={patient.resource}
                                history={history}
                                location={location}
                                match={match}
                            />
                        )}
                    </div>
                </UI.BasicView>
            );
        } else {
            const errors = [
                !mio ? "MIO nicht gefunden" : "",
                !entry ? "Eintrag nicht gefunden" : ""
            ];
            return <UI.Error errors={errors} backClick={() => history.push("/main")} />;
        }
    }
}

export default MIOConnector(Detail);
