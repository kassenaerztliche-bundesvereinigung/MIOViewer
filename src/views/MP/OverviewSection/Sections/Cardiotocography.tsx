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

import { MR, ParserUtil } from "@kbv/mioparser";

import { UI, Util } from "../../../../components";

import Section, { SectionProps } from "../Section";

export default class Cardiotocography extends Section<MR.V1_0_0.Profile.CompositionUntersuchungenCardiotokographie> {
    constructor(props: SectionProps) {
        super(props);
        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_0_0.Profile.CompositionUntersuchungen,
            MR.V1_0_0.Profile.CompositionUntersuchungenCardiotokographie
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const items: UI.ListItem.Props[] = [];
        this.section?.entry.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ObservationCardiotocography>(
                mio,
                [MR.V1_0_0.Profile.ObservationCardiotocography],
                ref
            )?.resource;

            if (res) {
                items.push({
                    label: Util.Misc.formatDate(res.effectiveDateTime),
                    onClick: Util.Misc.toEntryByRef(history, mio, ref)
                });
            }
        });

        items.sort((a, b) => (a.label > b.label ? -1 : 1));
        const headline = items.length === 1 ? "Eintrag" : "Einträge";
        return [{ headline, items }];
    }
}
