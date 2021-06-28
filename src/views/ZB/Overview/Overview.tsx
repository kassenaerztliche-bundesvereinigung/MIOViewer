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
import Compare from "../Compare";

type OverviewGroup = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
        | typeof ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
    )[];
    template: (
        values: UI.EntryGroupTemplateValues<
            | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
            | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        >
    ) => JSX.Element | undefined;
    compare?: (
        a: MIOEntry<
            | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
            | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        >,
        b: MIOEntry<
            | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
            | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        >
    ) => number;
};

type OverviewProps = {
    mio: ZAEB.V1_1_0.Profile.Bundle;
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

    componentDidMount(): void {
        const { mio, history } = this.props;

        const templateObservation = (
            values: UI.EntryGroupTemplateValues<
                | ZAEB.V1_1_0.Profile.ObservationDentalCheckUp
                | ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
            >
        ): JSX.Element | undefined => {
            if (ZAEB.V1_1_0.Profile.ObservationDentalCheckUp.is(values.entry.resource)) {
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
                ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation.is(
                    values.entry.resource
                )
            ) {
                const composition = ParserUtil.getEntry<ZAEB.V1_1_0.Profile.Composition>(
                    mio,
                    [ZAEB.V1_1_0.Profile.Composition]
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

        const profiles = [
            ZAEB.V1_1_0.Profile.ObservationDentalCheckUp,
            ZAEB.V1_1_0.Profile.ObservationGaplessDocumentation
        ];

        const groups: OverviewGroup[] = [
            {
                headline: "Bonusheft Einträge",
                baseValues: profiles,
                template: templateObservation,
                compare: Compare.Observation
            }
        ];

        if (mio) {
            this.setState({
                entries: Util.ZB.getEntries(mio),
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
