/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import fs from 'node:fs';
import path from 'node:path';

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { convertJsonToXml } from '../../../shared/convert.js';
// import { directoryPrompt } from '../../../shared/prompts/directory.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-sobject', 'generate.unifiedapp');

export type UnifiedApplicationGenerateResult = {
  label: string;
  path: string;
};

export default class UnifiedApplicationGenerate extends SfCommand<UnifiedApplicationGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  // public static readonly requiresProject = true;

  public static readonly flags = {
    label: Flags.string({
      char: 'l',
      summary: messages.getMessage('flags.label.summary'),
      required: true
    }),
    developerName: Flags.string({
      char: 'd',
      summary: messages.getMessage('flags.label.summary'),
      required: true
    }),
    description: Flags.string({
      char: 's',
      summary: messages.getMessage('flags.description.summary')
    }),
  };

  public async run(): Promise<UnifiedApplicationGenerateResult> {
    const { flags } = await this.parse(UnifiedApplicationGenerate);

    const unifiedapp = {
      label: flags.label,
      description: flags.description
    };

    // const directory = await directoryPrompt(this.project!.getPackageDirectories());
    const directory = 'UnifiedApplications';
    const appPath = path.join(directory, `${flags.developerName}.unifiedapp-meta.xml`);
    await fs.promises.mkdir(directory, { recursive: true });
    await fs.promises.writeFile(appPath, convertJsonToXml({ json: unifiedapp, type: 'UnifiedApplication' }));

    this.log(messages.getMessage('success', [flags.label, appPath]));

    return {
      label: flags.label,
      path: appPath
    };
  }
}
