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

import { Dispatch } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { MIOViewerRootState, MIOActions, AsyncAction, MIOState } from "./";

import {
    ParserUtil,
    KBVResource,
    KBVBundleResource,
    MIOEntry,
    Reference
} from "@kbv/mioparser";

function findMIO(
    mios: KBVBundleResource[],
    props: RouteComponentProps<{ id: string }>
): KBVBundleResource | undefined {
    if (props.match && props.match.params && props.match.params.id) {
        const result = mios.filter(
            (m) =>
                m.identifier &&
                m.identifier.value &&
                ParserUtil.getUuidFromBundle(m) === props.match.params.id
        );
        if (result.length > 0) return result[0];
    }

    return undefined;
}

function findEntryByRouteProps(
    mio: KBVBundleResource | undefined,
    props: RouteComponentProps<{ id: string; entry: string }>
): MIOEntry<KBVResource> | undefined {
    if (mio && props.match && props.match.params && props.match.params.entry) {
        const entry = decodeURIComponent(props.match.params.entry);
        return ParserUtil.findEntryByReference(mio, new Reference(entry));
    }

    return undefined;
}

// eslint-disable-next-line
const mapStateToProps = ({ mioState }: MIOViewerRootState, ownProps: any): MIOState => {
    const { mios, examples, loading } = mioState;
    const mio = findMIO(mios, ownProps) || findMIO(examples, ownProps);

    return {
        mios: mios,
        examples: examples,
        mio: mio,
        entry: findEntryByRouteProps(mio, ownProps),
        loading
    };
};

const mapDispatcherToProps = (dispatch: Dispatch<MIOActions>) => {
    return {
        addMIO: (item: KBVBundleResource) => AsyncAction.addMIO(dispatch, item),
        parseMIO: (file: Blob) => AsyncAction.parseMIO(dispatch, file),
        parseMIOs: (files: Blob[]) => AsyncAction.parseMIOs(dispatch, files),
        setLoading: (value: boolean) => AsyncAction.setLoading(dispatch, value),
        makePDF: (value: KBVResource | KBVBundleResource | undefined) =>
            AsyncAction.makePDF(dispatch, value)
    };
};

export type MIOConnectorType = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

const MIOConnector = connect(mapStateToProps, mapDispatcherToProps);
export default MIOConnector;
