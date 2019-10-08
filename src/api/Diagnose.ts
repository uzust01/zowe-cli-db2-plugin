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
 * @class Diagnose
 */
export class Diagnose {

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @param {ICopyOptions} reproOpts - contains the options with which to build the string
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     * @throws {ImperativeError}
     * @memberof ColleDiagnosect
     */
    public static getAllStatusSql(dbsName: string): string {

        dbsName === "" ? dbsName = "%" : dbsName = dbsName.replace(/\s/g, "%");

        const SqlDiagnose =
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n         ,'NUMEROUS EXTENTS'  REASON" +
        "\n        ,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n    FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n   WHERE DBNAME LIKE '${dbsName}' AND EXTENTS > 254` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'NO ACTIVE PAGES'  REASON" +
        "\n        ,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND NACTIVE IS NULL` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'REORG OR LOAD HAS NOT RUN' AS REASON" +
        "\n        ,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "\n       ( LOADRLASTTIME IS NULL AND REORGLASTTIME IS NULL )" +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'MASS DELETES' AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND REORGMASSDELETE > 0` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'NUMEROUS EXTENTS' AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND EXTENTS > 254` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'NO ACTIVE PAGES' AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND NACTIVE IS NULL` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'NO REORG / NO REBUILD INDEX'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND ( REBUILDLASTTIME IS NULL` +
        "\n    AND REORGLASTTIME IS NULL )" +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "\n        ,'MASS DELETES'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND REORGMASSDELETE > 0` +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IMAGE COPY'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND COPYLASTTIME IS NULL` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC SINCE LAST REORG'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND REORGLASTTIME > COPYLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC SINCE LAST LOAD'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND LOADRLASTTIME > COPYLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC SINCE REBUILD INDEX'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND REBUILDLASTTIME > COPYLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC IN PAST 7 DAYS'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `\n  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "\n    ( JULIAN_DAY ( CURRENT DATE )" +
        "\n        ) - ( JULIAN_DAY ( COPYLASTTIME" +
        "\n        ) )  > 7" +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IMAGE COPY'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND COPYLASTTIME IS NULL` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC SINCE LAST REORG'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND REORGLASTTIME > COPYLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC SINCE LAST LOAD'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND LOADRLASTTIME > COPYLASTTIME ` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "\n        ,'NO IC IN PAST 7 DAYS'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "\n    ( JULIAN_DAY ( CURRENT DATE )" +
        "\n        ) - ( JULIAN_DAY ( COPYLASTTIME" +
        "\n        ) )  > 7" +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'MASS DELETES'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSMASSDELETE > 0` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'NO RS SINCE LAST LOAD'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < LOADRLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'NO RS SINCE LAST REORG'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < REORGLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'RS TOTAL ENTRIES IS NULL'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND ( TOTALENTRIES IS NULL` +
        "\n     OR TOTALENTRIES < 0 )" +
        "\nUNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'NO RUNSTATS'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME IS NULL` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'MASS DELETE'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSMASSDELETE > 0` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'NO RS SINCE LAST LOAD'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < LOADRLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'NO RS SINCE LAST REORG'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < REORGLASTTIME` +
        "\n   UNION" +
        "\nSELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "\n        ,'TOTAL ROWS IS NULL'  AS REASON" +
        "\n,DATE(CURRENT TIMESTAMP), TIME(CURRENT TIMESTAMP)" +
        "\n   FROM SYSIBM.SYSTABLESPACESTATS" +
        `\n  WHERE DBNAME LIKE '${dbsName}' AND ( TOTALROWS IS NULL` +
        "\n     OR TOTALROWS < 0)" +
        "\nORDER BY OBJECT_NAME,DBNAME,OBJECT_TYPE,RECOMMENDATION;";


        return SqlDiagnose;
    }

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @param {ICopyOptions} reproOpts - contains the options with which to build the string
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     * @throws {ImperativeError}
     * @memberof ColleDiagnosect
     */
    public static getInsertSql(dbsname: string): string {

        let insertSql =
        "INSERT INTO DBINTEL.TBTREND" +
        "\n(DBNAME,OBJECT_NAME,OBJECT_TYPE,RECOMMENDATION,REASON,DATE,TIME)";

        insertSql = `${insertSql} + \n${this.getAllStatusSql(dbsname)}`;

        return insertSql;
    }
}
