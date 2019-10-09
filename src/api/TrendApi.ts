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

/**
 * This class holds helper functions that are used to Diagnose DB2 table status
 * @export
 * @class PrepareTrend
 */
export class PrepareTrend {

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @param {ICopyOptions} reproOpts - contains the options with which to build the string
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     * @throws {ImperativeError}
     * @memberof CollectTrend
     */
    public static getTrendSql(dbsName: string, obName: string, rec: string): string {

        dbsName === "" ? dbsName = "%" : dbsName = dbsName.replace(/\s/g, "%");
        obName === "" ? obName = "%" : obName = obName.replace(/\s/g, "%");

        const SqlTrend =
        "SELECT  COUNT(*),SUBSTR(DATE,6,2)" +
        "    FROM DBINTEL.TBTREND" +
        `   WHERE DBNAME LIKE '${dbsName}' AND OBJECT_NAME LIKE '${obName}'` +
        `   AND RECOMMENDATION = '${rec}'` +
        "GROUP BY SUBSTR(DATE,6,2);";

        return SqlTrend;
    }
}
