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
export class GenerateHTML {

    /**
     * Get the complete report in HTML format
     * @returns {string} - string to pass to  write to the new file.
     *
     * @memberof GenerateHTML
     */
    public static getAllStatusSql(arrOfJson: ISqlCollect[]): string {

        const htmlStart =
        `<!DOCTYPE html>
        <html>
        <head>
        <style>
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
        </style>
        </head>
        <body>
        <h2>Basic HTML Table</h2>
        <table style="width:100%">`;

        const tableHeader =
        `<tr>
        <th>DBNAME</th>
        <th>OBJECT NAME</th>
        <th>OBJECT TYPE</th>
        <th>RECOMMENDATION</th>
        <th>REASON</th>
        <th>DATE</th>
        <th>TIME</th>
        </tr>`;

        const htmlEnd =
        `</table>

        </body>
        </html>`;

        let completeHtml: string;

        completeHtml = htmlStart;
        let jsonObj: ISqlCollect;
        for (jsonObj of arrOfJson) {
            completeHtml = completeHtml + this.generateRows(jsonObj);
        }

        completeHtml = completeHtml + htmlEnd;

        return completeHtml;
    }

    /**
     * Generate the post first rows of the HTLM file
     * @param {ISqlCollect} reproOpts - contains the object to parse
     * @returns {string} - string to pass to append
     *
     * @memberof GenerateHTML
     */
    public static generateRows(jsonObj: ISqlCollect): string {

        const completeRow: string =
        `<tr>
        <td>${jsonObj.DBNAME}</td>
        <td>${jsonObj.OBJECT_NAME}</td>
        <td>${jsonObj.OBJECT_TYPE}</td>
        <td>${jsonObj.RECOMMENDATION}</td>
        <td>${jsonObj.REASON}</td>
        <td>${jsonObj.DATE}</td>
        <td>${jsonObj.TIME}</td>
        </tr>`;

        return completeRow;
    }
}
