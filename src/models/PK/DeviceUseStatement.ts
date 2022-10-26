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

import { PKA, ParserUtil, Reference } from "@kbv/mioparser";

import BaseModel from "./PKBaseModel";
import { ModelValue } from "../Types";
import { Util } from "../../components";

export default class DeviceUseStatementModel extends BaseModel<PKA.V1_0_0.Profile.NFDDeviceUseStatementImplant> {
    protected compositionUrl?: string;

    constructor(
        value: PKA.V1_0_0.Profile.NFDDeviceUseStatementImplant,
        fullUrl: string,
        parent: PKA.V1_0_0.Profile.NFDxDPEBundle,
        history?: History
    ) {
        super(value, fullUrl, parent, history);

        this.headline = "Implantation";
        this.compositionUrl = Util.PK.getComposition(parent)?.fullUrl;

        const patientRef = new Reference(value.subject?.reference, this.compositionUrl);
        const patient = Util.PK.getPatientByRef(parent, patientRef)?.resource;

        this.values = [
            {
                value: patient ? Util.PK.getPatientName(patient) : "-",
                label: "Patient/-in",
                onClick: Util.Misc.toEntryByRef(history, parent, patientRef, true)
            },
            ...this.getSource(),
            this.getImplant(),
            {
                value: Util.Misc.formatDate(value.timingPeriod?.start),
                label: "Implantation am"
            }
        ];
    }

    protected getSource(): ModelValue[] {
        const values: ModelValue[] = [];
        const ref = this.value.source?.reference;

        values.push(
            ...Util.PK.handlePractitionerRoleWithOrganization(
                this.parent as PKA.V1_0_0.Profile.NFDxDPEBundle,
                ref,
                this.compositionUrl,
                this.history,
                "Dokumentierende Person",
                "Dokumentierende Institution"
            )
        );

        return values;
    }

    protected getImplant(): ModelValue {
        let value = "-";
        let onClick = undefined;

        const deviceRef = this.value.device.reference;
        const ref = new Reference(deviceRef, this.compositionUrl);

        const device = ParserUtil.getEntryWithRef<PKA.V1_0_0.Profile.NFDDeviceImplant>(
            this.parent,
            [PKA.V1_0_0.Profile.NFDDeviceImplant],
            ref
        )?.resource;

        if (device) {
            value = device.deviceName?.map((n) => n.name).join(", ") ?? "-";
            onClick = Util.Misc.toEntryByRef(this.history, this.parent, ref, true);
        }

        return { value, label: "Implantat", onClick };
    }

    public getCoding(): string {
        return "This profile has no coding";
    }

    public getMainValue(): ModelValue {
        return {
            value:
                "Implantation am " + Util.Misc.formatDate(this.value.timingPeriod?.start),
            label: this.getImplant().value
        };
    }
}
