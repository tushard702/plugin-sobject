/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import fs from 'node:fs';
import path from 'node:path';
import xml2js from 'xml2js';

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

// import { directoryPrompt } from '../../../shared/prompts/directory.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-sobject', 'generate.unifiedapp');

export type UnifiedApplicationGenerateResult = {
  member: string;
  unifiedapp: string;
};

export default class UnifiedApplicationGenerate extends SfCommand<UnifiedApplicationGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  // public static readonly requiresProject = true;

  public static readonly flags = {
    name: Flags.string({
      char: 'l',
      summary: messages.getMessage('flags.label.summary'),
      required: true
    }),
    developerName: Flags.string({
      char: 'd',
      summary: messages.getMessage('flags.label.summary'),
      required: true
    }),
    type: Flags.string({
      char: 't',
      summary: messages.getMessage('flags.description.summary')
    }),
  };

  public async run(): Promise<UnifiedApplicationGenerateResult> {
    const { flags } = await this.parse(UnifiedApplicationGenerate);

    const newMember = {
      name: flags.name,
      type: flags.type
    };

    // const directory = await directoryPrompt(this.project!.getPackageDirectories());

    const directory = 'UnifiedApplications';
    const filePath = path.join(directory, `${flags.developerName}.unifiedapp-meta.xml`);

    const xmlData = await fs.promises.readFile(filePath, 'utf-8')


    const parser = new xml2js.Parser();
    const xmlObject = await parser.parseStringPromise(xmlData);

    // Add the new member to the XML object
    if (!xmlObject.UnifiedApplication.unifiedApplicationMember) {
      xmlObject.UnifiedApplication.unifiedApplicationMember = [];
    }
    xmlObject.UnifiedApplication.unifiedApplicationMember.push(newMember);

    // Convert the updated JavaScript object back to XML
    const builder = new xml2js.Builder();
    const updatedXml = builder.buildObject(xmlObject);

    // Write the updated XML back to the file
    await fs.promises.writeFile(filePath, updatedXml);

    this.log(messages.getMessage('success', []));

    return {
      member: flags.name,
      unifiedapp: flags.developerName
    };
  }
}
