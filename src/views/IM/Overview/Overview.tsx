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

import { ListVaccination, ListObservation, ListCondition } from "../Possibilities";
import PatientCard from "../../../components/PatientCard";

type OverviewGroup<T extends KBVResource> = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof Vaccination.V1_00_000.Profile.RecordPrime
        | typeof Vaccination.V1_00_000.Profile.RecordAddendum
        | typeof Vaccination.V1_00_000.Profile.ObservationImmunizationStatus
        | typeof Vaccination.V1_00_000.Profile.Condition
    )[];
    template: (values: UI.EntryGroupTemplateValues<T>) => JSX.Element | undefined;
    compare?: (a: MIOEntry<T>, b: MIOEntry<T>) => number;
};

type OverviewProps = {
    mio: Vaccination.V1_00_000.Profile.BundleEntry;
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
            const compareRecord = (
                a: MIOEntry<
                    | Vaccination.V1_00_000.Profile.RecordAddendum
                    | Vaccination.V1_00_000.Profile.RecordPrime
                >,
                b: MIOEntry<
                    | Vaccination.V1_00_000.Profile.RecordAddendum
                    | Vaccination.V1_00_000.Profile.RecordPrime
                >
            ) => {
                if (a.resource.occurrenceDateTime && b.resource.occurrenceDateTime) {
                    const dateA = new Date(a.resource.occurrenceDateTime).getTime();
                    const dateB = new Date(b.resource.occurrenceDateTime).getTime();
                    return dateB - dateA;
                } else {
                    return 0;
                }
            };

            const templateRecord = (
                values: UI.EntryGroupTemplateValues<
                    | Vaccination.V1_00_000.Profile.RecordAddendum
                    | Vaccination.V1_00_000.Profile.RecordPrime
                >
            ): JSX.Element | undefined => {
                const entry = values.entry;
                const codes: string[] = [];
                entry.resource.protocolApplied.forEach((p) => {
                    p.targetDisease.forEach((td) =>
                        td.coding.forEach((coding) => {
                            const code = ParserUtil.translateCode(
                                coding.code,
                                Vaccination.V1_00_000.ConceptMap.VaccineTargetdisease
                            );
                            codes.push(code.join(", "));
                        })
                    );
                });

                return (
                    <UI.ListItem
                        value={codes.join(", ")}
                        label={Util.Misc.formatDate(
                            values.entry.resource.occurrenceDateTime
                        )}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={`item_${values.index}`}
                    />
                );
            };

            const compareObservation = (
                a: MIOEntry<Vaccination.V1_00_000.Profile.ObservationImmunizationStatus>,
                b: MIOEntry<Vaccination.V1_00_000.Profile.ObservationImmunizationStatus>
            ) => {
                const dateA = new Date(a.resource.issued).getTime();
                const dateB = new Date(b.resource.issued).getTime();
                return dateB - dateA;
            };

            const templateObservation = (
                values: UI.EntryGroupTemplateValues<Vaccination.V1_00_000.Profile.ObservationImmunizationStatus>
            ): JSX.Element | undefined => {
                const entry = values.entry;

                return (
                    <UI.ListItem
                        value={entry.resource.code.text}
                        label={Util.Misc.formatDate(values.entry.resource.issued)}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={`item_${values.index}`}
                    />
                );
            };

            const compareCondition = (
                a: MIOEntry<Vaccination.V1_00_000.Profile.Condition>,
                b: MIOEntry<Vaccination.V1_00_000.Profile.Condition>
            ) => {
                const dateA = new Date(a.resource.recordedDate).getTime();
                const dateB = new Date(b.resource.recordedDate).getTime();
                return dateB - dateA;
            };

            const templateCondition = (
                values: UI.EntryGroupTemplateValues<Vaccination.V1_00_000.Profile.Condition>
            ): JSX.Element | undefined => {
                const entry = values.entry;

                return (
                    <UI.ListItem
                        value={entry.resource.code.text}
                        label={Util.Misc.formatDate(entry.resource.recordedDate)}
                        onClick={Util.Misc.toEntry(history, mio, entry)}
                        key={`item_${values.index}`}
                    />
                );
            };

            // eslint-disable-next-line
            const groups: OverviewGroup<any>[] = [
                {
                    headline: ListVaccination.headline,
                    subline: ListVaccination.subline,
                    baseValues: [
                        Vaccination.V1_00_000.Profile.RecordAddendum,
                        Vaccination.V1_00_000.Profile.RecordPrime
                    ],
                    template: templateRecord,
                    compare: compareRecord
                },
                {
                    headline: ListObservation.headline,
                    baseValues: [
                        Vaccination.V1_00_000.Profile.ObservationImmunizationStatus
                    ],
                    template: templateObservation,
                    compare: compareObservation
                },
                {
                    headline: ListCondition.headline,
                    baseValues: [Vaccination.V1_00_000.Profile.Condition],
                    template: templateCondition,
                    compare: compareCondition
                }
            ];

            this.setState({
                entries: mio.entry.map((entry) => entry as MIOEntry<VaccinationResource>),
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
