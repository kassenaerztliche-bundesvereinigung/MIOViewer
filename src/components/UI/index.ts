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

import AddMIOHelper, { AddMIOHelperState } from "./AddMIOHelper";
import BasicView from "./BasicView";
import ButtonIcon from "./ButtonIcon";
import ContentCopyBox, { ContentCopyBoxProps } from "./ContentCopyBox";
import * as DetailList from "./DetailList";
import EntryGroup, { EntryGroupTemplateValues, EntryGroupProps } from "../UI/EntryGroup";
import Header from "./Header";
import Error from "./Error";
import Input from "./Input";
import InputFile from "./InputFile";
import * as ListItem from "./ListItem";
import LoadingAnimation from "./LoadingAnimation";
import MIOFolder, { MIOFolderProps } from "./MIOFolder";
import MIOSlides, { MIOSlidesProps, MIOSlidesState } from "./MIOSlides";
import Modal, { ModalProps } from "./Modal";
import Pagination, { PaginationProps } from "./Pagination";
import TabBar from "./TabBar";
import Toggle, { ToggleProps } from "./Toggle";
import { MIOClassName, Clickable } from "./Types";

export type {
    AddMIOHelperState,
    ContentCopyBoxProps,
    MIOFolderProps,
    EntryGroupTemplateValues,
    EntryGroupProps,
    ToggleProps,
    ModalProps,
    PaginationProps,
    MIOClassName,
    Clickable,
    MIOSlidesProps,
    MIOSlidesState
};

export {
    AddMIOHelper,
    BasicView,
    ButtonIcon,
    ContentCopyBox,
    Header,
    DetailList,
    EntryGroup,
    Error,
    Input,
    InputFile,
    ListItem,
    LoadingAnimation,
    MIOFolder,
    MIOSlides,
    Modal,
    Pagination,
    TabBar,
    Toggle
};
