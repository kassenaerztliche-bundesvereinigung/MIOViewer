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

import { UI, Util } from "../../../components";

import DetailBase, { ListItemType } from "../../Comprehensive/Detail/DetailBase";
import { DetailMapping } from "../../Comprehensive/Detail/Types";

import { MIOEntry, Reference, PKA } from "@kbv/mioparser";
import Mappings from "../Mappings";
import * as Models from "../../../models";
import DetailComponent from "../../../components/Detail/Detail";
import React from "react";

class Detail extends DetailBase<PKA.V1_0_0.Profile.NFDxDPEBundle> {
    protected getHeaderClass(): UI.MIOClassName {
        return "pka";
    }

    static mappings = [
        ...Mappings.Basic,
        ...Mappings.Pregnancy,
        ...Mappings.AllergyIntolerance,
        ...Mappings.Implant,
        ...Mappings.CommunicationDisorder,
        ...Mappings.RunawayRisk,
        ...Mappings.Note,
        ...Mappings.Condition,
        ...Mappings.Procedure,
        ...Mappings.VoluntaryAdditionalInformation,
        ...Mappings.Medication,
        ...Mappings.Consent,
        ...Mappings.PractitionerRole,
        ...Mappings.Filterable
    ];

    protected getMappings(): DetailMapping[] {
        return Detail.mappings;
    }

    protected mapResource = (): ListItemType | undefined => {
        const { mio, entry, history, location, match, devMode } = this.props;

        if (mio && entry) {
            const res = entry;
            const props = {
                mio: mio,
                entry: res.resource,
                history: history,
                location: location,
                match: match,
                devMode: devMode
            };

            let detailMappings = this.getMappings();

            const matchParams = match.params as { filter: string; filterValue: string };
            if (matchParams.filter && matchParams.filterValue) {
                detailMappings = Mappings.Filterable;
            }

            const bundle = mio;
            let mappedResult!: ListItemType;

            detailMappings.forEach((mapping) => {
                if (!mappedResult && mapping.profile.is(res.resource)) {
                    const models = [];

                    if (mapping.models.length) {
                        mapping.models.forEach((model) => {
                            models.push(
                                new model(
                                    res.resource,
                                    res.fullUrl,
                                    bundle,
                                    history,
                                    mapping.codeConceptMaps,
                                    mapping.valueConceptMaps,
                                    mapping.customLabel,
                                    mapping.noValue,
                                    mapping.noHeadline,
                                    mapping.customHeadline
                                )
                            );
                        });
                    } else {
                        const model = new Models.PK.Observation(
                            res.resource as Models.PK.ObservationType,
                            res.fullUrl,
                            bundle as PKA.V1_0_0.Profile.NFDxDPEBundle,
                            history
                        );
                        models.push(model);
                    }

                    mappedResult = {
                        header: mapping.header ? mapping.header : "Details",
                        testIdSuffix: mapping.profile.name,
                        component: <DetailComponent {...props} models={[...models]} />
                    };
                }
            });
            return mappedResult;
        }
    };

    protected showPatient(): boolean {
        return false;
    }

    protected getPatient():
        | MIOEntry<PKA.V1_0_0.Profile.DPEPatientDPE | PKA.V1_0_0.Profile.NFDPatientNFD>
        | undefined {
        const { mio, entry } = this.props;
        const resource = entry?.resource;

        if (resource && PKA.V1_0_0.Profile.NFDObservationPregnancyStatus.is(resource)) {
            return Util.PK.getPatientByRef(
                mio as PKA.V1_0_0.Profile.NFDxDPEBundle,
                new Reference(resource.subject.reference, entry?.fullUrl)
            );
        }
    }
}

export default Detail;
