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

import { ISqlCollect } from "./doc/ISqlCollect";

/**
 * This class holds helper functions that are used to Diagnose DB2 table status
 * @export
 * @class Diagnose
 */
export class ReorgJCL {

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @param {ICopyOptions} reproOpts - contains the options with which to build the string
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     * @throws {ImperativeError}
     * @memberof ColleDiagnosect
     */

    public static reorgJcl(fileName: string, user: string ): string {

        let option: string;
        const jsonArr: ISqlCollect = JSON.parse(fileName);

        const jobCard =
        "//ZAVNRORG JOB (106343000),\n" +
        "//             'ZAVNRNST- RUNSTATS',\n" +
        "//             CLASS=N,\n" +
        "//             MSGCLASS=3,TIME=60,\n" +
        "//             MSGLEVEL=(1,1),\n" +
        "//             REGION=0M,\n" +
        "//             COND=(4,LT),\n" +
        "//             NOTIFY=&SYSUID,\n" +
        "// USER=" + user  +"\n" +
        "/* JOBPARM SYSAFF=CA31\n" +
        "//         SET VCAT='D11A'      //SSID IF !SHARED, DSN+SSID IF SHARED\n" +
        "//         SET SSID='D11A'\n" +
        "//         SET RUNLIB=PTIPROD.RD200.PRD.CDBALOAD\n";

        let reOrgjcl: string;
        reOrgjcl = jobCard;
        let jsonObj: ISqlCollect;
        let stepNum = 0;
        for (jsonObj of jsonArr) {
            if (jsonObj.OBJECT_TYPE === "TS") {
                jsonObj.OBJECT_TYPE = "TABLESPACE";
                option = "LOG YES";
            } else {
                option="";
            }
            reOrgjcl = reOrgjcl + this.generateReorgs(jsonObj.OBJECT_TYPE, jsonObj.DBNAME,
                                                        jsonObj.OBJECT_NAME, option, stepNum.toString());
            stepNum++;
        }

        return reOrgjcl;
    }

    /**
     * Get an SQL to pass to the DB2 plugins z/OSMF REST API
     * @returns {string} - string to pass to  AMS z/OSMF REST API
     *
     */
    public static generateReorgs(objType: string, dbsName: string, objName: string, option: string, stepNum: string): string {

        const reorgStep: string =
        "//*---------------------------------------------------------------\n" +
        "//*   REORG FOR TABLESPACE & INDEX\n" +
        "//*---------------------------------------------------------------\n" +
        "//***********************<REORG TO ACTIVATE COMPRESSION>***************\n" +
        `//REO${stepNum}   EXEC PGM=DSNUTILB,REGION=4M,PARM='&SSID.,UTLD11A'\n` +
        "//STEPLIB  DD DSN=&RUNLIB,DISP=SHR\n" +
        "//         DD DSN=&VCAT..PRIVATE.SDSNEXIT,DISP=SHR\n" +
        "//         DD DSN=DB2.DB2B10.SDSNLOAD,DISP=SHR\n" +
        "//ICDSN#31 DD DSN=MCOE.DBINTEL.TC01.TB5555.IC#RID31,\n" +
        "//            DISP=(NEW,DELETE,DELETE),\n" +
        "//            SPACE=(CYL,(200,200),RLSE)\n" +
        "//RCDSN#31 DD DSN=MCOE.DBINTEL.TC01.TB5555.RCVRRD31,\n" +
        "//            DISP=(NEW,DELETE,DELETE),\n" +
        "//            SPACE=(CYL,(200,200),RLSE)\n" +
        "//UTPRINT  DD SYSOUT=*\n" +
        "//SYSPRINT DD SYSOUT=*\n" +
        "//SYSREC   DD UNIT=SYSDA,SPACE=(CYL,(10,950))\n" +
        "//SYSIN    DD *\n" +
        "  REORG " + objType + " " + dbsName + "." + objName + " "  + option + "\n" +
        "/* ";

        return reorgStep;
    }
}
