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

import { MIOConnector, SettingsConnector } from "../../../store";

import * as Models from "../../../models";

import DetailComponent from "../../../components/Detail/Detail";
import DetailBase from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";
import { UI } from "../../../components";

import { MIOEntry, MR } from "@kbv/mioparser";
import Mappings from "../Mappings";

type ListItemType = { header: string; testIdSuffix?: string; component: JSX.Element };

class Detail extends DetailBase<MR.V1_1_0.Profile.Bundle> {
    protected getHeaderClass(): UI.MIOClassName {
        return "mutterpass";
    }

    static mappings = [
        // Basic
        ...Mappings.Basic,
        // Stempelinformationen
        ...Mappings.StampInformation,
        // Termine
        ...Mappings.Appointments,
        // Terminbestimmungen
        ...Mappings.DateDetermination,
        // Anamnese und allgemeine Befunde
        ...Mappings.Anamnesis.Basic, // Allgemeine Befunde
        ...Mappings.Anamnesis.Observations, // Anamnese
        ...Mappings.Anamnesis.CatalogueA, // Beobachtungen Katalog A
        // Besondere Befunde
        ...Mappings.SpecialFindings.Observation,
        ...Mappings.SpecialFindings.Tests,
        // Beratung
        ...Mappings.Counselling,
        // Anti-D Prophylaxe
        ...Mappings.AntiDProphylaxis,
        // Untersuchungen - Laboruntersuchungen und Rötelnschutz
        ...Mappings.LaboratoryExamination.BloodGroups, // Blutgruppenzugehörigkeit
        ...Mappings.LaboratoryExamination.Observations, // Laboruntersuchungen
        ...Mappings.LaboratoryExamination.ImmunizationStatus, // Impfrelevante Angaben
        // Untersuchungen - Gravidogramm
        ...Mappings.Gravidogramm.Basic,
        ...Mappings.Gravidogramm.Observations, // Komponenten des Eintrags
        // Untersuchungen - Ultraschall
        ...Mappings.Ultrasound.Comment,
        ...Mappings.Ultrasound.DiagnosticReports,
        ...Mappings.Ultrasound.Observations, // Befunde
        ...Mappings.Ultrasound.Others, // Weitere Untersuchungen
        // Untersuchungen - Cardiotokografie
        ...Mappings.Cardiotocography,
        // Untersuchungen - Abschluss-Untersuchung/Epikrise
        ...Mappings.EpicrisisPregnancy.DischargeSummary, // Schwangerschaft
        ...Mappings.EpicrisisPregnancy.Observations,
        ...Mappings.EpicrisisBirth.DeliveryInformation, // Geburt
        ...Mappings.EpicrisisBirth.Child, // Geburt - Angaben zum Kind
        ...Mappings.EpicrisisFirstExamination.ClinicalImpression, // Wochenbett
        ...Mappings.EpicrisisFirstExamination.Mother, // Wochenbett - Angaben zur Mutter
        ...Mappings.EpicrisisFirstExamination.Child, // Wochenbett - Angaben zum Kind
        ...Mappings.EpicrisisSecondExamination, // Zweite Untersuchung
        // Stationäre Behandlung
        ...Mappings.InpatientTreatment
    ];

    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected mapResource = (): ListItemType | undefined => {
        const { mio, entry, history, location, match, devMode } = this.props;

        if (mio && entry) {
            const resource = entry;
            const props = {
                mio: mio,
                entry: resource.resource,
                history: history,
                location: location,
                match: match
            };

            const bundle = mio as MR.V1_1_0.Profile.Bundle;

            let mappedResult: ListItemType | undefined = undefined;
            this.getMappings().forEach((mapping) => {
                if (!mappedResult && mapping.profile.is(entry.resource)) {
                    const models = [];

                    if (mapping.models.length) {
                        mapping.models.forEach((model) => {
                            if (
                                typeof model === typeof Models.MP.Basic.ObservationModel
                            ) {
                                models.push(
                                    new model(
                                        entry.resource,
                                        entry.fullUrl,
                                        bundle,
                                        history,
                                        mapping.valueConceptMaps,
                                        mapping.codeConceptMaps,
                                        mapping.customLabel,
                                        mapping.noValue,
                                        mapping.noHeadline,
                                        mapping.customHeadline
                                    )
                                );
                            } else {
                                models.push(new model(resource, bundle, history));
                            }
                        });
                    } else {
                        const model = new Models.MP.Basic.ObservationModel(
                            entry.resource as Models.MP.Basic.ObservationType,
                            entry.fullUrl,
                            bundle,
                            history,
                            mapping.valueConceptMaps,
                            mapping.codeConceptMaps,
                            mapping.customLabel,
                            mapping.noValue,
                            mapping.noHeadline,
                            mapping.customHeadline
                        );
                        models.push(model);
                    }

                    mappedResult = {
                        header: mapping.header ? mapping.header : "Details",
                        testIdSuffix: mapping.profile.name,
                        component: (
                            <DetailComponent
                                {...props}
                                models={[...models]}
                                devMode={devMode}
                            />
                        )
                    };
                }
            });
            return mappedResult;
        }
    };

    protected getPatient(): MIOEntry<MR.V1_1_0.Profile.PatientMother> | undefined {
        return undefined;
    }

    protected showPatient(): boolean {
        return false;
    }
}

export default SettingsConnector(MIOConnector(Detail));
