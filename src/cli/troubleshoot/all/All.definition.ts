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

export const AllDefinition: ICommandDefinition = {
    name: "all",
    type: "command",
    summary: "Troubleshoot all tables",
    description: "Troubleshoot all tables with any status.",
    handler: __dirname + "/All.handler",
    profile: {
        optional: ["db2"]
    },
    options: [
        {
            name: "databaseName",
            aliases: ["dbn"],
            type: "string",
            description: "The database name for the querry",
        },
    ],
    examples: [
        {
            description: "Diagnose tables in data base DATABASE",
            options: "dbn DATABASE"
        }
    ],
};
