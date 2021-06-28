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

export default class Anamnesis extends Section<MR.V1_0_0.Profile.CompositionAnamneseUndAllgemeineBefunde> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_0_0.Profile.CompositionAnamneseUndAllgemeineBefunde
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected sortAnamnesis(a: UI.ListItem.Props, b: UI.ListItem.Props): number {
        const sortingArr = ["Alter", "Körpergewicht", "Körpergröße", "Gravida", "Para"];
        return sortingArr.indexOf(a.label) - sortingArr.indexOf(b.label);
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const itemsAnamnesis: UI.ListItem.Props[] = [];
        const itemsPreviousPregnancy: UI.ListItem.Props[] = [];

        this.section?.entry.forEach((entry) => {
            const ref = entry.reference;
            const resAnamnesis = ParserUtil.getEntryWithRef<
                | MR.V1_0_0.Profile.ObservationAge
                | MR.V1_0_0.Profile.ObservationBaselineWeightMother
                | MR.V1_0_0.Profile.ObservationHeight
                | MR.V1_0_0.Profile.ObservationGravida
                | MR.V1_0_0.Profile.ObservationPara
            >(
                mio,
                [
                    MR.V1_0_0.Profile.ObservationAge,
                    MR.V1_0_0.Profile.ObservationBaselineWeightMother,
                    MR.V1_0_0.Profile.ObservationHeight,
                    MR.V1_0_0.Profile.ObservationGravida,
                    MR.V1_0_0.Profile.ObservationPara
                ],
                ref
            );

            if (resAnamnesis) {
                const model = new Models.MP.Basic.ObservationModel(
                    resAnamnesis.resource,
                    resAnamnesis.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                itemsAnamnesis.push({
                    value: mainValue.value,
                    label: mainValue.label,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                });
            }

            const resPreviousPregnancy = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ObservationPreviousPregnancy>(
                mio,
                [MR.V1_0_0.Profile.ObservationPreviousPregnancy],
                ref
            );

            if (resPreviousPregnancy) {
                const model = new Models.MP.Basic.ObservationModel(
                    resPreviousPregnancy.resource,
                    resPreviousPregnancy.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                itemsPreviousPregnancy.push({
                    label: mainValue.value,
                    noValue: true,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                });
            }
        });

        return [
            {
                headline: "Allgemeine Angaben",
                items: itemsAnamnesis.sort(this.sortAnamnesis)
            },
            {
                headline: "Angaben zu vorangegangenen Schwangerschaften",
                items: itemsPreviousPregnancy
            }
        ];
    }
}
