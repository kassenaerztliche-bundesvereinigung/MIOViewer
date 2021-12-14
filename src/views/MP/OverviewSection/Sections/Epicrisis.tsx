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

export default class Epicrisis extends Section<MR.V1_0_0.Profile.CompositionUntersuchungenEpikrise> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_0_0.Profile.CompositionUntersuchungen,
            MR.V1_0_0.Profile.CompositionUntersuchungenEpikrise
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const pregnancyItems: UI.ListItem.Props[] = [];

        const slices =
            ParserUtil.getSlices<MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseSchwangerschaft>(
                [MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseSchwangerschaft],
                this.section?.section
            );

        slices.forEach((section) => {
            let toEntry = undefined;
            section.entry.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ClinicalImpressionPregnancyExaminationDischargeSummary>(
                        mio,
                        [
                            MR.V1_0_0.Profile
                                .ClinicalImpressionPregnancyExaminationDischargeSummary
                        ],
                        ref
                    )?.resource;

                if (res) toEntry = Util.Misc.toEntryByRef(history, mio, ref);
            });

            pregnancyItems.push({
                label: section.title,
                onClick: toEntry
            });
        });

        const birthItems: UI.ListItem.Props[] = [];

        const slicesBirth =
            ParserUtil.getSlices<MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseGeburt>(
                [MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseGeburt],
                this.section?.section
            );

        slicesBirth.forEach((section) => {
            let toEntry = undefined;
            section.entry?.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation>(
                        mio,
                        [
                            MR.V1_0_0.Profile
                                .ClinicalImpressionBirthExaminationDeliveryInformation
                        ],
                        ref
                    )?.resource;

                if (res) toEntry = Util.Misc.toEntryByRef(history, mio, ref);
            });

            birthItems.push({
                label: section.title,
                onClick: toEntry
            });
        });

        const firstExaminationItems: UI.ListItem.Props[] = [];

        const slicesFirstExamination =
            ParserUtil.getSlices<MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseWochenbett>(
                [MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseWochenbett],
                this.section?.section
            );

        slicesFirstExamination.forEach((section) => {
            let toEntry = undefined;
            section.entry?.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirth>(
                        mio,
                        [
                            MR.V1_0_0.Profile
                                .ClinicalImpressionFirstExaminationAfterChildbirth
                        ],
                        ref
                    )?.resource;

                if (res) toEntry = Util.Misc.toEntryByRef(history, mio, ref);
            });

            firstExaminationItems.push({
                label: section.title,
                onClick: toEntry
            });
        });

        const secondExaminationItems: UI.ListItem.Props[] = [];

        const slicesSecondExamination =
            ParserUtil.getSlices<MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung>(
                [
                    MR.V1_0_0.Profile
                        .CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung
                ],
                this.section?.section
            );

        slicesSecondExamination.forEach((section) => {
            let toEntry = undefined;
            section.entry?.forEach((entry) => {
                const ref = entry.reference;
                const res =
                    ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth>(
                        mio,
                        [
                            MR.V1_0_0.Profile
                                .ClinicalImpressionSecondExaminationAfterChildbirth
                        ],
                        ref
                    )?.resource;

                if (res) toEntry = Util.Misc.toEntryByRef(history, mio, ref);
            });

            secondExaminationItems.push({
                label: section.title,
                onClick: toEntry
            });
        });

        const allItems = [];

        allItems.push(...pregnancyItems);
        allItems.push(...birthItems);
        allItems.push(...firstExaminationItems);
        allItems.push(...secondExaminationItems);

        return [
            {
                headline: "Einträge",
                items: allItems
            }
        ];
    }
}
