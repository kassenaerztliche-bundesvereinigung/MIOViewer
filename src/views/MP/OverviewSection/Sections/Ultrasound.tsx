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

export default class Ultrasound extends Section<MR.V1_00_000.Profile.CompositionUntersuchungenUltraschall> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_00_000.Profile.CompositionUntersuchungen,
            MR.V1_00_000.Profile.CompositionUntersuchungenUltraschall
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const items: UI.ListItemProps[] = [];

        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationUltrasound>(
                mio,
                [MR.V1_00_000.Profile.ObservationUltrasound],
                ref
            )?.resource;

            if (res) {
                items.push({
                    value: "Bemerkungen",
                    label: Util.Misc.formatDate(res.effectiveDateTime),
                    onClick: Util.Misc.toEntryByRef(history, mio, ref)
                });
            }
        });

        const slices = ParserUtil.getSlices<
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallI
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallII
            | MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallIII
        >(
            [
                MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallI,
                MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallII,
                MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallUltraschallIII
            ],
            this.section?.section
        );

        slices.forEach((section) => {
            let toEntry = undefined;
            let label = "-";
            section.entry.forEach((entry) => {
                const ref = entry.reference;
                const res = ParserUtil.getEntryWithRef<
                    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundI
                    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundII
                    | MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII
                >(
                    mio,
                    [
                        MR.V1_00_000.Profile.DiagnosticReportUltrasoundI,
                        MR.V1_00_000.Profile.DiagnosticReportUltrasoundII,
                        MR.V1_00_000.Profile.DiagnosticReportUltrasoundIII
                    ],
                    ref
                )?.resource;

                if (res) {
                    label = Util.Misc.formatDate(res.effectiveDateTime);
                    toEntry = Util.Misc.toEntryByRef(history, mio, ref);
                }
            });

            items.push({
                value: section.title,
                label: label,
                onClick: toEntry
            });
        });

        items.sort((a, b) => (a.value && b.value ? (a.value > b.value ? 1 : -1) : 0));

        const others: UI.ListItemProps[] = [];

        const otherSlices = ParserUtil.getSlices<MR.V1_00_000.Profile.CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen>(
            [
                MR.V1_00_000.Profile
                    .CompositionUntersuchungenUltraschallWeitereUltraschallUntersuchungen
            ],
            this.section?.section
        );

        otherSlices.forEach((section) => {
            let toEntry = undefined;
            let label = "-";
            section.entry.forEach((entry) => {
                const ref = entry.reference;
                const res = ParserUtil.getEntryWithRef<MR.V1_00_000.Profile.ObservationOtherUltrasoundStudies>(
                    mio,
                    [MR.V1_00_000.Profile.ObservationOtherUltrasoundStudies],
                    ref
                )?.resource;

                if (res) {
                    label = Util.Misc.formatDate(res.effectiveDateTime);
                    toEntry = Util.Misc.toEntryByRef(history, mio, ref);
                }
            });

            others.push({
                label: label,
                onClick: toEntry
            });
        });
        others.sort((a, b) => (a.value && b.value ? (a.value > b.value ? 1 : -1) : 0));

        const headline = items.length === 1 ? "Eintrag" : "Einträge";
        return [
            {
                headline,
                items: items
            },
            {
                headline: "Weitere Ultraschalluntersuchungen",
                items: others
            }
        ];
    }
}
