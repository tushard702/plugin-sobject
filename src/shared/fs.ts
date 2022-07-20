/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import { CustomObject } from 'jsforce/api/metadata';
import { convertJsonToXml, parseXml } from './convert';
import { SaveableCustomObject, SaveablePlatformEvent } from './types';

const getObjectXmlByPathAsJson = async (objectFilePath: string): Promise<CustomObject> => {
  const xml = await fs.promises.readFile(objectFilePath, 'utf8');
  return parseXml<CustomObject>(xml, 'CustomObject');
};

/**
 * @param targetPaths typically your pkgDirs or project path
 * @returns directories that end in `/objects/`
 */
export const getDirectoriesThatContainObjects = async (targetPaths: string[]): Promise<string[]> => {
  const globs = targetPaths.map((p) => `${p}/**/objects/`);
  return fg(globs, { onlyDirectories: true });
};

/**
 * @param targetPaths typically your pkgDirs or project path
 * @returns directories that are children of `/objects/` like `force-app/main/default/objects/Foo__c`
 */
export const getObjectDirectories = async (targetPaths: string[]): Promise<string[]> => {
  const globs = targetPaths.map((p) => `${p}/**/objects/*`);
  return await fg(globs, { onlyDirectories: true });
};

/**
 * Use when you don't know what pkgDir the object is in, but you know its name
 *
 * @param targetPaths typically your pkgDirs or a project
 * @param objectApiName ex `Foo__c`
 * @returns CustomObject in json
 */
export const getObjectXmlByNameAsJson = async (targetPaths: string[], objectApiName: string): Promise<CustomObject> => {
  const globs = targetPaths.map((p) => `${p}/**/objects/${objectApiName}/${objectApiName}.object-meta.xml`);
  const [objectMetaPath] = await fg(globs);
  return getObjectXmlByPathAsJson(objectMetaPath);
};

/**
 * @param folder folder path to the object name (ex: `force-app/main/default/objects/Account`)
 * @returns CustomObject in json
 */
export const getObjectXmlByFolderAsJson = async (folder: string): Promise<CustomObject> => {
  const globs = `${folder}/*.object-meta.xml`;
  const [objectMetaPath] = await fg(globs);
  return getObjectXmlByPathAsJson(objectMetaPath);
};

export const writeObjectFile = async (
  objectDirectory: string,
  object: SaveablePlatformEvent | SaveableCustomObject
): Promise<void> => {
  await fs.promises.mkdir(path.join(objectDirectory, object.fullName), { recursive: true });
  await fs.promises.writeFile(
    path.join(objectDirectory, object.fullName, `${object.fullName}.object-meta.xml`),
    convertJsonToXml({ json: object, type: 'CustomObject' })
  );
};
