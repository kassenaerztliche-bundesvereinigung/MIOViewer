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
import { History } from "history";

import { ParserUtil, MRResource, MIOEntry, MR, AnyType } from "@kbv/mioparser";

import { UI, Util } from "../../../components/";
import PatientCard from "../../../components/PatientCard";
import Compare from "../Compare";
import * as Models from "../../../models";

type OverviewGroup = {
    headline: string;
    subline?: string;
    baseValues: AnyType[];
    template: (values: UI.EntryGroupTemplateValues<any>) => JSX.Element | undefined; // eslint-disable-line
    compare?: (a: MIOEntry<any>, b: MIOEntry<any>) => number; // eslint-disable-line
    expandable?: boolean;
};

type OverviewProps = {
    mio: MR.V1_00_000.Profile.Bundle;
    history: History;
};

type OverviewState = {
    entries: MIOEntry<MRResource>[];
    groups: OverviewGroup[];
};

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            entries: [],
            groups: []
        };
    }

    componentDidMount(): void {
        const { mio, history } = this.props;

        const templateStampInformation = (
            values: UI.EntryGroupTemplateValues<
                MR.V1_00_000.Profile.Organization | MR.V1_00_000.Profile.Practitioner
            >
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;
            const onClick = Util.Misc.toEntry(history, mio, values.entry);
            const key = `item_${values.index}`;

            if (MR.V1_00_000.Profile.Organization.is(resource)) {
                return (
                    <UI.ListItem.Basic
                        value={resource.name}
                        label={"Einrichtung"}
                        onClick={onClick}
                        key={key}
                    />
                );
            } else if (MR.V1_00_000.Profile.Practitioner.is(resource)) {
                return (
                    <UI.ListItem.Basic
                        value={Util.MP.getPractitionerName(resource)}
                        label={"Behandelnde Person"}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateAppointment = (
            values: UI.EntryGroupTemplateValues<
                | MR.V1_00_000.Profile.AppointmentPregnancy
                | MR.V1_00_000.Profile.EncounterArrivalMaternityHospital
            >
        ): JSX.Element | undefined => {
            const entry = values.entry;
            const onClick = Util.Misc.toEntry(history, mio, values.entry);
            const key = `item_${values.index}`;

            if (MR.V1_00_000.Profile.AppointmentPregnancy.is(entry.resource)) {
                const model = new Models.MP.AppointmentPregnancyModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );

                return (
                    <UI.ListItem.Basic
                        label={model.getMainValue().value}
                        noValue={true}
                        onClick={onClick}
                        key={key}
                    />
                );
            } else if (
                MR.V1_00_000.Profile.EncounterArrivalMaternityHospital.is(entry.resource)
            ) {
                const model = new Models.MP.EncounterArrivalMaternityHospitalModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );

                const mainValue = model.getMainValue();
                return (
                    <UI.ListItem.Basic
                        value={mainValue?.value}
                        label={mainValue?.label ?? "-"}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateTerminbestimmung = (
            values: UI.EntryGroupTemplateValues<
                | MR.V1_00_000.Profile.ObservationCalculatedDeliveryDate
                | MR.V1_00_000.Profile.ObservationDateDeterminationChildbirth
                | MR.V1_00_000.Profile.ObservationDateOfConception
                | MR.V1_00_000.Profile.ObservationDeterminationOfPregnancy
                | MR.V1_00_000.Profile.ObservationMenstrualCycle
            >
        ): JSX.Element | undefined => {
            const entry = values.entry;
            const onClick = Util.Misc.toEntry(history, mio, entry);
            const key = `item_${values.index}`;

            if (
                MR.V1_00_000.Profile.ObservationCalculatedDeliveryDate.is(
                    entry.resource
                ) ||
                MR.V1_00_000.Profile.ObservationDeterminationOfPregnancy.is(
                    entry.resource
                ) ||
                MR.V1_00_000.Profile.ObservationDateOfConception.is(entry.resource) ||
                MR.V1_00_000.Profile.ObservationMenstrualCycle.is(entry.resource)
            ) {
                const model = new Models.MP.Basic.ObservationModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );

                const mainValue = model.getMainValue();

                return (
                    <UI.ListItem.Basic
                        value={Util.Misc.formatDate(entry.resource.effectiveDateTime)}
                        label={mainValue ? mainValue.label : "-"}
                        onClick={onClick}
                        key={key}
                    />
                );
            } else if (
                MR.V1_00_000.Profile.ObservationDateDeterminationChildbirth.is(
                    entry.resource
                )
            ) {
                const model = new Models.MP.Basic.ObservationModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );

                const mainValue = model.getMainValue();

                return (
                    <UI.ListItem.Basic
                        value={model.getNote()?.value}
                        label={"Ergänzende Angaben zur " + (mainValue?.label ?? "-")}
                        onClick={onClick}
                        clampValue={true}
                        key={key}
                    />
                );
            } else {
                return (
                    <UI.ListItem.Basic
                        value={"-"}
                        label={"Terminbestimmung"}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateSpecialFindings = (
            values: UI.EntryGroupTemplateValues<
                | MR.V1_00_000.Profile.Composition
                | MR.V1_00_000.Profile.ObservationoGTTPretest
                | MR.V1_00_000.Profile.ObservationoGTTDiagnosistest
            >
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;
            const mioId = ParserUtil.getUuid(mio.identifier.value);

            if (MR.V1_00_000.Profile.Composition.is(resource)) {
                const results: JSX.Element[] = [];
                let hasSpecialFindings = false;
                let hasOGTT = false;

                resource.section.forEach((s) => {
                    if (s.title === "Besondere Befunde") {
                        s.entry?.forEach((e) => {
                            if (!hasSpecialFindings) {
                                const ref = e.reference;
                                if (
                                    ParserUtil.getEntryWithRef(
                                        mio,
                                        [MR.V1_00_000.Profile.ObservationSpecialFindings],
                                        ref
                                    )
                                ) {
                                    hasSpecialFindings = true;
                                }
                            }
                        });

                        s.section?.forEach((s2) => {
                            if (s2.title === "Gestationsdiabetes") {
                                s2.entry?.forEach((e) => {
                                    if (!hasOGTT) {
                                        const ref = e.reference;
                                        if (
                                            ParserUtil.getEntryWithRef(
                                                mio,
                                                [
                                                    MR.V1_00_000.Profile
                                                        .ObservationoGTTPretest,
                                                    MR.V1_00_000.Profile
                                                        .ObservationoGTTDiagnosistest
                                                ],
                                                ref
                                            )
                                        ) {
                                            hasOGTT = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                if (hasSpecialFindings) {
                    const title = "Katalog B";
                    results.push(
                        <UI.ListItem.Basic
                            noValue={true}
                            label={title}
                            onClick={() => history.push(`/section/${mioId}/${title}`)}
                            key={`item_${title}`}
                        />
                    );
                }

                if (hasOGTT) {
                    const title = "Gestationsdiabetes";
                    results.push(
                        <UI.ListItem.Basic
                            noValue={true}
                            label={title}
                            onClick={() => history.push(`/section/${mioId}/${title}`)}
                            key={`item_${title}`}
                        />
                    );
                }

                if (results.length) {
                    return (
                        <div key={`item_${values.index}`}>{results.map((r) => r)}</div>
                    );
                }
            }
        };

        const templateCounselling = (
            values: UI.EntryGroupTemplateValues<
                | MR.V1_00_000.Profile.ProcedureCounselling
                | MR.V1_00_000.Profile.ObservationHIVTestPerformed
            >
        ): JSX.Element | undefined => {
            const entry = values.entry;
            const onClick = Util.Misc.toEntry(history, mio, entry);
            const key = `item_${values.index}`;

            if (MR.V1_00_000.Profile.ProcedureCounselling.is(entry.resource)) {
                const model = new Models.MP.ProcedureCounsellingModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                return (
                    <UI.ListItem.Basic
                        value={mainValue?.value}
                        label={mainValue ? mainValue.label : "-"}
                        onClick={onClick}
                        key={key}
                    />
                );
            } else if (
                MR.V1_00_000.Profile.ObservationHIVTestPerformed.is(entry.resource)
            ) {
                const model = new Models.MP.Basic.ObservationModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();

                return (
                    <UI.ListItem.Basic
                        noValue={true}
                        label={mainValue ? mainValue.label : "-"}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateAntiDProphylaxis = (
            values: UI.EntryGroupTemplateValues<MR.V1_00_000.Profile.ProcedureAntiDProphylaxis>
        ): JSX.Element | undefined => {
            const entry = values.entry;
            const onClick = Util.Misc.toEntry(history, mio, entry);
            const key = `item_${values.index}`;

            if (MR.V1_00_000.Profile.ProcedureAntiDProphylaxis.is(entry.resource)) {
                const model = new Models.MP.Basic.ProcedureBaseModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );

                const mainValue = model.getMainValue();
                return (
                    <UI.ListItem.Basic
                        label={mainValue?.value ? mainValue.value : "-"}
                        noValue={true}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateTreatment = (
            values: UI.EntryGroupTemplateValues<MR.V1_00_000.Profile.EncounterInpatientTreatment>
        ): JSX.Element | undefined => {
            const entry = values.entry;
            const onClick = Util.Misc.toEntry(history, mio, entry);
            const key = `item_${values.index}`;

            if (MR.V1_00_000.Profile.EncounterInpatientTreatment.is(entry.resource)) {
                const model = new Models.MP.EncounterInpatientTreatmentModel(
                    entry.resource,
                    entry.fullUrl,
                    mio,
                    history
                );
                const mainValue = model.getMainValue();
                return (
                    <UI.ListItem.Basic
                        label={mainValue ? mainValue.label : "-"}
                        noValue={true}
                        onClick={onClick}
                        key={key}
                    />
                );
            }
        };

        const templateComposition = (
            values: UI.EntryGroupTemplateValues<MR.V1_00_000.Profile.Composition>
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;
            const mioId = ParserUtil.getUuid(mio.identifier.value);

            let results: JSX.Element[] = [];
            resource.section.forEach((s, index) => {
                if (s.title === "Untersuchungen") {
                    results = [];
                    const titles = [
                        "Laboruntersuchungen und Rötelnschutz",
                        "Gravidogramm",
                        "Ultraschall",
                        "Cardiotokographie",
                        "Abschluss-Untersuchung/Epikrise"
                    ];
                    s.section.forEach((s2, indexSub) => {
                        if (titles.includes(s2.title)) {
                            results.push(
                                <UI.ListItem.Basic
                                    noValue={true}
                                    label={s2.title}
                                    onClick={() =>
                                        history.push(
                                            `/section/${mioId}/${s2.title
                                                .split("/")
                                                .pop()}`
                                        )
                                    }
                                    key={`item_${index}_${indexSub}`}
                                />
                            );
                        }
                    });
                }
            });

            if (results.length) {
                return <div key={`item_${values.index}`}>{results.map((r) => r)}</div>;
            }
        };

        const templateCompositionAnamnese = (
            values: UI.EntryGroupTemplateValues<MR.V1_00_000.Profile.Composition>
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;
            const mioId = ParserUtil.getUuid(mio.identifier.value);

            const results: JSX.Element[] = [];

            let hasAnamnese = false;
            let hasGeneralFindings = false;

            resource.section.forEach((s) => {
                if (s.title === "Anamnese und allgemeine Befunde") {
                    s.entry.forEach((e) => {
                        if (!hasAnamnese) {
                            const ref = e.reference;
                            if (
                                ParserUtil.getEntryWithRef(
                                    mio,
                                    [
                                        MR.V1_00_000.Profile.ObservationAge,
                                        MR.V1_00_000.Profile
                                            .ObservationBaselineWeightMother,
                                        MR.V1_00_000.Profile.ObservationHeight,
                                        MR.V1_00_000.Profile.ObservationGravida,
                                        MR.V1_00_000.Profile.ObservationPara
                                    ],
                                    ref
                                )
                            ) {
                                hasAnamnese = true;
                            }
                        }
                    });

                    if (!hasGeneralFindings) {
                        s.entry.forEach((e) => {
                            if (!hasGeneralFindings) {
                                const ref = e.reference;
                                if (
                                    ParserUtil.getEntryWithRef(
                                        mio,
                                        [
                                            MR.V1_00_000.Profile
                                                .ClinicalImpressionInitialExamination,
                                            MR.V1_00_000.Profile.ObservationPregnancyRisk,
                                            MR.V1_00_000.Profile
                                                .ObservationPreviousPregnancy,
                                            MR.V1_00_000.Profile.ObservationCatalogueA
                                        ],
                                        ref
                                    )
                                ) {
                                    hasGeneralFindings = true;
                                }
                            }
                        });
                    }
                }
            });

            if (hasAnamnese) {
                const title = "Anamnese";
                results.push(
                    <UI.ListItem.Basic
                        noValue={true}
                        label={title}
                        onClick={() => history.push(`/section/${mioId}/${title}`)}
                        key={`item_${title}`}
                    />
                );
            }

            if (hasGeneralFindings) {
                const title = "Erste Vorsorge-Untersuchung";
                results.push(
                    <UI.ListItem.Basic
                        noValue={true}
                        label={title}
                        onClick={() => history.push(`/section/${mioId}/${title}`)}
                        key={`item_${title}`}
                    />
                );
            }

            if (results.length) {
                return <div key={`item_${values.index}`}>{results.map((r) => r)}</div>;
            }
        };

        const templateHints = (
            values: UI.EntryGroupTemplateValues<MR.V1_00_000.Profile.Composition>
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;

            if (MR.V1_00_000.Profile.Composition.is(resource)) {
                const hints = ParserUtil.getSlice<MR.V1_00_000.Profile.CompositionHinweise>(
                    MR.V1_00_000.Profile.CompositionHinweise,
                    resource.extension
                );

                const hintMap: Record<string, string> = {
                    hinweiseSchwangere: "Hinweise für die Schwangere",
                    hinweiseMutter: "Hinweise an die Mutter",
                    aufbewahrungshinweis: "Aufbewahrungshinweis"
                };

                if (hints) {
                    return (
                        <div key={values.index}>
                            {hints.extension?.map((e, index) => {
                                const value = e.valueString;
                                const result = value?.split(/(?=●)/).map((v) => {
                                    if (v.indexOf("●") >= 0) {
                                        return " - " + v.replace("●", "") + "<br/>";
                                    } else {
                                        return v;
                                    }
                                });

                                return (
                                    <UI.ListItem.Collapsible
                                        value={result?.join("")}
                                        label={hintMap[e.url]}
                                        key={`item_${index}`}
                                        innerHTML={true}
                                    />
                                );
                            })}
                        </div>
                    );
                }
            }
        };

        const groups: OverviewGroup[] = [
            {
                headline:
                    "Stempelinformationen des Arztes/der Klinik/der mitbetreuenden Hebamme",
                baseValues: [
                    MR.V1_00_000.Profile.Organization,
                    MR.V1_00_000.Profile.Practitioner
                ],
                template: templateStampInformation,
                compare: Compare.StampInformation,
                expandable: true
            },
            {
                headline: "Termine",
                baseValues: [
                    MR.V1_00_000.Profile.AppointmentPregnancy,
                    MR.V1_00_000.Profile.EncounterArrivalMaternityHospital
                ],
                template: templateAppointment,
                compare: Compare.Appointment,
                expandable: true
            },
            {
                headline: "Terminbestimmung",
                baseValues: [
                    MR.V1_00_000.Profile.ObservationDateDeterminationChildbirth,
                    MR.V1_00_000.Profile.ObservationMenstrualCycle,
                    MR.V1_00_000.Profile.ObservationDateOfConception,
                    MR.V1_00_000.Profile.ObservationCalculatedDeliveryDate,
                    MR.V1_00_000.Profile.ObservationDeterminationOfPregnancy
                ],
                template: templateTerminbestimmung,
                compare: Compare.DateDetermination,
                expandable: true
            },
            {
                headline: "Anamnese und allgemeine Befunde",
                baseValues: [MR.V1_00_000.Profile.Composition],
                template: templateCompositionAnamnese,
                expandable: true
            },
            {
                headline: "Besondere Befunde",
                baseValues: [
                    MR.V1_00_000.Profile.Composition,
                    MR.V1_00_000.Profile.ObservationoGTTPretest,
                    MR.V1_00_000.Profile.ObservationoGTTDiagnosistest
                ],
                template: templateSpecialFindings,
                expandable: true
            },
            {
                headline: "Beratung",
                baseValues: [
                    MR.V1_00_000.Profile.ObservationHIVTestPerformed,
                    MR.V1_00_000.Profile.ProcedureCounselling
                ],
                template: templateCounselling,
                expandable: true
            },
            {
                headline: "Anti-D-Prophylaxe",
                baseValues: [MR.V1_00_000.Profile.ProcedureAntiDProphylaxis],
                template: templateAntiDProphylaxis,
                expandable: true
            },
            {
                headline: "Untersuchungen",
                baseValues: [MR.V1_00_000.Profile.Composition],
                template: templateComposition,
                expandable: true
            },
            {
                headline: "Stationäre Behandlung",
                baseValues: [MR.V1_00_000.Profile.EncounterInpatientTreatment],
                template: templateTreatment,
                expandable: true
            },
            {
                headline: "Hinweise",
                baseValues: [MR.V1_00_000.Profile.Composition],
                template: templateHints
            }
        ];

        if (mio) {
            this.setState({
                entries: mio.entry.map((entry) => entry as MIOEntry<MRResource>),
                groups: groups
            });
        }
    }

    render(): JSX.Element {
        const { mio, history } = this.props;

        const patient = Util.MP.getPatientMother(mio);

        return (
            <div className={"mp-overview"} data-testid={"mp-overview"}>
                {patient && (
                    <div
                        className={"ion-padding"}
                        onClick={Util.Misc.toEntry(history, mio, patient)}
                    >
                        <PatientCard patient={patient.resource} />
                    </div>
                )}

                {this.state.groups.map((group, index) => (
                    <UI.EntryGroup
                        type={"Mutterpass"}
                        headline={group.headline}
                        subline={group.subline}
                        entries={this.state.entries}
                        baseValues={group.baseValues}
                        template={group.template}
                        compare={group.compare}
                        expandable={group.expandable}
                        key={`group_${index}`}
                    />
                ))}
            </div>
        );
    }
}
