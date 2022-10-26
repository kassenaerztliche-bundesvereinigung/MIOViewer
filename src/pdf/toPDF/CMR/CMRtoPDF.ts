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

import { Content } from "pdfmake/interfaces";

import { ParserUtil, MIOEntry, CMR, Reference } from "@kbv/mioparser";

import { horizontalLine } from "../../PDFHelper";

import { Util, UI } from "../../../components";
import * as Models from "../../../models";
import Mappings from "../../../views/UH/Mappings";

import OverviewU from "../../../views/UH/Overview/CMR/OverviewU";
import Base from "./CMRtoPDFBase";

type SpecialCompositionType =
    | CMR.V1_0_1.Profile.CMRCompositionCysticFibrosisScreening
    | CMR.V1_0_1.Profile.CMRCompositionExtendedNewbornScreening
    | CMR.V1_0_1.Profile.CMRCompositionHipScreening
    | CMR.V1_0_1.Profile.CMRCompositionNeonatalHearscreening
    | CMR.V1_0_1.Profile.CMRCompositionPulseOxymetryScreening
    | CMR.V1_0_1.Profile.CMRCompositionPercentileCurve;

type UCompositionType =
    | CMR.V1_0_1.Profile.CMRCompositionU1
    | CMR.V1_0_1.Profile.CMRCompositionU2
    | CMR.V1_0_1.Profile.CMRCompositionU3
    | CMR.V1_0_1.Profile.CMRCompositionU4
    | CMR.V1_0_1.Profile.CMRCompositionU5
    | CMR.V1_0_1.Profile.CMRCompositionU6
    | CMR.V1_0_1.Profile.CMRCompositionU7
    | CMR.V1_0_1.Profile.CMRCompositionU7a
    | CMR.V1_0_1.Profile.CMRCompositionU8
    | CMR.V1_0_1.Profile.CMRCompositionU9;

type OverviewGroup = {
    headline?: string;
    subline?: string;
    minorHints?: Models.ModelValue[];
    models: Models.Model[];
};

export default class CMRtoPDF extends Base<
    UCompositionType,
    CMR.V1_0_1.Profile.CMRBundle
> {
    protected compositionSpecial?: MIOEntry<SpecialCompositionType>;
    protected compositionPercentile?: MIOEntry<SpecialCompositionType>;
    protected groups: OverviewGroup[] = [];
    protected sectionTitle = "";

    constructor(value: CMR.V1_0_1.Profile.CMRBundle) {
        super(value);

        this.compositionSpecial = Util.UH.getSpecialComposition(value);
        this.compositionPercentile = Util.UH.getPercentileComposition(value);
        this.composition = Util.UH.getUComposition(value);
    }

    public getContent(): Content {
        const content: Content[] = [];
        const models: Models.Model[] = [];

        const entries = this.getEntriesSpecial();
        if (entries.length) {
            entries.forEach((ref) => {
                for (const mapping of Mappings.All) {
                    const entry = ParserUtil.getEntryWithRef<typeof mapping.profile>(
                        this.value,
                        [mapping.profile],
                        ref
                    );

                    if (entry) {
                        const model = Mappings.modelFromMapping(
                            entry,
                            this.value,
                            mapping
                        );
                        models.push(model);
                        break;
                    }
                }
            });

            models.sort((a, b) => {
                const sA = a.getMainValue().sortBy;
                const sB = b.getMainValue().sortBy;
                return sA && sB ? (sA < sB ? 1 : -1) : 0;
            });
        }

        models.forEach((model) => content.push(model.toPDFContent(), horizontalLine));

        const contentU = this.getContentU();
        if (contentU) {
            content.push(contentU);
        }

        content.push(this.getHints(this.composition));

        return [
            this.getHeading(),
            this.sectionWithContent(this.sectionTitle, content, "h2")
        ];
    }
    public getContentU(): Content {
        const content: Content[] = [];

        if (this.composition) {
            const composition = Util.UH.getUComposition(this.value);

            composition?.resource?.section?.forEach(
                (section: {
                    title: string;
                    extension?: { url: string; valueString?: string }[];
                }) => {
                    const headline: string = section.title;

                    type Section = {
                        title: string;
                        entry?: { reference: string }[];
                        resource?: { id: string };
                        section: Section[];
                    };

                    const models: Models.Model[] = [];
                    const s = section as Section;

                    if (s.entry && s.entry.length) {
                        s.entry.forEach((ref: { reference: string }) => {
                            for (const mapping of Mappings.All) {
                                const entry = ParserUtil.getEntryWithRef<
                                    typeof mapping.profile
                                >(
                                    this.value,
                                    [mapping.profile],
                                    new Reference(ref.reference, composition?.fullUrl)
                                );

                                if (entry) {
                                    const model = Mappings.modelFromMapping(
                                        entry,
                                        this.value,
                                        mapping
                                    );

                                    models.push(model);
                                    break;
                                }
                            }
                        });
                    }

                    if (s.section && s.section.length) {
                        s.section.forEach((subSection: Section) => {
                            const entries: string[] = subSection.entry
                                ? subSection.entry.map(
                                      (entry: { reference: string }) => entry.reference
                                  )
                                : [];

                            let model = undefined;

                            if (entries.length) {
                                entries.forEach((ref) => {
                                    for (const mapping of Mappings.All) {
                                        const entry = ParserUtil.getEntryWithRef<
                                            typeof mapping.profile
                                        >(
                                            this.value,
                                            [mapping.profile],
                                            new Reference(ref, composition?.fullUrl)
                                        );

                                        if (entry) {
                                            model = Mappings.modelFromMapping(
                                                entry,
                                                this.value,
                                                mapping
                                            );
                                            break;
                                        }
                                    }
                                });
                            }

                            if (model) {
                                models.push(model);
                            }
                        });
                    }

                    const minorHints = OverviewU.mapExtension(section, models.length > 0);

                    this.groups.push({ headline, models: models, minorHints });
                }
            );
        }

        this.groups.forEach((group) => {
            const headline = group.headline ?? "-";
            const contentModels = group.models.map((model) => [
                model.toPDFContent(),
                horizontalLine
            ]);

            if (!contentModels.length) {
                contentModels.push([this.pdfContentHint(headline, this.singular)]);
            }

            content.push(
                this.sectionWithContent(headline, [
                    group.minorHints
                        ? group.minorHints.map((h) => {
                              if (h.renderAs === UI.ListItem.HintBox) {
                                  return this.hintBox(h);
                              } else {
                                  return this.hint(h);
                              }
                          })
                        : [],
                    ...contentModels
                ])
            );
        });

        return content;
    }

    protected getEntriesSpecial(): Reference[] {
        const entries: Reference[] = [];
        (this.compositionSpecial || this.compositionPercentile)?.resource.section.forEach(
            (s: { title: string; entry: { reference: string }[] }) => {
                this.sectionTitle = s.title;
                s.entry.forEach((e) =>
                    entries.push(
                        new Reference(
                            e.reference,
                            (
                                this.compositionSpecial || this.compositionPercentile
                            )?.fullUrl
                        )
                    )
                );
            }
        );

        return entries;
    }

    public getHeading(): Content {
        const composition =
            this.compositionPercentile || this.compositionSpecial || this.composition;
        const refs = composition?.resource.author.map((a) => a.reference) ?? [];
        const date =
            this.composition?.resource.date ||
            this.compositionSpecial?.resource.date ||
            this.compositionPercentile?.resource.date;

        const authorContent: Content = [];
        if (refs.length) {
            refs.forEach((ref) => {
                const author = ParserUtil.getEntryWithRef<
                    | CMR.V1_0_1.Profile.CMRPractitioner
                    | CMR.V1_0_1.Profile.CMROrganization
                >(
                    this.value,
                    [
                        CMR.V1_0_1.Profile.CMRPractitioner,
                        CMR.V1_0_1.Profile.CMROrganization
                    ],
                    new Reference(ref, composition?.fullUrl)
                );

                if (author && author.resource) {
                    let authorModel;
                    let additionalComment = undefined;

                    if (CMR.V1_0_1.Profile.CMROrganization.is(author.resource)) {
                        authorModel = new Models.UH.Basic.OrganizationModel(
                            author.resource,
                            author.fullUrl,
                            this.value
                        );
                    } else {
                        authorModel = new Models.UH.Basic.PractitionerModel(
                            author.resource,
                            author.fullUrl,
                            this.value
                        );

                        additionalComment = new Models.AdditionalCommentModel(
                            author.resource,
                            author.fullUrl,
                            this.value
                        );
                    }
                    const address = new Models.AddressModel(
                        author.resource,
                        author.fullUrl,
                        this.value
                    );
                    const telecom = new Models.TelecomModel(
                        author.resource,
                        author.fullUrl,
                        this.value
                    );

                    authorContent.push([
                        [horizontalLine],
                        authorModel.toPDFContent(["subTable"]),
                        address.toPDFContent(["subTable"]),
                        telecom.toPDFContent(["subTable"])
                    ]);

                    if (additionalComment) {
                        authorContent.push(additionalComment.toPDFContent(["subTable"]));
                    }
                }
            });
        }

        const patientResource = Util.UH.getPatient(this.value);

        let patientContent = undefined;
        if (patientResource) {
            const model = new Models.UH.Basic.PatientModel(
                patientResource.resource,
                patientResource.fullUrl,
                this.value
            );

            patientContent = [model.toPDFContent()];
        }

        const encounter = Util.UH.getCompositionEncounter(this.value)?.resource;

        return [
            this.headingContent(this.getHeadline(), date, authorContent, patientContent, {
                text: encounter ? Util.Misc.formatDate(encounter.period.start) : "-"
            })
        ];
    }

    protected getHeadline(): string {
        if (this.composition) {
            return Util.UH.getType(this.composition.resource, true);
        } else if (this.compositionSpecial) {
            return this.compositionSpecial.resource.title;
        } else if (this.compositionPercentile) {
            return this.compositionPercentile.resource.title;
        } else if (CMR.V1_0_1.Profile.PCBundle.is(this.value)) {
            return "Teilnahmekarte";
        } else if (CMR.V1_0_1.Profile.PNBundle.is(this.value)) {
            return "Elternnotiz";
        } else {
            return "-";
        }
    }
}
