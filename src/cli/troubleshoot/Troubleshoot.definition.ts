/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { ICommandDefinition } from "@zowe/imperative";
import { ReorgDefinition } from "./reorg/reorgTable.definition";
import { DB2Session } from "../../index";

export const Execute: ICommandDefinition = {
    name: "troubleshoot",
    type: "group",
    summary: "Troubleshoot DB2 tables",
    description: "Troubleshoot DB2 tables using z/OSMF",
    children: [
        ReorgDefinition,
    ],
    passOn: [
        {
            property: "options",
            value: DB2Session.DB2_CONNECTION_OPTIONS,
            merge: true,
            ignoreNodes: [
                {type: "group"}
            ]
        }
    ]
};

module.exports = Execute;
