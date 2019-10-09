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

import { AbstractSession, ICommandHandler, IHandlerParameters, ImperativeError, TextUtils, IO } from "@zowe/imperative";
import { ExecuteSQL, IDB2Session, DB2BaseHandler, Diagnose, ISqlCollect } from "../../../index";
import { Readable, Writable, Stream } from "stream";
import * as fs from "fs";
import { isNullOrUndefined } from "util";

/**
 * Command handler for executing of SQL queries
 * @export
 * @class AllHandler
 * @implements {ICommandHandler}
 */
export default class AllHandler extends DB2BaseHandler {
    public async processWithDB2Session(params: IHandlerParameters, session: AbstractSession): Promise<void> {
        const DB2session = session.ISession as IDB2Session;

        const queryStats = Diagnose.getAllStatusSql(params.arguments.databaseName);
        const queryTrend = Diagnose.getInsertSql(params.arguments.databaseName);
        const executor = new ExecuteSQL(DB2session);

        const response =  executor.execute(queryStats);
        executor.execute(queryTrend);
        const responses: any[] = [];
        let result;
        let resultset = 1;

        let filename: string;
        // Print out the response
        while (!(result = response.next()).done) {
            responses.push(result.value);
            params.response.console.log(`Result #${resultset}`);
            params.response.console.log(TextUtils.prettyJson(result.value));
            resultset++;
        }

        const reportJson = responses[0];
        for (const json of reportJson) {
            if (!isNullOrUndefined(json.TIME)) {
                filename = json.DATE + json.TIME.replace(/:/g, ".");
            }
        }

        params.response.console.log(`${filename}.txt`);
        IO.createDirsSyncFromFilePath(`${filename}.txt`);
        fs.writeFileSync(`${filename}.txt`, JSON.stringify(reportJson));

        // Return as an object when using --response-format-json
        params.response.data.setObj(responses);

    }
}
