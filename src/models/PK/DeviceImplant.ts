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

import { PKA, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

export default class DeviceImplantModel extends BaseModel<PKA.V1_0_0.Profile.NFDDeviceImplant> {
    protected compositionUrl?: string;

    constructor(
        value: PKA.V1_0_0.Profile.NFDDeviceImplant,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Implantat";
        this.compositionUrl = Util.PK.getComposition(parent)?.fullUrl;

        const patientRef = new Reference(value.patient?.reference, this.compositionUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            {
                value: this.getCoding(),
                label: "Art des Implantats"
            },
            {
                value: value.deviceName?.map((d) => d.name).join(", ") ?? "-",
                label: "Bezeichnung"
            }
        ];
    }

    public getCoding(): string {
        return Util.FHIR.handleCode(this.value.type, [
            PKA.V1_0_0.ConceptMap.NFDImplantGerman
        ]).join(", ");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.getCoding(),
            label: this.value.deviceName?.map((d) => d.name).join(", ") ?? "-"
        };
    }
}
