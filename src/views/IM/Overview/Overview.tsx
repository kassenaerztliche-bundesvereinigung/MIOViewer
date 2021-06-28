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
import { History } from "history";

import {
    Vaccination,
    ParserUtil,
    VaccinationResource,
    MIOEntry,
    KBVResource
} from "@kbv/mioparser";

import { UI, Util } from "../../../components/";
import * as Models from "../../../models";

import PatientCard from "../../../components/PatientCard";
import Compare from "../Compare";

type OverviewGroup<T extends KBVResource> = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof Vaccination.V1_1_0.Profile.RecordPrime
        | typeof Vaccination.V1_1_0.Profile.RecordAddendum
        | typeof Vaccination.V1_1_0.Profile.ObservationImmunizationStatus
        | typeof Vaccination.V1_1_0.Profile.Condition
    )[];
    template: (values: UI.EntryGroupTemplateValues<T>) => JSX.Element | undefined;
    compare?: (a: MIOEntry<T>, b: MIOEntry<T>) => number;
};

type OverviewProps = {
    mio: Vaccination.V1_1_0.Profile.BundleEntry;
    history: History;
};

type OverviewState = {
    entries: MIOEntry<VaccinationResource>[];
    groups: OverviewGroup<KBVResource>[];
};

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps & RouteComponentProps) {
        super(props);
        this.state = {
            entries: [],
            groups: []
        };
    }

    componentDidMount(): void {
        const { mio, history } = this.props;

        if (mio) {
            const templateRecord = (
                values: UI.EntryGroupTemplateValues<
                    | Vaccination.V1_1_0.Profile.RecordAddendum
                    | Vaccination.V1_1_0.Profile.RecordPrime
                >
            ): JSX.Element | undefined => {
                const entry = values.entry;
                const codes: string[] = [];
                entry.resource.protocolApplied.forEach((p) => {
                    p.targetDisease.forEach((td) =>
                        td.coding.forEach((coding) => {
                            const code = ParserUtil.translateCode(
                                coding.code,
                                Vaccination.V1_1_0.ConceptMap.VaccineTargetdisease
                            );
                            codes.push(code.join(", "));
                        })
                    );
                });

                return (
                    <UI.ListItem.Basic
                        value={codes.join(", ")}
                        label={Util.Misc.formatDate(
                            values.entry.resource.occurrenceDateTime
                        )}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={`item_${values.index}`}
                    />
                );
            };

            const templateObservation = (
                values: UI.EntryGroupTemplateValues<Vaccination.V1_1_0.Profile.ObservationImmunizationStatus>
            ): JSX.Element | undefined => {
                const model = new Models.IM.ObservationModel(
                    values.entry.resource,
                    values.entry.fullUrl,
                    this.props.mio,
                    this.props.history
                );

                const mv = model.getMainValue();

                return (
                    <UI.ListItem.Basic
                        value={mv.value}
                        label={mv.label}
                        onClick={mv.onClick}
                        key={`item_${values.index}`}
                    />
                );
            };

            const templateCondition = (
                values: UI.EntryGroupTemplateValues<Vaccination.V1_1_0.Profile.Condition>
            ): JSX.Element | undefined => {
                const model = new Models.IM.ConditionModel(
                    values.entry.resource,
                    values.entry.fullUrl,
                    this.props.mio,
                    this.props.history
                );

                const mv = model.getMainValue();

                return (
                    <UI.ListItem.Basic
                        value={mv.value}
                        label={mv.label}
                        onClick={mv.onClick}
                        key={`item_${values.index}`}
                    />
                );
            };

            // eslint-disable-next-line
            const groups: OverviewGroup<any>[] = [
                {
                    headline: "Impfungen",
                    subline:
                        "Inklusive passive Immunisierungen mit humanen (oder heterologen) Immunglobulinen",
                    baseValues: [
                        Vaccination.V1_1_0.Profile.RecordAddendum,
                        Vaccination.V1_1_0.Profile.RecordPrime
                    ],
                    template: templateRecord,
                    compare: Compare.Record
                },
                {
                    headline: "Immunreaktion (Tests)",
                    baseValues: [
                        Vaccination.V1_1_0.Profile.ObservationImmunizationStatus
                    ],
                    template: templateObservation,
                    compare: Compare.Observation
                },
                {
                    headline: "Erkrankungen, die zu einer Immunisierung geführt haben",
                    baseValues: [Vaccination.V1_1_0.Profile.Condition],
                    template: templateCondition,
                    compare: Compare.Condition
                }
            ];

            this.setState({
                entries: Util.IM.getEntries(mio),
                groups: groups
            });
        }
    }

    render(): JSX.Element {
        const { mio, history } = this.props;

        if (!mio) {
            return (
                <UI.Error
                    errors={["MIO nicht gefunden"]}
                    backClick={() => history.goBack()}
                />
            );
        }

        const patient = Util.IM.getPatient(mio);

        return (
            <div className={"im-overview"} data-testid={"im-overview"}>
                {patient && (
                    <div
                        className={"ion-padding"}
                        onClick={Util.Misc.toEntry(history, mio, patient)}
                    >
                        <PatientCard patient={patient.resource} />
                    </div>
                )}

                {this.state.groups.map((group, index) => (
                    <UI.EntryGroup
                        type={"Impfpass"}
                        headline={group.headline}
                        subline={group.subline}
                        entries={this.state.entries}
                        baseValues={group.baseValues}
                        template={group.template}
                        compare={group.compare}
                        key={`group_${index}`}
                    />
                ))}
            </div>
        );
    }
}
