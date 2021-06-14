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

export default class GestationalDiabetes extends Section<MR.V1_00_000.Profile.CompositionBesondereBefundeSection> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_00_000.Profile.CompositionBesondereBefunde,
            MR.V1_00_000.Profile.CompositionBesondereBefundeSection
        ]);
    }

    protected getDetails(): JSX.Element[] {
        return [];
    }

    protected compare(a: UI.ListItem.Props, b: UI.ListItem.Props): number {
        if (a.label === "Vortest" && b.label === "Diagnosetest") {
            return -1;
        } else if (a.label === "Diagnosetest" && b.label === "Vortest") {
            return 1;
        }

        return 0;
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const items: UI.ListItem.Props[] = [];

        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;

            const resTests = ParserUtil.getEntryWithRef<
                | MR.V1_00_000.Profile.ObservationoGTTPretest
                | MR.V1_00_000.Profile.ObservationoGTTDiagnosistest
            >(
                mio,
                [
                    MR.V1_00_000.Profile.ObservationoGTTPretest,
                    MR.V1_00_000.Profile.ObservationoGTTDiagnosistest
                ],
                ref
            );

            if (resTests) {
                const model = new Models.MP.Basic.ObservationModel(
                    resTests.resource,
                    resTests.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                items.push({
                    value: mainValue.value,
                    label: mainValue.label,
                    onClick: Util.Misc.toEntryByRef(history, mio, ref, true)
                });
            }
        });

        return [{ items: items.sort(this.compare) }];
    }
}
