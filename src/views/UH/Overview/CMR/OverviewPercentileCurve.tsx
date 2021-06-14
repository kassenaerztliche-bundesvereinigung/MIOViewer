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

import { CMR, MIOEntry, ParserUtil } from "@kbv/mioparser";

import { UI, Util } from "../../../../components/";

import * as Models from "../../../../models";
import { ModelValue } from "../../../../models";

import Mappings from "../../Mappings";

type OverviewProps = {
    mio: CMR.V1_00_000.Profile.CMRBundle;
} & RouteComponentProps;

type CompositionType = CMR.V1_00_000.Profile.CMRCompositionPercentileCurve;

export default class OverviewPercentileCurve extends React.Component<OverviewProps> {
    protected composition?: MIOEntry<CompositionType>;
    protected model?: Models.UH.Basic.SpecialCompositionModel;
    protected title?: string;
    protected entries: ModelValue[] = [];

    constructor(props: OverviewProps) {
        super(props);

        const { mio, history } = this.props;

        this.composition = Util.UH.getPercentileComposition(mio);

        if (this.composition) {
            this.model = new Models.UH.Basic.SpecialCompositionModel(
                this.composition.resource,
                this.composition.fullUrl,
                mio,
                history
            );
        }

        const entries = this.getEntries();
        if (entries.length) {
            entries.forEach((ref) => {
                for (const mapping of Mappings.All) {
                    const entry = ParserUtil.getEntryWithRef<typeof mapping.profile>(
                        mio,
                        [mapping.profile],
                        ref
                    );

                    if (entry) {
                        const model = Mappings.modelFromMapping(
                            entry,
                            mio,
                            mapping,
                            history
                        );
                        const mainValue = model.getMainValue();
                        if (mainValue) this.entries.push(mainValue);
                        break;
                    }
                }
            });

            this.entries.sort((a, b) =>
                a.sortBy && b.sortBy ? (a.sortBy < b.sortBy ? 1 : -1) : 0
            );
        }
    }

    protected getEntries(): string[] {
        const entries: string[] = [];
        this.composition?.resource.section.forEach(
            (s: { title: string; entry: { reference: string }[] }) => {
                this.title = s.title;
                s.entry.forEach((e) => entries.push(e.reference));
            }
        );

        return entries;
    }

    render(): JSX.Element {
        const { mio, history, location, match } = this.props;

        return (
            <>
                {this.model && (
                    <UI.DetailList.Model
                        mio={mio}
                        model={this.model}
                        history={history}
                        location={location}
                        match={match}
                    />
                )}

                {this.title && (
                    <UI.DetailList.Simple
                        headline={this.title}
                        type={"U-Heft"}
                        items={this.entries}
                    />
                )}
            </>
        );
    }
}
