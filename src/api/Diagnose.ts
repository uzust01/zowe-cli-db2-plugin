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
        "         ,'NUMEROUS EXTENTS'  REASON" +
        "        ,DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "    FROM SYSIBM.SYSTABLESPACESTATS" +
        `   WHERE DBNAME LIKE '${dbsName}' AND EXTENTS > 254` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'NO ACTIVE PAGES'  REASON" +
        "        ,DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND NACTIVE IS NULL` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'REORG OR LOAD HAS NOT RUN' AS REASON" +
        "        ,DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "       ( LOADRLASTTIME IS NULL AND REORGLASTTIME IS NULL )" +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'MASS DELETES' AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND REORGMASSDELETE > 0` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'NUMEROUS EXTENTS' AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND EXTENTS > 254` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'NO ACTIVE PAGES' AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND NACTIVE IS NULL` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'NO REORG / NO REBUILD INDEX'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND ( REBUILDLASTTIME IS NULL` +
        "    AND REORGLASTTIME IS NULL )" +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RO' RECOMMENDATION" +
        "        ,'MASS DELETES'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND REORGMASSDELETE > 0` +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IMAGE COPY'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND COPYLASTTIME IS NULL` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC SINCE LAST REORG'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND REORGLASTTIME > COPYLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC SINCE LAST LOAD'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND LOADRLASTTIME > COPYLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC SINCE REBUILD INDEX'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND REBUILDLASTTIME > COPYLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC IN PAST 7 DAYS'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS ISS" +
        `  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "    ( JULIAN_DAY ( CURRENT DATE )" +
        "        ) - ( JULIAN_DAY ( COPYLASTTIME" +
        "        ) )  > 7" +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IMAGE COPY'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND COPYLASTTIME IS NULL` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC SINCE LAST REORG'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND REORGLASTTIME > COPYLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC SINCE LAST LOAD'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND LOADRLASTTIME > COPYLASTTIME ` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'IC' RECOMMENDATION" +
        "        ,'NO IC IN PAST 7 DAYS'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE  DBNAME LIKE '${dbsName}' AND` +
        "    ( JULIAN_DAY ( CURRENT DATE )" +
        "        ) - ( JULIAN_DAY ( COPYLASTTIME" +
        "        ) )  > 7" +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'MASS DELETES'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSMASSDELETE > 0` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'NO RS SINCE LAST LOAD'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < LOADRLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'NO RS SINCE LAST REORG'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < REORGLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'IX' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'RS TOTAL ENTRIES IS NULL'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSINDEXSPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND ( TOTALENTRIES IS NULL` +
        "     OR TOTALENTRIES < 0 )" +
        " UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'NO RUNSTATS'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME IS NULL` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'MASS DELETE'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSMASSDELETE > 0` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'NO RS SINCE LAST LOAD'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < LOADRLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'NO RS SINCE LAST REORG'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND STATSLASTTIME < REORGLASTTIME` +
        "   UNION " +
        "SELECT  DBNAME,NAME OBJECT_NAME,'TS' OBJECT_TYPE,'RS' RECOMMENDATION" +
        "        ,'TOTAL ROWS IS NULL'  AS REASON" +
        ",DATE(CURRENT TIMESTAMP) DATE, TIME(CURRENT TIMESTAMP) TIME" +
        "   FROM SYSIBM.SYSTABLESPACESTATS" +
        `  WHERE DBNAME LIKE '${dbsName}' AND ( TOTALROWS IS NULL` +
        "     OR TOTALROWS < 0)" +
        "ORDER BY OBJECT_NAME,DBNAME,OBJECT_TYPE,RECOMMENDATION;";

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
        "INSERT INTO DBINTEL.TBTREND " +
        "(DBNAME,OBJECT_NAME,OBJECT_TYPE,RECOMMENDATION,REASON,DATE,TIME) ";

        insertSql = `${insertSql} ${this.getAllStatusSql(dbsname)}`;

        return insertSql;
    }
}
