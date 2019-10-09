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
import { ExecuteSQL, IDB2Session, DB2BaseHandler, Diagnose, ReorgJCL } from "../../../index";
import { SubmitJobs } from "@zowe/cli";
import { Readable, Writable, Stream } from "stream";
import * as fs from "fs";
import { isNullOrUndefined } from "util";

/**
 * Command handler for executing of SQL queries
 * @export
 * @class AllHandler
 * @implements {ICommandHandler}
 */
export default class ReorgHandler extends DB2BaseHandler {
    public async processWithDB2Session(params: IHandlerParameters, session: AbstractSession): Promise<void> {
        const DB2session = session.ISession as IDB2Session;

        const fileStringPromise = await fs.readFileSync(params.arguments.fileName);
        const fileString = fileStringPromise.toString();
        const generatedJcl = ReorgJCL.reorgJcl(fileString, DB2session.user);

        params.response.console.log(generatedJcl);
        await SubmitJobs.submitJclString(session as any, generatedJcl, {jclSource: undefined});
        // Return as an object when using --response-format-json
        // params.response.data.setObj(responses);

    }
}
