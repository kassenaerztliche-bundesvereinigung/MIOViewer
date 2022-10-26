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

import { UI, Util } from "../../../components/";
import { BundleMapType } from "../../../MIOMap";
import { MIOConnector } from "../../../store";
import { withIonLifeCycle } from "@ionic/react";

type OverviewProps = UI.MIOSlidesProps & BundleMapType;
type OverviewState = UI.MIOSlidesState;

class OverviewList extends UI.MIOSlides<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            headline: props.headline,
            id: `${props.className}-overview`,
            className: `${props.className}-overview`,
            testId: `${props.className}-overview`,
            headerClass: props.className,
            back: () => this.props.history.goBack(),
            slides: [],
            currentIndex: 0
        };
    }

    protected createSlides(): JSX.Element[][] {
        const { mios, examples, location, bundles, compare } = this.props;

        const isExample = Util.Misc.isExamplePath(location.pathname);
        this.setState({ isExample });

        const values = isExample ? examples : mios;
        const matchingBundles = values.filter((mio) => bundles?.some((b) => b.is(mio)));

        if (compare) {
            matchingBundles.sort(compare);
        }

        if (!matchingBundles.length) {
            this.props.history.push("/main");
        }

        const components: JSX.Element[] = [];
        components.push(...this.mapMioFolders(matchingBundles, true));

        return this.chunk(components, this.miosPerPage());
    }
}

export default MIOConnector(withIonLifeCycle(OverviewList));
