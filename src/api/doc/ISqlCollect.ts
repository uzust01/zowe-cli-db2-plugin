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

import { ImperativeError } from "@zowe/imperative";

/**
 * The DB2 response
 * @export
 * @interface ISqlCollect
 */
export interface ISqlCollect {

    /**
     * Data base name
     * @type {string}
     * @memberof ISqlCollect
     */
    DBNAME: string;

    /**
     * object name
     * @type {string}
     * @memberof ISqlCollect
     */
    OBJECT_NAME: string;

    /**
     * Object type name
     * @type {string}
     * @memberof ISqlCollect
     */
    OBJECT_TYPE: string;

    /**
     * Recommended action
     * @type {string}
     * @memberof ISqlCollect
     */
    RECOMMENDATION: string;

    /**
     * reason
     * @type {string}
     * @memberof ISqlCollect
     */
    REASON: string;

    /**
     * Date
     * @type {string}
     * @memberof ISqlCollect
     */
    RECOMMEDATENDATION: string;

    /**
     * Time
     * @type {string}
     * @memberof ISqlCollect
     */
    TIME: string;

    /**
     * Time
     * @type {string}
     * @memberof ISqlCollect
     */
    DATE: string;
}
