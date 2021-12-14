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

import BaseModel from "../BaseModel";
import { CMR, KBVBundleResource, ParserUtil } from "@kbv/mioparser";
import { Util } from "components";
import { ModelValue } from "../Types";

export default class QualificationModel<
    T extends CMR.V1_0_1.Profile.CMRPractitioner
> extends BaseModel<T> {
    protected code?: string;
    protected qualificationCoding?: CMR.V1_0_1.Profile.CMRPractitionerQualification;

    constructor(value: T, fullUrl: string, parent: KBVBundleResource, history?: History) {
        super(value, fullUrl, parent, history);
        this.code = history?.location.pathname.split("/").pop();
        this.headline = Util.UH.getPractitionerName(value);
        const qualificationCoding = value.qualification?.filter(
            (q) => q.code.coding[0].code === this.code
        );
        if (qualificationCoding && qualificationCoding.length) {
            this.qualificationCoding = qualificationCoding[0];
            this.values.push({
                value: Util.UH.translateQualification(
                    qualificationCoding[0].code.coding[0]
                ),
                label: "Qualifikationsbezeichnung"
            });
        }
        this.values.push(this.getQualificationPeriod(), this.getQualificationIssuer());
    }

    protected getQualificationPeriod(): ModelValue {
        let label = "Qualifikationszeitraum";
        let value = "-";
        const period = this.qualificationCoding?.period;
        const start = Util.Misc.formatDate(period?.start);
        const end = Util.Misc.formatDate(period?.end);
        if (period?.start && period?.end) {
            label = "In Qualifikation im Zeitraum";
            value = start + " - " + end;
        }
        if (period?.start && !period?.end) {
            label = "In Qualifikation seit";
            value = start;
        }
        if (!period?.start && period?.end) {
            label = "In Qualifikation bis";
            value = end;
        }

        return {
            value,
            label
        };
    }

    protected getQualificationIssuer(): ModelValue {
        const issuerRef = this.qualificationCoding?.issuer?.reference ?? "";
        const organization =
            ParserUtil.getEntryWithRef<CMR.V1_0_1.Profile.CMROrganization>(
                this.parent,
                [CMR.V1_0_1.Profile.CMROrganization],
                issuerRef
            )?.resource;

        return {
            value: organization?.name ? organization.name : "-",
            label: "Qualifikation bescheinigt durch",
            onClick: organization
                ? Util.Misc.toEntryByRef(this.history, this.parent, issuerRef)
                : undefined
        };
    }

    public toString(): string {
        throw new Error("Method not implemented.");
    }

    public getMainValue(): ModelValue {
        return {
            value: this.values.length ? this.values.map((v) => v.value).join(", ") : "-",
            label: this.headline
        };
    }
}
