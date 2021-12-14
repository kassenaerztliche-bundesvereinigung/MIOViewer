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
import { MIOConnectorType } from "../../../store";

import { KBVBundleResource, MIOEntry, Vaccination, ZAEB, MR, CMR } from "@kbv/mioparser";

import { UI, Util } from "../../../components/";

import * as Models from "../../../models/";

import DetailComponent from "../../../components/Detail/Detail";
import { SettingsConnectorType } from "../../../store";
import { DetailMapping } from "./Types";

type DetailProps = MIOConnectorType & SettingsConnectorType & RouteComponentProps;

type ListItemType = { header: string; testIdSuffix?: string; component: JSX.Element };

export default abstract class DetailBase<
    T extends KBVBundleResource
> extends React.Component<DetailProps, Record<string, unknown>> {
    protected abstract getMappings(): DetailMapping[];
    protected abstract showPatient(): boolean;
    protected abstract getPatient():
        | MIOEntry<
              | Vaccination.V1_1_0.Profile.Patient
              | ZAEB.V1_1_0.Profile.Patient
              | MR.V1_0_0.Profile.PatientMother
              | CMR.V1_0_1.Profile.CMRPatient
          >
        | undefined;
    protected abstract getHeaderClass(): UI.MIOClassName;

    protected mapResource = (): ListItemType | undefined => {
        const { mio, entry, history, location, match, devMode } = this.props;

        if (mio && entry) {
            const props = {
                mio: mio,
                entry: entry.resource,
                history: history,
                location: location,
                match: match
            };

            const bundle = mio as T;

            const mappings = this.getMappings();

            let mappedResult: ListItemType | undefined = undefined;
            mappings.forEach((mapping) => {
                if (!mappedResult && mapping.profile.is(entry.resource)) {
                    const models: Models.Model[] = [];

                    if (mapping.models && mapping.models.length) {
                        mapping.models.forEach((model) =>
                            models.push(
                                new model(entry.resource, entry.fullUrl, bundle, history)
                            )
                        );
                    }

                    mappedResult = {
                        header: mapping.header ? mapping.header : "-",
                        testIdSuffix: mapping.profile.name,
                        component: (
                            <DetailComponent
                                {...props}
                                models={[...models]}
                                devMode={devMode}
                            />
                        )
                    };
                }
            });
            return mappedResult;
        }
    };

    protected getDetail():
        | { header: string; testIdSuffix?: string; component: JSX.Element }
        | undefined {
        const { mio, entry, history } = this.props;

        if (mio && entry) {
            const mapped = this.mapResource();
            if (mapped) {
                return mapped;
            } else {
                const profile: string = entry?.resource.meta
                    ? entry.resource.meta.profile[0]
                    : "";

                return {
                    header: "Sorry",
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
    }

    render(): JSX.Element {
        const { mio, entry, history, location, match, makePDF } = this.props;
        const detail = this.getDetail();

        if (mio && entry && detail) {
            const patient = this.getPatient();
            const showPatient = this.showPatient();
            let model = undefined;
            if (patient) {
                model = new Models.PatientSimpleModel(
                    patient.resource,
                    patient.fullUrl,
                    mio,
                    history
                );
            }

            return (
                <UI.BasicView
                    headline={detail.header}
                    headerClass={this.getHeaderClass()}
                    padding={false}
                    back={() => history.goBack()}
                    pdfDownload={() => makePDF(mio)}
                    isExample={Util.Misc.isExample(mio)}
                >
                    <div
                        className={"detail-container"}
                        data-testid={
                            "detail" +
                            (detail.testIdSuffix ? `-${detail.testIdSuffix}` : "")
                        }
                    >
                        {detail.component}

                        {showPatient && patient && model && (
                            <UI.DetailList.Model
                                mio={mio}
                                history={history}
                                location={location}
                                match={match}
                                model={model}
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
            return <UI.Error errors={errors} backClick={() => history.goBack()} />;
        }
    }
}
