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

import Section, { SectionProps } from "../Section";

export default class FirstExaminationAfterChildbirth extends Section<MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_1_0.Profile.CompositionUntersuchungen,
            MR.V1_1_0.Profile.CompositionUntersuchungenEpikrise
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history, composition } = this.props;

        const firstExaminationItems: UI.ListItem.Props[] = [];

        const slicesFirstExamination =
            ParserUtil.getSlices<MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseWochenbett>(
                [MR.V1_1_0.Profile.CompositionUntersuchungenEpikriseWochenbett],
                this.section?.section
            );

        slicesFirstExamination.forEach((section) => {
            let toEntry: (() => void) | undefined = undefined;
            section.section?.forEach((s) => {
                s.entry?.forEach((entry) => {
                    const ref = entry.reference;
                    const res = ParserUtil.getEntryWithRef<
                        | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthMother
                        | MR.V1_1_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirthChild
                    >(
                        mio,
                        [
                            MR.V1_1_0.Profile
                                .ClinicalImpressionFirstExaminationAfterChildbirthMother,
                            MR.V1_1_0.Profile
                                .ClinicalImpressionFirstExaminationAfterChildbirthChild
                        ],
                        new Reference(ref, composition.fullUrl)
                    )?.resource;

                    if (res) {
                        const subjectRef = res.subject.reference;
                        console.log(subjectRef);

                        const subject = ParserUtil.getEntryWithRef<
                            | MR.V1_1_0.Profile.PatientMother
                            | MR.V1_1_0.Profile.PatientChild
                        >(
                            mio,
                            [
                                MR.V1_1_0.Profile.PatientMother,
                                MR.V1_1_0.Profile.PatientChild
                            ],
                            new Reference(subjectRef, composition.fullUrl)
                        )?.resource;

                        toEntry = Util.Misc.toEntryByRef(
                            history,
                            mio,
                            new Reference(ref, composition.fullUrl)
                        );

                        firstExaminationItems.push({
                            value: subject ? Util.MP.getPatientName(subject) : "-",
                            label: s.title,
                            onClick: toEntry
                        });
                    }
                });
            });
        });

        const allItems = [];

        allItems.push(...firstExaminationItems);

        return [
            {
                headline: "Erste Untersuchung nach Entbindung",
                items: allItems
            }
        ];
    }
}
