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

import { Vaccination } from "@kbv/mioparser";

import { RouteComponentProps } from "react-router";
import { MIOConnector, MIOConnectorType } from "../../../store";

import { UI, IM } from "../../../components/";
import * as Models from "../../../models";

import DetailComponent from "../../../components/Detail";
import PatientDetailList from "../../../components/PatientDetailList";

type DetailProps = MIOConnectorType & RouteComponentProps;

class Detail extends React.Component<DetailProps> {
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

            if (Vaccination.V1_00_000.Profile.RecordPrime.is(resource)) {
                const model = new Models.IM.RecordPrimeModel(resource, mio, history);
                return {
                    headline: "Details zur Impfung",
                    testIdSuffix: "record",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (Vaccination.V1_00_000.Profile.RecordAddendum.is(resource)) {
                const model = new Models.IM.RecordAddendumModel(resource, mio, history);
                return {
                    headline: "Details zur Impfung",
                    testIdSuffix: "record",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (Vaccination.V1_00_000.Profile.Condition.is(resource)) {
                const model = new Models.IM.ConditionModel(resource, mio, history);
                return {
                    headline: "Details zur Erkrankung",
                    testIdSuffix: "condition",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (
                Vaccination.V1_00_000.Profile.ObservationImmunizationStatus.is(resource)
            ) {
                const model = new Models.IM.ObservationModel(resource, mio, history);
                return {
                    headline: "Details zur Immunreaktion",
                    testIdSuffix: "observation",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (Vaccination.V1_00_000.Profile.Patient.is(resource)) {
                let headline = "Patient/-in";

                if (resource.gender === "männlich") {
                    headline = "Patient";
                } else if (resource.gender === "weiblich") {
                    headline = "Patientin";
                }

                const model = new Models.IM.PatientModel(resource, mio, history);
                return {
                    headline: headline,
                    testIdSuffix: "patient",
                    component: <DetailComponent {...props} models={[model]} />
                };
            } else if (
                Vaccination.V1_00_000.Profile.Practitioner.is(resource) ||
                Vaccination.V1_00_000.Profile.PractitionerAddendum.is(resource)
            ) {
                const practitioner = new Models.IM.PractitionerModel(
                    resource,
                    mio,
                    history
                );
                const telecom = new Models.TelecomModel(resource, mio, history);
                const comment = new Models.IM.AdditionalCommentModel(
                    resource,
                    mio,
                    history
                );
                return {
                    headline: "Details zur Person",
                    testIdSuffix: "practitioner",
                    component: (
                        <DetailComponent
                            {...props}
                            models={[practitioner, telecom, comment]}
                        />
                    )
                };
            } else if (Vaccination.V1_00_000.Profile.Organization.is(resource)) {
                const model = new Models.IM.OrganizationModel(resource, mio, history);
                const address = new Models.AddressModel(resource, mio, history);
                const telecom = new Models.TelecomModel(resource, mio, history);
                const comment = new Models.IM.AdditionalCommentModel(
                    resource,
                    mio,
                    history
                );

                return {
                    headline: "Details zur Organisation",
                    testIdSuffix: "organization",
                    component: (
                        <DetailComponent
                            {...props}
                            models={[model, address, telecom, comment]}
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
            const patient = IM.Util.getPatient(
                mio as Vaccination.V1_00_000.Profile.BundleEntry
            );
            const showPatient =
                Vaccination.V1_00_000.Profile.RecordPrime.is(entry.resource) ||
                Vaccination.V1_00_000.Profile.RecordAddendum.is(entry.resource) ||
                Vaccination.V1_00_000.Profile.ObservationImmunizationStatus.is(
                    entry.resource
                ) ||
                Vaccination.V1_00_000.Profile.Condition.is(entry.resource);

            return (
                <UI.BasicView
                    headline={detail.headline}
                    headerClass={"impfpass"}
                    padding={false}
                    back={() => history.goBack()}
                    pdfDownload={() => makePDF(mio)}
                    testId={"im-detail"}
                    id={mio.identifier.value + "-" + entry.resource.id}
                >
                    <div
                        className={"im-detail"}
                        data-testid={
                            "im-detail" +
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
