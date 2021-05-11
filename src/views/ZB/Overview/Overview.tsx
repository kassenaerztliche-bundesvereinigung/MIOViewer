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
import { History } from "history";

import { ZAEB, ZAEBResource, MIOEntry, ParserUtil } from "@kbv/mioparser";

import { UI, Util } from "../../../components/";
import PatientCard from "../../../components/PatientCard";

type OverviewGroup = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof ZAEB.V1_00_000.Profile.Observation
        | typeof ZAEB.V1_00_000.Profile.GaplessDocumentation
    )[];
    template: (
        values: UI.EntryGroupTemplateValues<
            | ZAEB.V1_00_000.Profile.Observation
            | ZAEB.V1_00_000.Profile.GaplessDocumentation
        >
    ) => JSX.Element | undefined;
    compare?: (
        a: MIOEntry<
            | ZAEB.V1_00_000.Profile.Observation
            | ZAEB.V1_00_000.Profile.GaplessDocumentation
        >,
        b: MIOEntry<
            | ZAEB.V1_00_000.Profile.Observation
            | ZAEB.V1_00_000.Profile.GaplessDocumentation
        >
    ) => number;
};

type OverviewProps = {
    mio: ZAEB.V1_00_000.Profile.Bundle;
    history: History;
};

type OverviewState = {
    entries: MIOEntry<ZAEBResource>[];
    groups: OverviewGroup[];
};

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            entries: [],
            groups: []
        };
    }

    compareObservation(
        a: MIOEntry<
            | ZAEB.V1_00_000.Profile.Observation
            | ZAEB.V1_00_000.Profile.GaplessDocumentation
        >,
        b: MIOEntry<
            | ZAEB.V1_00_000.Profile.Observation
            | ZAEB.V1_00_000.Profile.GaplessDocumentation
        >
    ): number {
        if (
            ZAEB.V1_00_000.Profile.Observation.is(a.resource) &&
            ZAEB.V1_00_000.Profile.Observation.is(b.resource)
        ) {
            if (a.resource.effectiveDateTime && b.resource.effectiveDateTime) {
                const dateA = new Date(a.resource.effectiveDateTime).getTime();
                const dateB = new Date(b.resource.effectiveDateTime).getTime();
                return dateB - dateA;
            } else {
                return 0;
            }
        } else if (
            ZAEB.V1_00_000.Profile.GaplessDocumentation.is(a.resource) &&
            ZAEB.V1_00_000.Profile.GaplessDocumentation.is(b.resource)
        ) {
            if (a.resource.valueDateTime && b.resource.valueDateTime) {
                const dateA = new Date(a.resource.valueDateTime).getTime();
                const dateB = new Date(b.resource.valueDateTime).getTime();
                return dateB - dateA;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    componentDidMount(): void {
        const { mio, history } = this.props;

        const templateObservation = (
            values: UI.EntryGroupTemplateValues<
                | ZAEB.V1_00_000.Profile.Observation
                | ZAEB.V1_00_000.Profile.GaplessDocumentation
            >
        ): JSX.Element | undefined => {
            if (ZAEB.V1_00_000.Profile.Observation.is(values.entry.resource)) {
                return (
                    <UI.ListItem.Basic
                        value={Util.Misc.formatDate(
                            values.entry.resource.effectiveDateTime
                        )}
                        label={Util.ZB.getObservationDisplay(values.entry.resource)}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={"item_" + values.index}
                    />
                );
            } else if (
                ZAEB.V1_00_000.Profile.GaplessDocumentation.is(values.entry.resource)
            ) {
                const composition = ParserUtil.getEntry<ZAEB.V1_00_000.Profile.Composition>(
                    mio,
                    [ZAEB.V1_00_000.Profile.Composition]
                );

                const from = Util.Misc.formatDate(values.entry.resource.valueDateTime);
                const to = Util.Misc.formatDate(composition?.resource.date);

                return (
                    <UI.ListItem.Basic
                        value={`${from} - ${to}`}
                        label={"Lückenlose Dokumentation"}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={"item_" + values.index}
                    />
                );
            }
        };

        const groups: OverviewGroup[] = [
            {
                headline: "Bonusheft Einträge",
                baseValues: [
                    ZAEB.V1_00_000.Profile.Observation,
                    ZAEB.V1_00_000.Profile.GaplessDocumentation
                ],
                template: templateObservation,
                compare: this.compareObservation
            }
        ];

        if (mio) {
            this.setState({
                entries: mio.entry.map((entry) => entry as MIOEntry<ZAEBResource>),
                groups: groups
            });
        }
    }

    render(): JSX.Element {
        const { mio, history } = this.props;

        const patient = Util.ZB.getPatient(mio);

        return (
            <div className={"zb-overview"} data-testid={"zb-overview"}>
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
                        type={"Zahnärztlichen Bonusheft"}
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
