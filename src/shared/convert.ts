/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as jsToXml from 'js2xmlparser';
import { IOptions } from 'js2xmlparser/lib/options';
import { CustomObject, CustomField } from 'jsforce/api/metadata';
import { JsonMap } from '@salesforce/ts-types';

const standardOptions: IOptions = {
  declaration: {
    include: true,
    encoding: 'UTF-8',
    version: '1.0',
  },
  format: {
    doubleQuotes: true,
  },
};

interface WriteJSONasXMLInputs {
  json: CustomField | CustomObject | JsonMap;
  type: string;
  options?: IOptions;
}

const convertJsonToXml = ({ json, type, options = standardOptions }: WriteJSONasXMLInputs): string => {
  return jsToXml.parse(type, fixExistingDollarSign(json), options);
};

const fixExistingDollarSign = <T extends WriteJSONasXMLInputs['json']>(existing: T): T => {
  const existingCopy = { ...existing };
  if ('$' in existingCopy) {
    const temp = existingCopy.$;
    delete existingCopy.$;
    existingCopy['@'] = temp;
  }
  return existingCopy;
};

export { convertJsonToXml };
