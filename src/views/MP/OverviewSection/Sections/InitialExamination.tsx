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

import React from "react";
import { MR, ParserUtil, Reference } from "@kbv/mioparser";

import DetailComponent from "../../../../components/Detail/Detail";
import * as Models from "../../../../models";

import Section, { SectionProps } from "../Section";
import { UI } from "../../../../components";

export default class InitialExamination extends Section<MR.V1_1_0.Profile.CompositionAnamneseUndAllgemeineBefunde> {
    constructor(props: SectionProps) {
        super(props);

        this.state = {
            details: [],
            listGroups: []
        };

        this.section = this.getSection([
            MR.V1_1_0.Profile.CompositionAnamneseUndAllgemeineBefunde
        ]);
    }

    protected getDetails(): JSX.Element[] {
        const { mio, history, location, match, devMode, composition } = this.props;

        const details: JSX.Element[] = [];
        this.section?.entry.forEach((entry) => {
            const ref = entry.reference;
            const res =
                ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ClinicalImpressionInitialExamination>(
                    mio,
                    [MR.V1_1_0.Profile.ClinicalImpressionInitialExamination],
                    new Reference(ref, composition.fullUrl)
                );

            if (res) {
                const model = new Models.MP.Basic.ClinicalImpressionModel(
                    res.resource,
                    res.fullUrl,
                    mio,
                    history,
                    undefined
                );

                const finding = new Models.MP.Basic.ClinicalImpressionFindingModel(
                    res.resource,
                    res.fullUrl,
                    mio,
                    history,
                    undefined
                );

                const investigationModel =
                    new Models.MP.Basic.ClinicalImpressionInvestigationModel(
                        res.resource,
                        res.fullUrl,
                        mio,
                        history
                    );

                const component = (
                    <DetailComponent
                        models={[model, finding, investigationModel]}
                        mio={mio}
                        entry={res.resource}
                        location={location}
                        history={history}
                        match={match}
                        key={details.length}
                        devMode={devMode}
                    />
                );

                details.push(component);
            }
        });

        return details;
    }

    protected getListGroups(): UI.DetailList.Props[] {
        return [];
    }
}
