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

export const ReorgDefinition: ICommandDefinition = {
    name: "reorg",
    type: "command",
    summary: "Reorg table(s)",
    description: "Reorg table(s) with any status.",
    handler: __dirname + "/reorgTable.handler",
    profile: {
        optional: ["db2"]
    },
    options: [
        {
            name: "fileName",
            aliases: ["fn"],
            type: "string",
            description: "The file containing the JSON",
        },
    ],
    examples: [
        {
            description: "(WRONG)Diagnose tables in data base DATABASE",
            options: "dbn DATABASE"
        }
    ],
};
