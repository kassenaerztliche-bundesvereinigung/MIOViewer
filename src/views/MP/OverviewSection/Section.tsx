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

import React from "react";
import { RouteComponentProps } from "react-router";
import { MR, ParserUtil, AnyType } from "@kbv/mioparser";

import { UI } from "../../../components";

export enum Sections {
    Anamnese = "Anamnese",
    ErsteVorsorgeUntersuchung = "Erste Vorsorge-Untersuchung",
    Ultraschall = "Ultraschall",
    Epikrise = "Epikrise",
    KatalogB = "Katalog B",
    Gestationsdiabetes = "Gestationsdiabetes",
    Gravidogramm = "Gravidogramm",
    Cardiotokographie = "Cardiotokographie",
    Laboruntersuchungen = "Laboruntersuchungen und Rötelnschutz",
    AngabenZumKindGeburt = "Angaben zum Kind Geburt",
    AngabenZumKindWochenbett = "Angaben zum Kind Wochenbett",
    AngabenZumKindZeituntersuchung = "Angaben zum Kind Zweituntersuchung"
}

export type SectionProps = {
    mio: MR.V1_0_0.Profile.Bundle;
    composition: MR.V1_0_0.Profile.Composition;
    id: string;
    devMode: boolean;
} & RouteComponentProps;

export type SectionState = {
    details: JSX.Element[];
    listGroups: UI.DetailList.Props[];
};

export default abstract class Section<T> extends React.Component<
    SectionProps,
    SectionState
> {
    protected sectionName = "Section";
    protected section: T | undefined;

    componentDidMount(): void {
        this.setState({
            details: this.getDetails(),
            listGroups: this.getListGroups()
        });
    }

    protected abstract getDetails(): JSX.Element[];
    protected abstract getListGroups(): UI.DetailList.Props[];

    getSection(sectionStack: AnyType[]): T | undefined {
        let result = undefined;
        let section = this.props.composition;
        sectionStack.forEach(
            (s) => (section = ParserUtil.getSlice<any>(s, section.section)) // eslint-disable-line
        );
        if (section) result = section as unknown as T;

        return result;
    }

    render(): JSX.Element {
        const { details, listGroups } = this.state;
        const name = "overview-section-" + this.props.id;

        return (
            <div className={name} data-testid={name}>
                {details.map((detail) => detail)}
                {listGroups.map((listItem, index) => (
                    <UI.DetailList.Simple
                        type={"Mutterpass"}
                        headline={listItem.headline}
                        items={listItem.items}
                        key={index}
                    />
                ))}
            </div>
        );
    }
}
