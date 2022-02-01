/*
 * Copyright (c) 2020 - 2022. Kassenärztliche Bundesvereinigung, KBV
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

import { MR, ParserUtil, Reference } from "@kbv/mioparser";

import { UI, Util } from "../../../../components";
import * as Models from "../../../../models";

import Section, { SectionProps } from "../Section";

export default class SpecialFindings extends Section<MR.V1_1_0.Profile.CompositionBesondereBefunde> {
    constructor(props: SectionProps) {
        super(props);
        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([MR.V1_1_0.Profile.CompositionBesondereBefunde]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history, composition } = this.props;

        const items: UI.ListItem.Props[] = [];
        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res =
                ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ObservationSpecialFindings>(
                    mio,
                    [MR.V1_1_0.Profile.ObservationSpecialFindings],
                    new Reference(ref, composition.fullUrl)
                );

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(
                    res.resource,
                    res.fullUrl,
                    mio,
                    history,
                    [MR.V1_1_0.ConceptMap.SpecialFindingsGerman]
                );
                const mainValue = model.getMainValue();
                items.push({
                    value: mainValue.value,
                    label: Util.Misc.formatDate(res.resource.effectiveDateTime),
                    onClick: Util.Misc.toEntryByRef(
                        history,
                        mio,
                        new Reference(ref, res.fullUrl),
                        true
                    )
                });
            }
        });

        return [{ headline: "Katalog B", items }];
    }
}
