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
export class RunStatsJcl {

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @param {ICopyOptions} reproOpts - contains the options with which to build the string
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     * @throws {ImperativeError}
     * @memberof ColleDiagnosect
     */

    public static troubleShootJCL(dbsName: string,user: string, objType: string, objName: string ): void {

        dbsName === "" ? dbsName = "%" : dbsName = dbsName.replace(/\s/g, "%");
        const Statsjcl =
        "//ZAVNRNST JOB (106343000),\n" +
        "//             'ZAVNRNST- RUNSTATS',\n" +
        "//             CLASS=N,\n" +
        "//             MSGCLASS=3,TIME=60,\n" +
        "//             MSGLEVEL=(1,1),\n" +
        "//             REGION=0M,\n" +
        "//             COND=(4,LT),\n" +
        "//             NOTIFY=&SYSUID,\n" +
        "// USER=" + user  +"\n" +
        "/*JOBPARM SYSAFF=CA31\n" +
        "//*-----------------------------------------------\n" +
        "//*   RUNSTATS FOR TABLESPACE & INDEX\n" +
        "//*-----------------------------------------------\n" +
        "//IRS#     EXEC PGM=DSNUTILB,PARM='%SYSID,ZAVUTIL'\n" +
        "//STEPLIB  DD  DISP=SHR,DSN=D11C.PRIVATE.SDSNEXIT \n" +
        "//         DD  DISP=SHR,DSN=DB2.DB2B10.SDSNLOAD\n" +
        "//         DD  DISP=SHR,DSN=SYS1.SORTLIB\n" +
        "//         DD  DISP=SHR,DSN=SYS1.SORTLPA\n" +
        "//         DD  DISP=SHR,DSN=SYS1.SICELINK\n" +
        "//         DD  DISP=SHR,DSN=SYS1.SICELPA\n" +
        "//SYSPRINT DD  SYSOUT=*\n" +
        "//UTPRINT  DD  SYSOUT=*\n" +
        "//SYSIN    DD  *\n" +
         "RUNSTATS " + objType + " " + dbsName + "." + objName + "\n";
    }
}
