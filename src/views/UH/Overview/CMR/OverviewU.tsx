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

import { ParserUtil, CMR, Reference } from "@kbv/mioparser";

import { UI, Util } from "../../../../components/";
import Mappings from "../../Mappings";
import { ModelValue } from "../../../../models";
import * as Models from "../../../../models";

type SubSectionExtension = { url: string; valueString?: string }[];

type Section = {
    title: string;
    extension?: SubSectionExtension;
    section?: Section[];
};

type OverviewProps = {
    mio: CMR.V1_0_1.Profile.CMRBundle;
} & RouteComponentProps;

type CompositionType =
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
    minorHints?: ModelValue[];
    values: ModelValue[];
};

export default class OverviewU extends React.Component<OverviewProps> {
    protected composition?: CompositionType;
    protected groups: OverviewGroup[] = [];
    protected hints: ModelValue[] = [];

    constructor(props: OverviewProps) {
        super(props);

        const { mio, history } = this.props;

        const composition = Util.UH.getUComposition(mio);

        if (composition) {
            this.composition = composition.resource;

            this.composition?.section?.forEach(
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

                    const values: ModelValue[] = [];
                    const s = section as Section;

                    if (s.entry && s.entry.length) {
                        s.entry.forEach((ref: { reference: string }) => {
                            for (const mapping of Mappings.All) {
                                const entry = ParserUtil.getEntryWithRef<
                                    typeof mapping.profile
                                >(
                                    mio,
                                    [mapping.profile],
                                    new Reference(ref.reference, composition.fullUrl)
                                );

                                if (entry) {
                                    const model = Mappings.modelFromMapping(
                                        entry,
                                        mio,
                                        mapping,
                                        history
                                    );

                                    values.push(model.getMainValue());
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

                            let value = "not found";
                            let label = "-";
                            let onClick = undefined;
                            let renderAs = undefined;

                            if (entries.length) {
                                entries.forEach((ref) => {
                                    for (const mapping of Mappings.All) {
                                        const entry = ParserUtil.getEntryWithRef<
                                            typeof mapping.profile
                                        >(
                                            mio,
                                            [mapping.profile],
                                            new Reference(ref, composition.fullUrl)
                                        );

                                        if (entry) {
                                            const model = Mappings.modelFromMapping(
                                                entry,
                                                mio,
                                                mapping,
                                                history
                                            );

                                            const mv = model.getMainValue();
                                            value = mv.value;
                                            label = subSection.title;
                                            if (
                                                CMR.V1_0_1.Profile.CMRObservationU4U9StatusOfImmunization.is(
                                                    entry.resource
                                                )
                                            ) {
                                                label = mv.label;
                                            }

                                            onClick = mv.onClick;
                                            renderAs = mv.renderAs;
                                            break;
                                        }
                                    }
                                });
                            }

                            if (value !== "not found") {
                                values.push({ value, label, onClick, renderAs });
                            }
                        });
                    }

                    const minorHints: ModelValue[] = OverviewU.mapExtension(
                        section,
                        values.length > 0
                    );

                    this.groups.push({ headline, values, minorHints });
                }
            );

            const hintsModel = new Models.UH.Basic.CompositionHintsModel(
                composition.resource,
                composition.fullUrl,
                mio
            );

            this.hints.push(...hintsModel.getValues());
        }
    }

    static mapExtension(section: Section, hasContent: boolean): ModelValue[] {
        const minorHints: ModelValue[] = [];
        const hintLabel = section.title ?? "Hinweis";
        const subSection = section.section;

        if (subSection && subSection.length) {
            subSection.forEach((s) => {
                if (s.title && s.extension) {
                    minorHints.push({
                        value: " " + s.extension.map((ext) => ext.valueString).join(" "),
                        label: s.title,
                        renderAs: UI.ListItem.HintBox
                    });
                }
            });

            if (minorHints.length) return minorHints;
        }

        section.extension?.forEach((ext: { url: string; valueString?: string }) => {
            const minorHintsLength = minorHints.length;
            const extensionMap = [
                {
                    originalText: "Nur ankreuzen, wenn die Items NICHT erfüllt werden!",
                    targetText: "Nur NICHT erfüllte Items werden angezeigt!"
                },
                {
                    originalText: "Zutreffendes bitte ankreuzen!",
                    targetText: "Zutreffendes wird angezeigt!"
                },
                {
                    originalText: "Nur Auffälligkeiten ankreuzen!",
                    targetText: "Nur Auffälligkeiten werden angezeigt!"
                },
                {
                    originalText: "Bei erweitertem Beratungsbedarf bitte ankreuzen!",
                    targetText: "Erweiterter Beratungsbedarf wird angezeigt!"
                },
                {
                    includeText: "Beobachtung der Interaktion: ",
                    targetText: ext.valueString?.replace(
                        "Beobachtung der Interaktion: ",
                        ""
                    ),
                    label: "Beobachtung der Interaktion:",
                    renderAs: UI.ListItem.HintBox
                },
                {
                    includeText: "Beobachtung der Interaktion ",
                    targetText: ext.valueString?.replace(
                        "Beobachtung der Interaktion ",
                        ""
                    ),
                    label: "Beobachtung der Interaktion:",
                    renderAs: UI.ListItem.HintBox
                },
                {
                    includeText: "Beratung vor allem zu folgenden Themen:",
                    renderAs: UI.ListItem.Text
                },
                {
                    includeText:
                        "(u.a. behandlungsbedürftige Hyperbilirubinämie bei einem vorausgegangenen Kind)",
                    renderAs: UI.ListItem.Text
                }
            ];

            const extensionMapItem = extensionMap.find(
                (e) =>
                    e.originalText === ext.valueString ||
                    ext.valueString?.includes(e.includeText ?? "unknown")
            );

            if (hasContent && extensionMapItem) {
                minorHints.push({
                    value: extensionMapItem.targetText ?? extensionMapItem.includeText,
                    label: extensionMapItem.label ?? hintLabel,
                    renderAs: extensionMapItem.renderAs
                });
            }

            // last statement, if no others were found
            if (
                hasContent &&
                ext.valueString &&
                minorHintsLength === minorHints.length &&
                ext.valueString !==
                    "Schwangerschafts- und Geburtsanamnese: Erhebung und Dokumentation in der U1 prüfen und ggf. nachtragen."
            ) {
                minorHints.push({
                    value: ext.valueString,
                    label: hintLabel
                });
            }
        });

        return minorHints;
    }

    render(): JSX.Element {
        return (
            <>
                {this.groups.map((group, index) => (
                    <UI.DetailList.Collapsible
                        type={"U-Heft"}
                        headline={group.headline}
                        subline={group.subline}
                        minorHints={group.minorHints}
                        items={group.values}
                        key={`group_${index}`}
                        expanded={false}
                        expandable={true}
                    />
                ))}

                <div className={"detail-list ion-padding-bottom"}>
                    {this.hints.map((hint, index) => {
                        return (
                            <UI.ListItem.Collapsible
                                label={hint.label}
                                value={hint.value}
                                key={index}
                            />
                        );
                    })}
                </div>
                <div className={"ion-padding-bottom"} />
            </>
        );
    }
}
