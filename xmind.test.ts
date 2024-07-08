import { Xmind, Sheet, Topic } from "./xmind";

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
  });

  describe("Topic class", () => {
    let xmind: Xmind;
    let rootTopic: Topic;

    beforeEach(() => {
      xmind = new Xmind();
      rootTopic = xmind.sheets[0].rootTopic;
    });

    it("should add a subtopic", () => {
      rootTopic.createSubTopic("Sub Topic");
      expect(rootTopic.subTopics.length).toBe(5);
    });

    it("should delete a subtopic", () => {
      let subTopicId = rootTopic.subTopics[0].id;

      rootTopic.deleteSubTopic(subTopicId);
      expect(rootTopic.subTopics.length).toBe(3);
    });

    it("should duplicate a subtopic", () => {
      let subTopicId = rootTopic.subTopics[0].id;
      rootTopic.duplicateSubTopic(subTopicId);

      expect(rootTopic.subTopics.length).toBe(5);
    });

    it("should change parent topic", () => {
      let subTopic = rootTopic.subTopics[0];
      let newParentTopic = rootTopic.subTopics[1];
      subTopic.changeParentTopic(newParentTopic);

      expect(newParentTopic.subTopics.length).toBe(1);
      expect(rootTopic.subTopics.length).toBe(4);
    });

    it("update text topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.updateText("Main topic");

      expect(subTopic.text).toBe("Main topic");
    });

    it("should create relationship", () => {
      let subTopic1 = rootTopic.subTopics[0];
      subTopic1.createRelationship(rootTopic.subTopics[1].id);

      expect(subTopic1.relationships.length).toBe(1);
    });

    it("should delete relationship", () => {
      let subTopic1 = rootTopic.subTopics[0];
      let subTopic2 = rootTopic.subTopics[1];

      subTopic1.createRelationship(subTopic2.id);
      let relationshipId = subTopic1.relationships[0].id;

      subTopic1.deleteRelationship(relationshipId);
      expect(subTopic1.relationships.length).toBe(0);
    });

    it("should rename relationship", () => {
      let subTopic1 = rootTopic.subTopics[0];
      let subTopic2 = rootTopic.subTopics[1];

      subTopic1.createRelationship(subTopic2.id);
      let relationship = subTopic1.relationships[0];

      relationship.renameRelationship("New Relationship");
      expect(relationship.name).toBe("New Relationship");
    });

    it("should change shape of topic", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeShapeColor("red");

      expect(subTopic.shapeColor).toBe("red");
    });

    it("should change shape length", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeShapeLength(100);

      expect(subTopic.shapeLength).toBe(100);
    });

    it("should topic text color", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeTextColor("red");

      expect(subTopic.textColor).toBe("red");
    });

    it("should topic text style", () => {
      let subTopic = rootTopic.subTopics[0];
      subTopic.changeTextStyle("bold");

      expect(subTopic.textStyle).toBe("bold");
    });
  });
});
