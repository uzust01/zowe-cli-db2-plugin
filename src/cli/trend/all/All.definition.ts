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
    summary: "Trend analysis for a speicific object against all actions",
    description: "Generates trend report for a speicific object against all actions.",
    handler: __dirname + "/All.handler",
    profile: {
        optional: ["db2"]
    },
    options: [
        {
            name: "tablespacename",
            aliases: ["tsn"],
            type: "string",
            description: "The tablespace name for the trend analysis requested",
        },
    ],
    examples: [
        {
            description: "Provide name of the tablespace",
            options: "tsn TABLESPACE"
        }
    ],
};
