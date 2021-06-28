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

import { MR, ParserUtil, AnyType } from "@kbv/mioparser";

import { UI, Util } from "../../../../components";
import * as Models from "../../../../models";
import DetailComponent from "../../../../components/Detail/Detail";

import Section, { SectionProps, Sections } from "../Section";
import { History } from "history";
const PR = MR.V1_0_0.Profile;

type SectionType =
    | MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseGeburtSection
    | MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind
    | MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind;

export default class ChildInformation extends Section<SectionType> {
    protected patientId: string | undefined;

    constructor(props: SectionProps) {
        super(props);
        this.state = {
            details: [],
            listGroups: []
        };

        const sectionStack: AnyType[] = [
            MR.V1_0_0.Profile.CompositionUntersuchungen,
            MR.V1_0_0.Profile.CompositionUntersuchungenEpikrise
        ];

        if (this.props.id === Sections.AngabenZumKindGeburt) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseGeburt,
                PR.CompositionUntersuchungenEpikriseGeburtSection
            );
        } else if (this.props.id === Sections.AngabenZumKindWochenbett) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseWochenbett,
                PR.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind
            );
        } else if (this.props.id === Sections.AngabenZumKindZeituntersuchung) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung,
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind
            );
        }

        this.section = this.getSection(sectionStack);

        const params = this.props.match.params as { patient: string };
        if (params.patient) this.patientId = params.patient;
    }

    protected getDetails(): JSX.Element[] {
        const { mio, history, location, match, devMode } = this.props;

        const details: JSX.Element[] = [];
        this.section?.entry?.forEach((entry) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientChild>(
                mio,
                [PR.PatientChild],
                ref
            );

            if (res) {
                if (this.patientId === res.resource.id) {
                    const model = new Models.MP.Basic.PatientChildModel(
                        res.resource,
                        res.fullUrl,
                        mio,
                        history
                    );

                    const component = (
                        <DetailComponent
                            models={[model]}
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
            }
        });

        return details;
    }

    public static getListGroups(
        mio: MR.V1_0_0.Profile.Bundle,
        section?: SectionType,
        patientId?: string,
        history?: History
    ): Models.ModelValue[] {
        const items: Models.ModelValue[] = [];
        section?.entry?.forEach((entry: { reference: string }) => {
            const ref = entry.reference;
            const res = ParserUtil.getEntryWithRef<
                // Geburt
                | MR.V1_0_0.Profile.ObservationBirthMode
                | MR.V1_0_0.Profile.ObservationWeightChild
                | MR.V1_0_0.Profile.ObservationHeadCircumference
                | MR.V1_0_0.Profile.ObservationBirthHeight
                | MR.V1_0_0.Profile.ObservationApgarScore
                | MR.V1_0_0.Profile.ObservationpHValueUmbilicalArtery
                | MR.V1_0_0.Profile.ObservationMalformation
                | MR.V1_0_0.Profile.ObservationLiveBirth
                // Wochenbett
                | MR.V1_0_0.Profile.ObservationBloodGroupSerologyChild
                | MR.V1_0_0.Profile.ObservationDirectCoombstest
                // Zweite Untersuchung nach Entbindung
                | MR.V1_0_0.Profile.ObservationU3Performed
                | MR.V1_0_0.Profile.ObservationChildIsHealthy
                | MR.V1_0_0.Profile.ObservationNeedOfTreatmentU3
            >(
                mio,
                [
                    // Geburt
                    PR.ObservationBirthMode,
                    PR.ObservationWeightChild,
                    PR.ObservationHeadCircumference,
                    PR.ObservationBirthHeight,
                    PR.ObservationApgarScore,
                    PR.ObservationpHValueUmbilicalArtery,
                    PR.ObservationMalformation,
                    PR.ObservationLiveBirth,
                    // Wochenbett
                    PR.ObservationBloodGroupSerologyChild,
                    PR.ObservationDirectCoombstest,
                    // Zweite Untersuchung nach Entbindung
                    PR.ObservationU3Performed,
                    PR.ObservationChildIsHealthy,
                    PR.ObservationNeedOfTreatmentU3
                ],
                ref
            );

            if (res) {
                if (patientId) {
                    if (ChildInformation.checkPatient(mio, res.resource, patientId)) {
                        const model = new Models.MP.Basic.ObservationModel(
                            res.resource,
                            res.fullUrl,
                            mio,
                            history
                        );

                        const mainValue = model.getMainValue();
                        items.push({
                            value: mainValue.value,
                            label: mainValue.label,
                            onClick: Util.Misc.toEntryByRef(history, mio, ref)
                        });
                    }
                }
            }
        });

        if (
            MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseGeburtSection.is(section)
        ) {
            const apgarSection = ParserUtil.getSlice<MR.V1_0_0.Profile.CompositionUntersuchungenEpikriseGeburtSectionSection>(
                PR.CompositionUntersuchungenEpikriseGeburtSectionSection,
                section?.section
            );

            const apgarItems: Models.ModelValue[] = [];

            if (apgarSection) {
                apgarSection.entry?.forEach((entry) => {
                    const ref = entry.reference;
                    const res = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.ObservationApgarScore>(
                        mio,
                        [PR.ObservationApgarScore],
                        ref
                    );

                    if (res) {
                        if (patientId) {
                            if (
                                ChildInformation.checkPatient(
                                    mio,
                                    res.resource,
                                    patientId
                                )
                            ) {
                                const model = new Models.MP.Basic.ObservationModel(
                                    res.resource,
                                    res.fullUrl,
                                    mio,
                                    history
                                );

                                const mainValue = model.getMainValue();
                                apgarItems.push(mainValue);
                            }
                        }
                    }
                });

                items.push(...apgarItems);
            }
        }

        return items;
    }

    protected getListGroups(): UI.DetailList.Props[] {
        const { mio, history } = this.props;

        const items: UI.ListItem.Props[] = ChildInformation.getListGroups(
            mio,
            this.section,
            this.patientId,
            history
        );

        return [{ items }];
    }

    public static checkPatient(
        mio: MR.V1_0_0.Profile.Bundle,
        resource: { subject: { reference: string } },
        patientId: string
    ): boolean {
        const child = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientChild>(
            mio,
            [PR.PatientChild],
            resource.subject.reference
        );

        return child !== undefined && patientId === ParserUtil.getUuid(child.fullUrl);
    }
}
