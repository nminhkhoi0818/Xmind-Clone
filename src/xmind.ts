import { defaultConfig } from "./mindmapConfig";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

enum EnumStatus {
  Success,
  Failure,
}

class Xmind {
  sheetFileManager: SheetFileManager;
  sheets: Sheet[];

  constructor() {
    this.sheetFileManager = new SheetFileManager();
    this.sheets = [];
    this.addNewSheet();
  }

  addNewSheet() {
    const newSheet = new Sheet(`Sheet ${this.sheets.length + 1}`);
    this.sheets.push(newSheet);
  }

  deleteSheet(sheetId: string) {
    this.sheets = this.sheets.filter((s) => s.id !== sheetId);
  }

  duplicateSheet(sheetId: string) {
    const sheet = this.sheets.find((s) => s.id === sheetId);
    const deepCopy = cloneDeep(sheet);
    this.sheets.push(deepCopy!);
  }
}

class Sheet {
  id: string;
  name: string;
  rootTopic: Topic;
  floatingTopicList: Topic[];
  relationshipList: Relationship[];
  backgroundColor: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.rootTopic = this.createRootTopicDefault();
    this.floatingTopicList = [];
    this.relationshipList = [];
    this.backgroundColor = defaultConfig.sheet.backgroundColor;
  }

  createRootTopicDefault(): Topic {
    let rootTopic = new Topic(defaultConfig.rootTopic.name);
    const mainTopics = defaultConfig.mainTopics;
    mainTopics.forEach((mainTopicName) => {
      rootTopic.createSubTopic(mainTopicName);
    });
    return rootTopic;
  }

  renameSheet(newName: string): void {
    this.name = newName;
  }

  createFloatingTopic(name: string): void {
    const floatingTopic = new Topic(name);
    this.floatingTopicList.push(floatingTopic);
  }

  createRelationship(fromTopicId: string, toTopicId: string): void {
    const newRelationship = new Relationship(fromTopicId, toTopicId);
    this.relationshipList.push(newRelationship);
  }

  deleteRelationship(relationshipId: string): void {
    this.relationshipList = this.relationshipList.filter(
      (relationship) => relationship.id !== relationshipId
    );
  }

  moveTopicToFloatingTopic(topicId: string): void {
    const topic = this.rootTopic.subTopics.find(
      (topic) => topic.id === topicId
    );
    this.floatingTopicList.push(topic!);
    topic!.parent?.deleteSubTopic(topicId);
  }

  changeBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }
}

class Relationship {
  id: string;
  pairTopic: { from: string; to: string };
  name: string;

  constructor(fromTopicId: string, toTopicId: string) {
    this.id = uuidv4();
    this.pairTopic = { from: fromTopicId, to: toTopicId };
    this.name = defaultConfig.relationship.name;
  }

  renameRelationship(newName: string): void {
    this.name = newName;
  }
}

class Topic {
  id: string;
  text: string;
  subTopics: Topic[];
  parent: Topic | null;
  shape: Shape;
  customText: CustomText;
  position: Position;

  constructor(text: string) {
    this.id = uuidv4();
    this.text = text;
    this.subTopics = [];
    this.parent = null;
    this.shape = new Shape(
      defaultConfig.topic.defaultShape.fillColor,
      defaultConfig.topic.defaultShape.border,
      defaultConfig.topic.defaultShape.length
    );
    this.customText = new CustomText(
      text,
      defaultConfig.topic.defaultText.fontSize,
      defaultConfig.topic.defaultText.fontFamily,
      defaultConfig.topic.defaultText.fontStyle,
      defaultConfig.topic.defaultText.textColor
    );
    this.position = new Position(
      defaultConfig.topic.defaultPosition.x,
      defaultConfig.topic.defaultPosition.y
    );
  }

  createSubTopic(text: string): void {
    const subTopic = new Topic(text);
    subTopic.parent = this;
    this.subTopics.push(subTopic);
  }

  deleteSubTopic(subTopicId: string): void {
    this.subTopics = this.subTopics.filter((topic) => topic.id !== subTopicId);
  }

  duplicateSubTopic(subTopicId: string): void {
    const subTopic = this.subTopics.find((topic) => topic.id === subTopicId);
    const newSubTopic = new Topic(subTopic!.text);
    newSubTopic.parent = this;
    this.subTopics.push(newSubTopic);
  }

  changeParentTopic(newParentTopic: Topic): void {
    this.parent!.subTopics = this.parent!.subTopics.filter(
      (topic) => topic.id !== this.id
    );
    newParentTopic.subTopics.push(this);
    this.parent = newParentTopic;
  }

  moveToNewPosition(newPosition: Position): void {
    this.position = newPosition;
  }

  updateTextContent(newText: string): void {
    this.customText.updateContent(newText);
  }

  updateTextColor(color: string): void {
    this.customText.updateTextColor(color);
  }

  updateTextStyle(style: string): void {
    this.customText.updateFontStyle(style);
  }

  updateTextSize(size: number): void {
    this.customText.updateFontSize(size);
  }

  updateFontFamily(fontFamily: string): void {
    this.customText.updateFontFamily(fontFamily);
  }

  changeShapeColor(color: string): void {
    this.shape.updateFillColor(color);
  }

  changeShapeLength(length: number): void {
    this.shape.updateLength(length);
  }

  changeShapeBorder(border: string): void {
    this.shape.updateBorder(border);
  }
}

class SheetFileManager {
  exportSheets(sheetIds: string[], exportType: string): EnumStatus {
    return EnumStatus.Success;
  }

  saveSheetAs(sheetIds: string[]): EnumStatus {
    return EnumStatus.Success;
  }

  importSheet(sheet: Sheet): EnumStatus {
    return EnumStatus.Success;
  }
}

class Shape {
  fillColor: string;
  border: string;
  length: number;

  constructor(fillColor: string, border: string, length: number) {
    this.fillColor = fillColor;
    this.border = border;
    this.length = length;
  }

  updateFillColor(fillColor: string) {
    this.fillColor = fillColor;
  }

  updateBorder(border: string) {
    this.border = border;
  }

  updateLength(length: number) {
    this.length = length;
  }
}

class CustomText {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  textColor: string;

  constructor(
    content: string,
    fontSize: number,
    fontFamily: string,
    fontStyle: string,
    textColor: string
  ) {
    this.content = content;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontStyle = fontStyle;
    this.textColor = textColor;
  }

  updateContent(content: string) {
    this.content = content;
  }

  updateFontSize(fontSize: number) {
    this.fontSize = fontSize;
  }

  updateFontFamily(fontFamily: string) {
    this.fontFamily = fontFamily;
  }

  updateFontStyle(fontStyle: string) {
    this.fontStyle = fontStyle;
  }

  updateTextColor(textColor: string) {
    this.textColor = textColor;
  }
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export { Xmind, Sheet, Topic, Relationship, Position, EnumStatus };
