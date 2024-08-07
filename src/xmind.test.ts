import { Xmind, Sheet, Topic, Position, EnumStatus } from "./xmind";

describe("Mindmap Application", () => {
  describe("Xmind class", () => {
    let xmind: Xmind;
    let sheet: Sheet;

    beforeEach(() => {
      xmind = new Xmind();
      sheet = xmind.sheets[0];
    });

    it("Sheet creation", () => {
      expect(xmind.sheets.length).toBe(1);
    });

    it("Delete a sheet", () => {
      xmind.deleteSheet(sheet.id);
      expect(xmind.sheets.length).toBe(0);
    });

    it("Duplicate a sheet", () => {
      sheet.rootTopic.subTopics[0].createSubTopic("Sub Topic");
      sheet.createFloatingTopic("Floating Topic");
      sheet.createFloatingTopic("Floating Topic 2");
      xmind.duplicateSheet(sheet.id);

      expect(xmind.sheets.length).toBe(2);
      expect(xmind.sheets[1].rootTopic.subTopics[0].subTopics.length).toBe(1);
      expect(xmind.sheets[1].floatingTopicList.length).toBe(2);
    });
  });

  describe("Sheet class", () => {
    let xmind: Xmind;
    let sheet: Sheet;

    beforeEach(() => {
      xmind = new Xmind();
      sheet = xmind.sheets[0];
    });

    it("Root topic creation", () => {
      expect(sheet.rootTopic.text).toBe("Central Topic");
      expect(sheet.rootTopic.subTopics.length).toBe(4);
    });

    it("Rename a sheet", () => {
      sheet.renameSheet("Sheet 1");
      expect(sheet.name).toBe("Sheet 1");
    });

    it("Create a floating topic", () => {
      sheet.createFloatingTopic("Floating Topic");
      expect(sheet.floatingTopicList.length).toBe(1);
    });

    it("Create relationship", () => {
      let subTopic1Id = sheet.rootTopic.subTopics[0].id;
      let subTopic2Id = sheet.rootTopic.subTopics[1].id;
      sheet.createRelationship(subTopic1Id, subTopic2Id);

      expect(sheet.relationshipList.length).toBe(1);
    });

    it("Delete relationship", () => {
      let subTopic1Id = sheet.rootTopic.subTopics[0].id;
      let subTopic2Id = sheet.rootTopic.subTopics[1].id;
      sheet.createRelationship(subTopic1Id, subTopic2Id);
      sheet.deleteRelationship(sheet.relationshipList[0].id);

      expect(sheet.relationshipList.length).toBe(0);
    });

    it("Rename relationship", () => {
      let subTopic1Id = sheet.rootTopic.subTopics[0].id;
      let subTopic2Id = sheet.rootTopic.subTopics[1].id;
      sheet.createRelationship(subTopic1Id, subTopic2Id);
      sheet.relationshipList[0].renameRelationship("Special Relationship");

      expect(sheet.relationshipList[0].name).toBe("Special Relationship");
    });

    it("Change background color", () => {
      sheet.changeBackgroundColor("blue");
      expect(sheet.backgroundColor).toBe("blue");
    });

    it("Move topic to floating topic", () => {
      let subTopicId = sheet.rootTopic.subTopics[0].id;
      sheet.moveTopicToFloatingTopic(subTopicId);

      expect(sheet.rootTopic.subTopics.length).toBe(3);
      expect(sheet.floatingTopicList.length).toBe(1);
    });
  });

  describe("Topic class", () => {
    let xmind: Xmind;
    let rootTopic: Topic;

    beforeEach(() => {
      xmind = new Xmind();
      rootTopic = xmind.sheets[0].rootTopic;
    });

    it("Add a subtopic into rootnode", () => {
      rootTopic.createSubTopic("Sub Topic");
      expect(rootTopic.subTopics.length).toBe(5);
    });

    it("Add a subtopic into floating node", () => {
      xmind.sheets[0].createFloatingTopic("Floating Topic");
      let floatingTopic = xmind.sheets[0].floatingTopicList[0];
      floatingTopic.createSubTopic("Sub Floating Topic");

      expect(floatingTopic.subTopics.length).toBe(1);
    });

    it("Add a subtopic into subtopic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.createSubTopic("Sub of Sub Topic");

      expect(subTopic.subTopics.length).toBe(1);
    });

    it("Delete a subtopic", () => {
      let subTopicId = rootTopic.subTopics[0].id;
      rootTopic.deleteSubTopic(subTopicId);

      expect(rootTopic.subTopics.length).toBe(3);
    });

    it("Duplicate a subtopic", () => {
      let subTopicId = rootTopic.subTopics[0].id;
      rootTopic.duplicateSubTopic(subTopicId);

      expect(rootTopic.subTopics.length).toBe(5);
    });

    it("Change parent topic", () => {
      let subTopic = rootTopic.subTopics[0];
      let newParentTopic = rootTopic.subTopics[1];
      subTopic.changeParentTopic(newParentTopic);

      expect(newParentTopic.subTopics.length).toBe(1);
      expect(rootTopic.subTopics.length).toBe(3);
    });

    it("Move topic to another position", () => {
      rootTopic.moveToNewPosition(new Position(100, 100));

      expect(rootTopic.position.x).toBe(100);
      expect(rootTopic.position.y).toBe(100);
    });

    it("Update text content of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateTextContent("Main topic");

      expect(subTopic.customText.content).toBe("Main topic");
    });

    it("Update text color of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateTextColor("red");

      expect(subTopic.customText.textColor).toBe("red");
    });

    it("Update font style of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateTextStyle("bold");

      expect(subTopic.customText.fontStyle).toBe("bold");
    });

    it("Update font family of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateFontFamily("Arial");

      expect(subTopic.customText.fontFamily).toBe("Arial");
    });

    it("Update font size of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateTextSize(20);

      expect(subTopic.customText.fontSize).toBe(20);
    });

    it("Change shape of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeShapeColor("red");

      expect(subTopic.shape.fillColor).toBe("red");
    });

    it("Change shape length", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeShapeLength(100);

      expect(subTopic.shape.length).toBe(100);
    });

    it("Change shape border", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeShapeBorder("dotted");

      expect(subTopic.shape.border).toBe("dotted");
    });
  });

  describe("SheetFileManager class", () => {
    let xmind: Xmind;

    beforeEach(() => {
      xmind = new Xmind();
    });

    it("Export to image", () => {
      xmind.addNewSheet();
      let sheetId1 = xmind.sheets[0].id;
      let sheetId2 = xmind.sheets[1].id;
      let status = xmind.sheetFileManager.exportSheets(
        [sheetId1, sheetId2],
        "img"
      );

      expect(status).toBe(EnumStatus.Success);
    });

    it("Save sheets", () => {
      xmind.addNewSheet();
      let sheetId1 = xmind.sheets[0].id;
      let sheetId2 = xmind.sheets[1].id;
      let status = xmind.sheetFileManager.saveSheetAs([sheetId1, sheetId2]);

      expect(status).toBe(EnumStatus.Success);
    });
    it("Import from file", () => {
      let status = xmind.sheetFileManager.importSheet(xmind.sheets[0]);

      expect(status).toBe(EnumStatus.Success);
    });
  });
});
