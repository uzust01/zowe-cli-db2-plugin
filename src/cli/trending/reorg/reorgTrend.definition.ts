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
    description: "Get statistics report for Reorg history of database",
    handler: __dirname + "/reorgTrend.handler",
    profile: {
        optional: ["db2"]
    },
    options: [
        {
            name: "databaseName",
            aliases: ["dbn"],
            type: "string",
            description: "Database column",
            required: true,
        },
        {
            name: "objectName",
            aliases: ["on"],
            type: "string",
            description: "Object name column",
            required: true,
        },
    ],
    examples: [
        {
            description: "(WRONG)Diagnose tables in data base DATABASE",
            options: "dbn DATABASE"
        }
    ],
};
