class Xmind {
  sheets: Sheet[];

  constructor() {
    this.sheets = [];
    this.sheets.push(new Sheet(`Sheet 1`));
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
    const newSheet = new Sheet(`${sheet.name} - Copy`);
    this.sheets.push(newSheet);
    return newSheet;
  }
}

class Sheet {
  name: string;
  rootTopic: Topic;
  floatingTopicList: Topic[];

  constructor(name: string) {
    this.name = name;
    this.rootTopic = new Topic("Central Topic");
    this.rootTopic.subTopics = [
      new Topic("Subtopic 1"),
      new Topic("Subtopic 2"),
      new Topic("Subtopic 3"),
      new Topic("Subtopic 4"),
    ];
    this.floatingTopicList = [];
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
}

class Topic {
  id: string;
  text: string;
  subTopics: Topic[];
  parent: Topic | null;
  relationships: Relationship[];
  shapeColor: string;
  shapeLength: number;
  textColor: string;
  textStyle: string;

  constructor(text: string) {
    this.id = this.generateId();
    this.text = text;
    this.subTopics = [];
    this.parent = null;
    this.relationships = [];
    this.shapeColor = "";
    this.shapeLength = 0;
    this.textColor = "";
    this.textStyle = "";
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
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

  updateText(newText: string): void {
    this.text = newText;
  }

  createRelationship(topicId: string): void {
    const relationship = new Relationship(topicId);
    this.relationships.push(relationship);
  }

  deleteRelationship(relationshipId: string): void {
    this.relationships = this.relationships.filter(
      (rel) => rel.id !== relationshipId
    );
  }

  changeShapeColor(color: string): void {
    this.shapeColor = color;
  }

  changeShapeLength(length: number): void {
    this.shapeLength = length;
  }

  changeTextColor(color: string): void {
    this.textColor = color;
  }

  changeTextStyle(style: string): void {
    this.textStyle = style;
  }
}

class Relationship {
  id: string;
  topicId: string;
  name: string;

  constructor(topicId: string) {
    this.id = this.generateId();
    this.topicId = topicId;
    this.name = "";
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  renameRelationship(newName: string): void {
    this.name = newName;
  }
}

export { Xmind, Sheet, Topic, Relationship };
