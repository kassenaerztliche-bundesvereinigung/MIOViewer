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

const PR = MR.V1_00_000.Profile;

export default class LaboratoryExamination extends Section<MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz> {
    public readonly sectionName = "Laboruntersuchungen und Rötelnschutz";

    constructor(props: SectionProps) {
        super(props);
        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            PR.CompositionUntersuchungen,
            PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutz
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const bloodGroupItems: UI.ListItem.Props[] = [];
        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<
                | MR.V1_00_000.Profile.ObservationBloodGroupSerology
                | MR.V1_00_000.Profile.ObservationOtherBloodGroupSystems
            >(
                mio,
                [
                    MR.V1_00_000.Profile.ObservationBloodGroupSerology,
                    MR.V1_00_000.Profile.ObservationOtherBloodGroupSystems
                ],
                ref
            )?.resource;

            if (res) {
                let mainValue;
                if (MR.V1_00_000.Profile.ObservationBloodGroupSerology.is(res)) {
                    const model = new Models.MP.ObservationBloodGroupSerologyModel(
                        res,
                        mio,
                        history
                    );
                    mainValue = model.getMainValue();
                } else {
                    const model = new Models.MP.Basic.ObservationModel(res, mio, history);
                    mainValue = model.getMainValue();
                }

                bloodGroupItems.push({
                    value: mainValue.value,
                    label: mainValue.label,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                });
            }
        });

        const examinationItems: UI.ListItem.Props[] = [];
        const slices = ParserUtil.getSlices<
            | MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung
            | MR.V1_00_000.Profile.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
        >(
            [
                PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchung,
                PR.CompositionUntersuchungenLaboruntersuchungenUndRoetelnschutzLaboruntersuchungMaskiert
            ],
            this.section?.section
        );

        slices.forEach((section) => {
            section.entry.forEach((entry) => {
                const ref = entry.reference;
                const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationExamination>(
                    mio,
                    [MR.V1_00_000.Profile.ObservationExamination],
                    ref
                )?.resource;

                if (res) {
                    const model = new Models.MP.Basic.ObservationModel(
                        res,
                        mio,
                        history,
                        [MR.V1_00_000.ConceptMap.ExaminationResultQualitativeGerman],
                        [
                            MR.V1_00_000.ConceptMap.ExaminationInterpretationGerman,
                            MR.V1_00_000.ConceptMap.ExaminationSnomedGerman,
                            MR.V1_00_000.ConceptMap.ExaminationLoincGerman
                        ]
                    );
                    const mainValue = model.getMainValue();
                    const interpretation = model.getInterpretation();
                    examinationItems.push({
                        value: interpretation ? interpretation.value : mainValue.value,
                        label: mainValue.label,
                        onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                    });
                }
            });
        });

        const vaccinationItems: UI.ListItem.Props[] = [];
        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationImmunizationStatus>(
                mio,
                [MR.V1_00_000.Profile.ObservationImmunizationStatus],
                ref
            )?.resource;

            if (res) {
                const model = new Models.MP.Basic.ObservationModel(
                    res,
                    mio,
                    history,
                    [],
                    [MR.V1_00_000.ConceptMap.ImmunizationStatusGerman]
                );
                const mainValue = model.getMainValue();
                vaccinationItems.push({
                    value: mainValue.value,
                    label: mainValue.label,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                });
            }
        });

        return [
            {
                headline: "Blutgruppenzugehörigkeit",
                items: bloodGroupItems
            },
            {
                headline: "Laboruntersuchungen",
                items: examinationItems
            },
            {
                headline: "Impfrelevante Angaben",
                items: vaccinationItems
            }
        ];
    }
}
