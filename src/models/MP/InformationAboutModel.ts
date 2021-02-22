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

import { ParserUtil, MIOEntry, MR } from "@kbv/mioparser";

import MPBaseModel from "./MPBaseModel";
import { DetailMapping } from "../../views/Comprehensive/Detail/DetailBase";
import * as Models from "../index";
import { ModelValue } from "../index";

export default class InformationAboutModel extends MPBaseModel<
    | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
    | MR.V1_00_000.Profile.ClinicalImpressionFirstExaminationAfterChildbirth
    | MR.V1_00_000.Profile.ClinicalImpressionSecondExaminationAfterChildbirth
> {
    protected composition: MIOEntry<MR.V1_00_000.Profile.Composition> | undefined;
    protected section:
        | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSection
        | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind
        | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZurMutter
        | undefined;

    constructor(
        value:
            | MR.V1_00_000.Profile.ClinicalImpressionBirthExaminationDeliveryInformation
            | MR.V1_00_000.Profile.ClinicalImpressionFirstExaminationAfterChildbirth
            | MR.V1_00_000.Profile.ClinicalImpressionSecondExaminationAfterChildbirth,
        parent: MR.V1_00_000.Profile.Bundle,
        history?: History,
        protected mappings: DetailMapping[] = [],
        protected sectionStack: any[] = []
    ) {
        super(value, parent, history);

        this.composition = ParserUtil.getEntry(this.parent, [
            MR.V1_00_000.Profile.Composition
        ]);

        this.section = this.getSection(sectionStack);
        this.mapValues();
    }

    protected getSection<
        T extends
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseGeburtSection
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZumKind
            | MR.V1_00_000.Profile.CompositionUntersuchungenEpikriseWochenbettAngabenZurMutter
    >(sectionStack: any[]): T | undefined {
        let result = undefined;
        let section = this.composition?.resource;
        sectionStack.forEach(
            (s) => (section = ParserUtil.getSlice<any>(s, section?.section))
        );
        if (section) result = (section as unknown) as T;

        return result;
    }

    protected mapValues(): void {
        if (this.section) {
            const informationAbout = this.section.entry?.map((entry) => entry.reference);

            informationAbout?.forEach((ref) => {
                const mappings = this.mappings;

                const result = ParserUtil.getEntryWithRef(
                    this.parent,
                    mappings.map((m) => m.profile),
                    ref
                );

                const resource = result?.resource;
                if (resource) this.resolveMapping(resource);
            });

            this.headline = this.section.title;
        }
    }

    protected resolveMapping(resource: unknown): void {
        const mappings = this.mappings;
        const bundle = this.parent as MR.V1_00_000.Profile.Bundle;

        let model: any = undefined;
        if (resource) {
            mappings.forEach((mapping) => {
                if (!model && mapping.profile.is(resource)) {
                    if (mapping.models && mapping.models.length) {
                        model = new mapping.models[0](
                            resource as any,
                            bundle,
                            this.history
                        );
                    } else {
                        model = new Models.MP.Basic.ObservationModel(
                            resource as any,
                            bundle,
                            this.history,
                            mapping.valueConceptMaps,
                            mapping.codeConceptMaps,
                            mapping.customLabel
                        );
                    }
                }
            });
        }

        if (model) this.values.push(model.getMainValue());
    }

    getCoding(): string {
        return "";
    }

    getMainValue(): ModelValue | undefined {
        return undefined;
    }
}
