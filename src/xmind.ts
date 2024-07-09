import { defaultConfig } from "./mindmapConfig";

enum Status {
  Success = "Success",
  Failure = "Failure",
}

class Xmind {
  sheets: Sheet[];

  constructor() {
    this.sheets = [];
    this.createDefaultMindmap();
  }

  createDefaultMindmap(): Sheet {
    let sheet = new Sheet(
      `Sheet ${this.sheets.length + 1}`,
      new Topic(defaultConfig.rootTopic.name)
    );
    const mainTopics = defaultConfig.mainTopics;
    mainTopics.forEach((mainTopicName) => {
      sheet.rootTopic.createSubTopic(mainTopicName);
    });
    sheet.backgroundColor = defaultConfig.sheet.backgroundColor;
    this.sheets.push(sheet);
    return sheet;
  }

  addNewSheet(): Sheet {
    const newSheet = this.createDefaultMindmap();
    return newSheet;
  }

  deleteSheet(sheetId: number): void {
    this.sheets = this.sheets.filter((s) => s.id !== sheetId);
  }

  duplicateSheet(sheetId: number): Sheet {
    const sheet = this.sheets.find((s) => s.id === sheetId);
    if (!sheet) return new Sheet("");
    const copySheet = new Sheet(
      `${sheet.name} - Copy`,
      sheet.rootTopic,
      sheet.floatingTopicList,
      sheet.relationshipList,
      sheet.backgroundColor
    );
    this.sheets.push(copySheet);
    return copySheet;
  }

  getFirstSheet(): Sheet {
    return this.sheets[0];
  }
}

class Sheet {
  id: number;
  name: string;
  rootTopic: Topic;
  floatingTopicList: Topic[];
  relationshipList: Relationship[];
  backgroundColor: string;
  private static nextId: number = 1;

  constructor(
    name: string,
    rootTopic: Topic = new Topic(""),
    floatingTopicList: Topic[] = [],
    relationshipList: Relationship[] = [],
    backgroundColor: string = "white"
  ) {
    this.id = Sheet.nextId++;
    this.name = name;
    this.rootTopic = rootTopic;
    this.floatingTopicList = floatingTopicList;
    this.relationshipList = relationshipList;
    this.backgroundColor = backgroundColor;
  }

  renameSheet(newName: string): void {
    this.name = newName;
  }

  createFloatingTopic(name: string): void {
    const floatingTopic = new Topic(name);
    this.floatingTopicList.push(floatingTopic);
  }

  createRelationship(fromTopicId: number, toTopicId: number): number {
    const newRelationship = new Relationship(fromTopicId, toTopicId);
    this.relationshipList.push(newRelationship);
    return newRelationship.id;
  }

  deleteRelationship(relationshipId: number): void {
    this.relationshipList = this.relationshipList.filter(
      (relationship) => relationship.id !== relationshipId
    );
  }

  changeBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  moveTopicToFloatingTopic(topicId: number): void {
    const topic = this.rootTopic.subTopics.find(
      (topic) => topic.id === topicId
    );
    if (!topic) throw new Error("Topic not found");
    this.floatingTopicList.push(topic);
    topic.parent?.deleteSubTopic(topicId);
  }
}

class SheetManager {
  importSheet(fileName: string): Status {
    return Status.Success;
  }

  exportSheet(sheetId: number, exportType: string): Status {
    return Status.Success;
  }

  saveSheetAs(sheetId: number, fileName: string): Status {
    return Status.Success;
  }
}

class Relationship {
  id: number;
  fromTopicId: number;
  toTopicId: number;
  name: string;
  private static nextId: number = 1;

  constructor(fromTopicId: number, toTopicId: number) {
    this.id = Relationship.nextId++;
    this.fromTopicId = fromTopicId;
    this.toTopicId = toTopicId;
    this.name = "Relationship";
  }

  renameRelationship(newName: string): void {
    this.name = newName;
  }
}

class Topic {
  id: number;
  text: string;
  subTopics: Topic[];
  parent: Topic | null;
  shape: Shape;
  customText: CustomText;
  position: Position;
  private static nextId: number = 1;

  constructor(text: string) {
    this.id = Topic.nextId++;
    this.text = text;
    this.subTopics = [];
    this.parent = null;
    this.shape = new Shape("white", "black", 100);
    this.customText = new CustomText(text, 12, "Arial", "normal", "black");
    this.position = new Position(0, 0);
  }

  createSubTopic(text: string): void {
    const subTopic = new Topic(text);
    subTopic.parent = this;
    this.subTopics.push(subTopic);
  }

  deleteSubTopic(subTopicId: number): void {
    this.subTopics = this.subTopics.filter((topic) => topic.id !== subTopicId);
  }

  duplicateSubTopic(subTopicId: number): void {
    const subTopic = this.subTopics.find((topic) => topic.id === subTopicId);
    if (subTopic) {
      const newSubTopic = new Topic(`${subTopic.text} - Copy`);
      newSubTopic.parent = this;
      this.subTopics.push(newSubTopic);
    }
  }

  changeParentTopic(newParentTopic: Topic): void {
    if (this.parent) {
      this.parent.subTopics = this.parent.subTopics.filter(
        (topic) => topic.id !== this.id
      );
    }
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

export { Xmind, Sheet, Topic, Relationship, Position, Status, SheetManager };
