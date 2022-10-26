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
import { History } from "history";

import { PKA, DPEResource, NFDResource, NFDxDPEResource, MIOEntry } from "@kbv/mioparser";

import { UI, Util } from "../../../components/";
import PatientCard from "../../../components/PatientCard";
import Compare from "../Compare";
import * as Models from "../../../models";
import Mappings from "../Mappings";

const PR = PKA.V1_0_0.Profile;

type OverviewGroupNFD = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof PR.NFDObservationPregnancyStatus
        | typeof PR.NFDObservationPregnancyCalculatedDeliveryDate
        | typeof PR.NFDAllergyIntolerance
        | typeof PR.NFDDeviceUseStatementImplant
        | typeof PR.NFDDeviceImplant
        | typeof PR.NFDConditionCommunicationDisorder
        | typeof PR.NFDConditionRunawayRisk
        | typeof PR.NFDObservationNote
        | typeof PR.NFDCondition
        | typeof PR.NFDProcedure
        | typeof PR.NFDObservationVoluntaryAdditionalInformation
        | typeof PR.NFDMedicationRecipe
        | typeof PR.NFDMedicationStatementAdministrationInstruction
        | typeof PR.NFDxDPEConsentActiveAdvanceDirective
        | typeof PR.NFDPractitionerRole
    )[];
    template: (
        values: UI.EntryGroupTemplateValues<NFDResource | NFDxDPEResource>
    ) => JSX.Element | undefined;
    compare?: (
        a: MIOEntry<NFDResource | NFDxDPEResource>,
        b: MIOEntry<NFDResource | NFDxDPEResource>
    ) => number;
    expandable?: boolean;
};

type OverviewGroupDPE = {
    headline: string;
    subline?: string;
    baseValues: (
        | typeof PR.DPEConsentPersonalConsent
        | typeof PR.NFDxDPEConsentActiveAdvanceDirective
    )[];
    template: (
        values: UI.EntryGroupTemplateValues<DPEResource | NFDxDPEResource>
    ) => JSX.Element | undefined;
    compare?: (
        a: MIOEntry<PKA.V1_0_0.Profile.DPEConsentPersonalConsent>,
        b: MIOEntry<PKA.V1_0_0.Profile.DPEConsentPersonalConsent>
    ) => number;
};

type OverviewProps = {
    mio: PKA.V1_0_0.Profile.NFDxDPEBundle;
    history: History;
};

type OverviewState = {
    entries: MIOEntry<DPEResource | NFDResource | NFDxDPEResource>[];
    groupsDPE: OverviewGroupDPE[];
    groupsNFD: OverviewGroupNFD[];
};

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    protected composition?:
        | PKA.V1_0_0.Profile.DPECompositionDPE
        | PKA.V1_0_0.Profile.NFDCompositionNFD;

    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            entries: [],
            groupsDPE: [],
            groupsNFD: []
        };

        this.composition = Util.PK.getComposition(this.props.mio)?.resource;
    }

    componentDidMount(): void {
        const { mio, history } = this.props;

        const renderMainValue = (
            entry: MIOEntry<DPEResource | NFDResource | NFDxDPEResource>,
            Model: any // eslint-disable-line
        ) => {
            const model = new Model(entry.resource, entry.fullUrl, mio);
            const mainValue = model.getMainValue();

            const Component = mainValue.renderAs ?? UI.ListItem.Basic;
            return (
                <Component
                    value={mainValue.value}
                    label={mainValue.label}
                    onClick={Util.Misc.toEntry(history, mio, entry)}
                    key={`item_${entry.fullUrl}`}
                />
            );
        };

        const templateDPE = (
            values: UI.EntryGroupTemplateValues<DPEResource | NFDxDPEResource>
        ): JSX.Element | undefined => {
            if (
                PR.DPEConsentPersonalConsent.is(values.entry.resource) ||
                PR.NFDxDPEConsentActiveAdvanceDirective.is(values.entry.resource)
            ) {
                return renderMainValue(values.entry, Models.PK.Consent);
            }
        };

        const templateNFD = (
            values: UI.EntryGroupTemplateValues<NFDResource | NFDxDPEResource>
        ): JSX.Element | undefined => {
            const resource = values.entry.resource;

            if (PR.NFDxDPEConsentActiveAdvanceDirective.is(values.entry.resource)) {
                return renderMainValue(values.entry, Models.PK.Consent);
            } else if (
                PR.NFDObservationNote.is(resource) ||
                PR.NFDObservationPregnancyStatus.is(resource) ||
                PR.NFDObservationPregnancyCalculatedDeliveryDate.is(resource) ||
                PR.NFDObservationVoluntaryAdditionalInformation.is(resource)
            ) {
                return renderMainValue(values.entry, Models.PK.Observation);
            } else if (PKA.V1_0_0.Profile.NFDAllergyIntolerance.is(resource)) {
                return renderMainValue(values.entry, Models.PK.AllergyIntolerance);
            } else if (PR.NFDDeviceImplant.is(resource)) {
                return renderMainValue(values.entry, Models.PK.DeviceImplant);
            } else if (PR.NFDDeviceUseStatementImplant.is(resource)) {
                return renderMainValue(values.entry, Models.PK.DeviceUseStatement);
            } else if (
                PR.NFDCondition.is(resource) ||
                PR.NFDConditionRunawayRisk.is(resource) ||
                PR.NFDConditionCommunicationDisorder.is(resource)
            ) {
                return renderMainValue(values.entry, Models.PK.Condition);
            } else if (PR.NFDProcedure.is(resource)) {
                return renderMainValue(values.entry, Models.PK.Procedure);
            } else if (PR.NFDMedicationRecipe.is(resource)) {
                return renderMainValue(values.entry, Models.PK.Medication);
            } else if (PR.NFDMedicationStatementAdministrationInstruction.is(resource)) {
                return renderMainValue(values.entry, Models.PK.MedicationStatement);
            } else if (
                PR.NFDPractitionerRole.is(resource) ||
                PR.NFDPractitionerRoleWithOrganization.is(resource)
            ) {
                return renderMainValue(values.entry, Models.PK.PractitionerRole);
            } else {
                return (
                    <UI.ListItem.Basic
                        value={resource.resourceType}
                        label={"NFD"}
                        onClick={Util.Misc.toEntry(history, mio, values.entry)}
                        key={"item_" + values.index}
                    />
                );
            }
        };

        if (PKA.V1_0_0.Profile.NFDCompositionNFD.is(this.composition)) {
            const groups: OverviewGroupNFD[] = [
                {
                    headline: "Schwangerschaft",
                    baseValues: Mappings.Pregnancy.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Allergie/Unverträglichkeit",
                    baseValues: Mappings.AllergyIntolerance.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Implantat",
                    baseValues: Mappings.Implant.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Kommunikationsstörung",
                    baseValues: Mappings.CommunicationDisorder.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Weglaufgefährdung/Hinlaufgefährdung",
                    baseValues: Mappings.RunawayRisk.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Sonstiger Hinweis",
                    baseValues: Mappings.Note.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Diagnose",
                    baseValues: Mappings.Condition.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Prozedur",
                    baseValues: Mappings.Procedure.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Freiwillige Zusatzinformationen",
                    baseValues: Mappings.VoluntaryAdditionalInformation.map(
                        (m) => m.profile
                    ),
                    template: templateNFD
                },
                {
                    headline: "Medikationseinträge",
                    baseValues: Mappings.Medication.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "NFD_Versicherter_Einwilligung",
                    baseValues: Mappings.Consent.map((m) => m.profile),
                    template: templateNFD
                },
                {
                    headline: "Behandelnde Person / Einrichtung",
                    baseValues: Mappings.PractitionerRole.map((m) => m.profile),
                    template: templateNFD
                }
            ];

            if (mio) {
                this.setState({
                    entries: Util.PK.getEntriesNFD(mio),
                    groupsNFD: groups.map((g) => {
                        g.expandable = true;
                        return g;
                    })
                });
            }
        } else {
            const groups: OverviewGroupDPE[] = [
                {
                    headline: "Persönliche Erklärungen",
                    baseValues: [
                        PR.DPEConsentPersonalConsent,
                        PR.NFDxDPEConsentActiveAdvanceDirective
                    ],
                    template: templateDPE,
                    compare: Compare.Consent
                }
            ];

            if (mio) {
                this.setState({
                    entries: Util.PK.getEntriesDPE(mio),
                    groupsDPE: groups
                });
            }
        }
    }

    render(): JSX.Element {
        const { mio, history } = this.props;

        const patient = Util.PK.getPatient(mio);

        return (
            <div className={"pka-overview"} data-testid={"pka-overview"}>
                {patient && (
                    <div
                        className={"ion-padding"}
                        onClick={Util.Misc.toEntry(history, mio, patient)}
                    >
                        <PatientCard patient={patient.resource} />
                    </div>
                )}

                {this.state.groupsDPE.map((group, index) => (
                    <UI.EntryGroup
                        type={"Patientenkurzakte"}
                        headline={group.headline}
                        subline={group.subline}
                        entries={this.state.entries}
                        baseValues={group.baseValues}
                        template={group.template}
                        compare={group.compare}
                        key={`group_${index}`}
                    />
                ))}

                {this.state.groupsNFD.map((group, index) => (
                    <UI.EntryGroup
                        type={"Patientenkurzakte"}
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
