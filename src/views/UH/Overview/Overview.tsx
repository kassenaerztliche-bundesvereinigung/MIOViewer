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

import { CMR } from "@kbv/mioparser";
import { UI, Util } from "../../../components/";

type OverviewProps = Record<string, unknown> & UI.MIOSlidesProps;
type OverviewState = Record<string, unknown> & UI.MIOSlidesState;

export default class Overview extends UI.MIOSlides<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            headline: "U-Heft",
            id: "uh-overview",
            className: "uh-overview",
            testId: "uh-overview",
            headerClass: "uheft",
            back: () => this.props.history.goBack(),
            slides: [],
            currentIndex: 0
        };
    }

    protected createSlides(): JSX.Element[][] {
        const { mios, examples, location } = this.props;

        const isExample = Util.Misc.isExamplePath(location.pathname);
        this.setState({ isExample });

        const bundles = (isExample ? examples : mios).filter((mio) =>
            Util.UH.isBundle(mio)
        );

        bundles.sort((a, b) => {
            const compositionA = Util.UH.getComposition(
                a as
                    | CMR.V1_00_000.Profile.CMRBundle
                    | CMR.V1_00_000.Profile.PCBundle
                    | CMR.V1_00_000.Profile.PNBundle
            )?.resource;

            const compositionB = Util.UH.getComposition(
                b as
                    | CMR.V1_00_000.Profile.CMRBundle
                    | CMR.V1_00_000.Profile.PCBundle
                    | CMR.V1_00_000.Profile.PNBundle
            )?.resource;

            if (compositionA && compositionB) {
                return (
                    new Date(compositionB.date).getTime() -
                    new Date(compositionA.date).getTime()
                );
            } else {
                return 0;
            }
        });

        const components: JSX.Element[] = [];
        components.push(...this.mapMioFolders(bundles, true));

        return this.chunk(components, this.miosPerPage());
    }
}
