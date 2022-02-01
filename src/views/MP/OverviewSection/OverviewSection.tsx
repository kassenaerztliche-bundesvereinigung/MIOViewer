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
import { RouteComponentProps } from "react-router";
import { MR, ParserUtil } from "@kbv/mioparser";

import {
    MIOConnector,
    MIOConnectorType,
    SettingsConnector,
    SettingsConnectorType
} from "../../../store";

import { UI, Util } from "../../../components";

import { Sections } from "./Section";
import * as SectionComponents from "./Sections";

type OverviewSectionProps = {
    section: string;
};

class OverviewSection extends React.Component<
    MIOConnectorType & OverviewSectionProps & RouteComponentProps & SettingsConnectorType
> {
    render(): JSX.Element {
        const { section, mio, history, location, match, makePDF, devMode } = this.props;

        const composition = ParserUtil.getEntry<MR.V1_1_0.Profile.Composition>(
            mio as MR.V1_1_0.Profile.Bundle,
            [MR.V1_1_0.Profile.Composition]
        );

        const sectionMap = [
            {
                sectionId: Sections.Anamnese,
                headline: "Anamnese und allgemeine Befunde",
                component: SectionComponents.Anamnesis
            },
            {
                sectionId: Sections.ErsteVorsorgeUntersuchung,
                headline: "Erste Vorsorge-Untersuchung",
                component: SectionComponents.InitialExamination
            },
            {
                sectionId: Sections.Ultraschall,
                headline: "Ultraschall",
                component: SectionComponents.Ultrasound
            },
            {
                sectionId: Sections.Epikrise,
                headline: "Epikrise",
                component: SectionComponents.Epicrisis
            },
            {
                sectionId: Sections.ErsteUntersuchungNachEntbindung,
                headline: "Wochenbett",
                component: SectionComponents.FirstExaminationAfterChildbirth
            },
            {
                sectionId: Sections.KatalogB,
                headline: "Besondere Befunde",
                component: SectionComponents.SpecialFindings
            },
            {
                sectionId: Sections.Gestationsdiabetes,
                headline: "Gestationsdiabetes",
                component: SectionComponents.GestationalDiabetes
            },
            {
                sectionId: Sections.Gravidogramm,
                headline: "Gravidogramm",
                component: SectionComponents.Gravidogram
            },
            {
                sectionId: Sections.Cardiotokografie,
                headline: "Cardiotokografie",
                component: SectionComponents.Cardiotocography
            },
            {
                sectionId: Sections.Laboruntersuchungen,
                headline: "Laboruntersuchungen",
                component: SectionComponents.LaboratoryExamination
            },
            {
                sectionId: Sections.AngabenZumKindGeburt,
                headline: "Angaben zum Kind",
                component: SectionComponents.ChildInformation
            },
            {
                sectionId: Sections.AngabenZumKindWochenbett,
                headline: "Angaben zum Kind",
                component: SectionComponents.ChildInformation
            },
            {
                sectionId: Sections.AngabenZumKindZeituntersuchung,
                headline: "Angaben zum Kind",
                component: SectionComponents.ChildInformation
            }
        ];

        const result = sectionMap.filter((m) => m.sectionId === section);
        if (composition && result.length === 1) {
            const Component = result[0].component;
            const headline = result[0].headline ?? "-";
            const id = result[0].sectionId ?? "-";

            return (
                <UI.BasicView
                    headline={headline}
                    headerClass={"mutterpass"}
                    padding={false}
                    back={() => history.goBack()}
                    pdfDownload={() => makePDF(mio)}
                    isExample={Util.Misc.isExample(mio)}
                >
                    <Component
                        mio={mio as MR.V1_1_0.Profile.Bundle}
                        composition={composition}
                        history={history}
                        location={location}
                        match={match}
                        id={id}
                        devMode={devMode}
                    />
                </UI.BasicView>
            );
        } else {
            const errors = ["Für dieses MIO gibt es noch keine Section Ansicht"];
            return <UI.Error errors={errors} backClick={() => history.goBack()} />;
        }
    }
}
export default SettingsConnector(MIOConnector(OverviewSection));
