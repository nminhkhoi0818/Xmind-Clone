class Xmind {
  sheets: Sheet[];

  constructor() {
    this.sheets = [];
    this.createDefaultSheet();
  }

  createDefaultSheet(): void {
    let sheet = new Sheet("Sheet 1", new Topic("Central Topic"));
    sheet.rootTopic.createSubTopic("Subtopic 1");
    sheet.rootTopic.createSubTopic("Subtopic 2");
    sheet.rootTopic.createSubTopic("Subtopic 3");
    sheet.rootTopic.createSubTopic("Subtopic 4");
    this.sheets.push(sheet);
  }

  addNewSheet(): Sheet {
    const newSheet = new Sheet(`Sheet ${this.sheets.length + 1}`);
    this.sheets.push(newSheet);
    return newSheet;
  }

  deleteSheet(sheet: Sheet): void {
    this.sheets = this.sheets.filter((s) => s !== sheet);
  }

  duplicateSheet(sheet: Sheet): Sheet {
    const copySheet = new Sheet(
      `${sheet.name} - Copy`,
      sheet.rootTopic,
      sheet.floatingTopicList,
      sheet.relationshipList
    );
    this.sheets.push(copySheet);
    return copySheet;
  }
}

class Sheet {
  name: string;
  rootTopic: Topic;
  floatingTopicList: Topic[];
  relationshipList: Relationship[];
  backgroundColor: string;

  constructor(
    name: string,
    rootTopic: Topic = new Topic(""),
    floatingTopicList: Topic[] = [],
    relationshipList: Relationship[] = [],
    backgroundColor: string = "white"
  ) {
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

  importSheet(importType: string): boolean {
    return true;
  }

  exportSheet(exportType: string): boolean {
    return true;
  }

  createRelationship(fromTopicId: number, toTopicId: number): void {
    const relationship = new Relationship(fromTopicId, toTopicId);
    this.relationshipList.push(relationship);
  }

  deleteRelationship(relationshipId: number): void {
    this.relationshipList = this.relationshipList.filter(
      (relationship) => relationship.id !== relationshipId
    );
  }

  changeBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }
}

class Relationship {
  static nextId: number = 1;
  id: number;
  fromTopicId: number;
  toTopicId: number;
  name: string;

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
  static nextId: number = 1;
  id: number;
  text: string;
  subTopics: Topic[];
  parent: Topic | null;
  shape: Shape;
  customText: CustomText;

  constructor(text: string) {
    this.id = Topic.nextId++;
    this.text = text;
    this.subTopics = [];
    this.parent = null;
    this.shape = new Shape("white", "black", 100);
    this.customText = new CustomText(text, 12, "Arial", "normal", "black");
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
    } else {
      throw new Error("Subtopic not found");
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

export { Xmind, Sheet, Topic, Relationship };
