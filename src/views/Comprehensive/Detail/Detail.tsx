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
import { Vaccination, ZAEB, MR, CMR, PKA } from "@kbv/mioparser";

import DetailIM from "../../IM/Detail";
import DetailZAEB from "../../ZB/Detail";
import DetailMP from "../../MP/Detail";
import DetailUH from "../../UH/Detail";
import DetailPK from "../../PK/Detail";

import { UI } from "../../../components";

import { DetailProps } from "./DetailBase";

class Detail extends React.Component<DetailProps> {
    render(): JSX.Element {
        const { mio, entry, history } = this.props;
        let component = undefined;

        if (mio) {
            if (Vaccination.V1_1_0.Profile.BundleEntry.is(mio)) {
                component = <DetailIM {...this.props} />;
            } else if (ZAEB.V1_1_0.Profile.Bundle.is(mio)) {
                component = <DetailZAEB {...this.props} />;
            } else if (MR.V1_1_0.Profile.Bundle.is(mio)) {
                component = <DetailMP {...this.props} />;
            } else if (
                CMR.V1_0_1.Profile.CMRBundle.is(mio) ||
                CMR.V1_0_1.Profile.PCBundle.is(mio) ||
                CMR.V1_0_1.Profile.PNBundle.is(mio)
            ) {
                component = <DetailUH {...this.props} />;
            } else if (PKA.V1_0_0.Profile.NFDxDPEBundle.is(mio)) {
                component = <DetailPK {...this.props} />;
            }
        }

        if (component) {
            return component;
        } else {
            const profile: string = entry?.resource.meta
                ? entry.resource.meta.profile[0]
                : "";

            const errors = [
                !mio ? "MIO nicht gefunden" : "",
                !entry ? "Eintrag nicht gefunden" : "",
                mio && entry
                    ? `Das Detail zum Profil ${profile
                          .split("/")
                          .pop()} kann nicht angezeigt werden`
                    : ""
            ];
            return <UI.Error errors={errors} backClick={() => history.goBack()} />;
        }
    }
}

export default SettingsConnector(MIOConnector(Detail));
