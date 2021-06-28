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

import { History } from "history";

import { MR, ParserUtil, AnyType } from "@kbv/mioparser";
import { UI, Util } from "../../components";
import { InformationAboutModel } from "./";

const PR = MR.V1_0_0.Profile;

export default class InformationAboutChildModel extends InformationAboutModel {
    constructor(
        value:
            | MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
            | MR.V1_0_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirth
            | MR.V1_0_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth,
        fullUrl: string,
        parent: MR.V1_0_0.Profile.Bundle,
        history?: History
    ) {
        // eslint-disable-next-line
        const sectionStack: AnyType[] = [
            MR.V1_0_0.Profile.CompositionUntersuchungen,
            MR.V1_0_0.Profile.CompositionUntersuchungenEpikrise
        ];

        if (PR.ClinicalImpressionBirthExaminationDeliveryInformation.is(value)) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseGeburt,
                PR.CompositionUntersuchungenEpikriseGeburtSection
            );
        } else if (PR.ClinicalImpressionFirstExaminationAfterChildbirth.is(value)) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseWochenbett,
                PR.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind
            );
        } else if (PR.ClinicalImpressionSecondExaminationAfterChildbirth.is(value)) {
            sectionStack.push(
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindung,
                PR.CompositionUntersuchungenEpikriseZweiteUntersuchungNachEntbindungAngabenZumKind
            );
        }

        super(value, fullUrl, parent, history, [], sectionStack);
        this.headline = "Angaben zum Kind";
    }

    public getChildren(): string[] {
        const informationAbout = this.section?.entry?.map((entry) => entry.reference);
        const resources: any[] = []; // eslint-disable-line
        informationAbout?.forEach((ref) => {
            const result = ParserUtil.getEntryWithRef<
                // Geburt
                | MR.V1_0_0.Profile.ObservationBirthMode
                | MR.V1_0_0.Profile.ObservationWeightChild
                | MR.V1_0_0.Profile.ObservationHeadCircumference
                | MR.V1_0_0.Profile.ObservationBirthHeight
                | MR.V1_0_0.Profile.ObservationApgarScore
                | MR.V1_0_0.Profile.ObservationpHValueUmbilicalArtery
                | MR.V1_0_0.Profile.ObservationMalformation
                // Wochenbett
                | MR.V1_0_0.Profile.ObservationBloodGroupSerologyChild
                | MR.V1_0_0.Profile.ObservationDirectCoombstest
                // Zweite Untersuchung nach Entbindung
                | MR.V1_0_0.Profile.ObservationU3Performed
                | MR.V1_0_0.Profile.ObservationChildIsHealthy
                | MR.V1_0_0.Profile.ObservationNeedOfTreatmentU3
            >(
                this.parent,
                [
                    // Geburt
                    MR.V1_0_0.Profile.ObservationLiveBirth,
                    MR.V1_0_0.Profile.ObservationBirthMode,
                    MR.V1_0_0.Profile.ObservationWeightChild,
                    MR.V1_0_0.Profile.ObservationHeadCircumference,
                    MR.V1_0_0.Profile.ObservationBirthHeight,
                    MR.V1_0_0.Profile.ObservationApgarScore,
                    MR.V1_0_0.Profile.ObservationpHValueUmbilicalArtery,
                    MR.V1_0_0.Profile.ObservationMalformation,
                    // Wochenbett
                    MR.V1_0_0.Profile.ObservationBloodGroupSerologyChild,
                    MR.V1_0_0.Profile.ObservationDirectCoombstest,
                    // Zweite Untersuchung nach Entbindung
                    MR.V1_0_0.Profile.ObservationU3Performed,
                    MR.V1_0_0.Profile.ObservationChildIsHealthy,
                    MR.V1_0_0.Profile.ObservationNeedOfTreatmentU3
                ],
                ref
            );

            const resource = result?.resource;
            if (resource) resources.push(resource);
        });

        const children: Set<string> = new Set<string>();
        resources.forEach((resource) => {
            const ref = resource.subject.reference;
            const result = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientChild>(
                this.parent,
                [MR.V1_0_0.Profile.PatientChild],
                ref
            );

            if (result) {
                children.add(ParserUtil.getUuid(result.fullUrl));
            }
        });

        return Array.from(children);
    }

    mapValues(): void {
        if (this.section) {
            const children: { id: string; name: string }[] = [];
            this.getChildren().forEach((ref: string) => {
                const bundle = this.parent as MR.V1_0_0.Profile.Bundle;
                const child = ParserUtil.getEntryWithRef<MR.V1_0_0.Profile.PatientChild>(
                    bundle,
                    [MR.V1_0_0.Profile.PatientChild],
                    ref
                );
                if (child) {
                    children.push({
                        id: ref,
                        name: Util.MP.getPatientName(child.resource)
                    });
                }
            });

            let section = "Angaben zum Kind";
            if (
                MR.V1_0_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation.is(
                    this.value
                )
            ) {
                section += " Geburt";
            } else if (
                MR.V1_0_0.Profile.ClinicalImpressionFirstExaminationAfterChildbirth.is(
                    this.value
                )
            ) {
                section += " Wochenbett";
            } else if (
                MR.V1_0_0.Profile.ClinicalImpressionSecondExaminationAfterChildbirth.is(
                    this.value
                )
            ) {
                section += " Zweituntersuchung";
            }

            children.forEach((child) => {
                this.values.push({
                    value: "-",
                    label: child.name,
                    onClick: this.createOnClick(section, child.id),
                    renderAs: UI.ListItem.NoValue
                });
            });

            this.headline = this.section.title;
        }
    }

    public createOnClick(resourceRef: string, patientRef: string): () => void {
        const mioRef = ParserUtil.getUuidFromBundle(this.parent);
        return () => {
            this.history?.push(`/section/${mioRef}/${resourceRef}/${patientRef}`);
        };
    }
}
