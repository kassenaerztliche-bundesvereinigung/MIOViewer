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

import { KBVBundleResource, ParserUtil, Vaccination, ZAEB, MR } from "@kbv/mioparser";
import { UI, Util } from "../../../components/";

import * as Models from "../../../models/";

import DetailComponent from "../../../components/Detail/Detail";

type DetailProps = MIOConnectorType & RouteComponentProps;

type ListItemType = { header: string; testIdSuffix?: string; component: JSX.Element };

export type DetailMapping = {
    profile: any;
    header?: string;
    models: any[];
    customLabel?: string;
    codeConceptMaps?: ParserUtil.ConceptMap[];
    valueConceptMaps?: ParserUtil.ConceptMap[];
    noValue?: boolean;
    noHeadline?: boolean;
    customHeadline?: string;
};

export default abstract class DetailBase<
    T extends KBVBundleResource
> extends React.Component<DetailProps, Record<string, unknown>> {
    protected abstract getMappings(): DetailMapping[];
    protected abstract showPatient(): boolean;
    protected abstract getPatient():
        | Vaccination.V1_00_000.Profile.Patient
        | ZAEB.V1_00_000.Profile.Patient
        | MR.V1_00_000.Profile.PatientMother
        | undefined;
    protected abstract getHeaderClass(): UI.MIOClassName;

    protected mapResource = (): ListItemType | undefined => {
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

            const bundle = mio as T;

            const mappings = this.getMappings();

            let mappedResult: ListItemType | undefined = undefined;
            mappings.forEach((mapping) => {
                if (!mappedResult && mapping.profile.is(resource)) {
                    const models: any[] = [];

                    if (mapping.models && mapping.models.length) {
                        mapping.models.forEach((model) =>
                            models.push(new model(resource, bundle, history))
                        );
                    }

                    mappedResult = {
                        header: mapping.header ? mapping.header : "-",
                        testIdSuffix: mapping.profile.name,
                        component: <DetailComponent {...props} models={[...models]} />
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
                const profile: string = entry.resource.meta.profile[0];
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
            if (patient) model = new Models.PatientSimpleModel(patient, mio, history);

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
                                entry={patient}
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
