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

import { History } from "history";

import { MR, ParserUtil, AnyType, MIOEntry, Reference } from "@kbv/mioparser";
import { UI, Util } from "../../components";
import { InformationAboutModel } from "./";

const PR = MR.V1_1_0.Profile;

export default class InformationAboutChildModelBirth extends InformationAboutModel {
    constructor(
        value: MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationDeliveryInformation,
        fullUrl: string,
        parent: MR.V1_1_0.Profile.Bundle,
        history?: History
    ) {
        // eslint-disable-next-line
        const sectionStack: AnyType[] = [
            PR.CompositionUntersuchungen,
            PR.CompositionUntersuchungenEpikrise,
            PR.CompositionUntersuchungenEpikriseGeburt,
            PR.CompositionUntersuchungenEpikriseGeburtSection
        ];

        super(value, fullUrl, parent, history, [], sectionStack);
        this.headline = "Angaben zum Kind";
    }

    public getChildInformation(): MIOEntry<MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationChildInformation>[] {
        const informationAbout = this.section?.entry?.map((entry) => entry.reference);
        const resources: any[] = []; // eslint-disable-line

        informationAbout?.forEach((ref) => {
            const result =
                ParserUtil.getEntryWithRef<MR.V1_1_0.Profile.ClinicalImpressionBirthExaminationChildInformation>(
                    this.parent,
                    [
                        MR.V1_1_0.Profile
                            .ClinicalImpressionBirthExaminationChildInformation
                    ],
                    new Reference(ref, this.fullUrl)
                );

            if (result) resources.push(result);
        });

        return resources;
    }

    mapValues(): void {
        if (this.section) {
            this.getChildInformation().forEach((i) => {
                const bundle = this.parent as MR.V1_1_0.Profile.Bundle;
                const subject = i.resource.subject.reference;
                const reference = new Reference(subject, this.composition?.fullUrl);
                const child = Util.MP.getPatientChild(bundle, reference);

                if (child) {
                    this.values.push({
                        value: "-",
                        label: Util.MP.getPatientName(child.resource),
                        onClick: this.createOnClick(i.fullUrl),
                        renderAs: UI.ListItem.NoValue
                    });
                }
            });

            this.headline = this.section.title;
        }
    }

    public createOnClick(resourceRef: string): () => void {
        const mioRef = ParserUtil.getUuidFromBundle(this.parent);
        return () => {
            this.history?.push(`/subEntry/${mioRef}/${resourceRef}`);
        };
    }
}
