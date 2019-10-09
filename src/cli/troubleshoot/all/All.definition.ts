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
    summary: "Troubleshoot database objects for all necessary actions",
    description: "Troubleshoot all or specified database objects for all necessary actions.",
    handler: __dirname + "/All.handler",
    profile: {
        optional: ["db2"]
    },
    options: [
        {
            name: "databasename",
            aliases: ["dbn"],
            type: "string",
            description: "The database name for troubleshoot",
        },
    ],
    examples: [
        {
            description: "Database can be provided completely or partially with wild card character %",
            options: "dbn DATABASE or dbn DAT%"
        }
    ],
};
