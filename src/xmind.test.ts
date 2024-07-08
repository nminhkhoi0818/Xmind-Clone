import { Xmind, Sheet, Topic, Position } from "./xmind";

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
      xmind.deleteSheet(sheet);
      expect(xmind.sheets.length).toBe(0);
    });

    it("Duplicate a sheet", () => {
      sheet = xmind.addNewSheet();
      let sheet2 = xmind.duplicateSheet(sheet);
      expect(sheet2.name).toBe("Sheet 2 - Copy");
    });

    it("Import a sheet", () => {
      let status = xmind.sheets[0].importSheet("file.xmind");
      expect(status).toBe(true);
    });

    it("Export a sheet", () => {
      let status = xmind.sheets[0].exportSheet("pdf");
      expect(status).toBe(true);
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
      let relationshipId = sheet.createRelationship(subTopic1Id, subTopic2Id);
      sheet.deleteRelationship(relationshipId);

      expect(sheet.relationshipList.length).toBe(0);
    });

    it("Change background color", () => {
      sheet.changeBackgroundColor("blue");
      expect(sheet.backgroundColor).toBe("blue");
    });

    it("Save sheet as", () => {
      let status = sheet.saveSheetAs("file.xmind");
      expect(status).toBe(true);
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
});