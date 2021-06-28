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
import * as Models from "../../../../models";

import Section, { SectionProps } from "../Section";

export default class Gravidogram extends Section<MR.V1_0_0.Profile.CompositionUntersuchungenGravidogramm> {
    constructor(props: SectionProps) {
        super(props);
        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_0_0.Profile.CompositionUntersuchungen,
            MR.V1_0_0.Profile.CompositionUntersuchungenGravidogramm
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
            const res = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry>(
                mio,
                [MR.V1_0_0.Profile.ClinicalImpressionPregnancyChartEntry],
                ref
            );

            if (res) {
                const model = new Models.MP.Basic.ClinicalImpressionModel(
                    res.resource,
                    res.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                items.push({
                    value: mainValue.value,
                    label: mainValue.label,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref)
                });
            }
        });

        items.sort((a, b) => (a.value && b.value ? (a.value > b.value ? 1 : -1) : 0));
        const headline = items.length === 1 ? "Eintrag" : "Einträge";
        return [{ headline: headline, items }];
    }
}
