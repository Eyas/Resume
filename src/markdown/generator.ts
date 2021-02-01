import { RenderDateRange } from "../render/render";
import {
  Resume,
  Category,
  EntityInvolvements,
  Involvement,
  SortEntitiesDescending,
} from "../core/resume";

export function toMarkdown(resume: Resume): string {
  resume.categories.forEach((category) =>
    SortEntitiesDescending(category.entities)
  );

  var file: string = "";
  file +=
    resume.person.name +
    "\n" +
    Array(resume.person.name.length + 1).join("=") +
    "\n\n";
  file += resume.categories.map(categoryToMarkdown).join("\n\n");
  file += "\n";
  return file;
}

function categoryToMarkdown(category: Category): string {
  var str =
    category.name + "\n" + Array(category.name.length + 1).join("-") + "\n\n";
  str += category.entities.map(entityToMarkdown).join("\n\n");
  return str;
}

function entityToMarkdown(entity: EntityInvolvements): string {
  var str = "## " + entity.entity + "\n";
  if (entity.location) str += entity.location + "\n";
  if (entity.entityDescription) str += entity.entityDescription + "\n";
  if (entity.location || entity.entityDescription) str += "\n";
  str += entity.involvements.map(involvementToMarkdown).join("\n\n");
  return str;
}

function involvementToMarkdown(involvement: Involvement): string {
  var str =
    "### " + involvement.title + "\n" + RenderDateRange(involvement.dates);
  if (involvement.description || involvement.properties) {
    str += "\n";
    if (involvement.description) str += involvement.description;
    if (involvement.properties) {
      str += involvement.properties
        .map((prop) => "**" + prop.name + "**: " + prop.value)
        .join("; ");
    }
  }
  if (involvement.accomplishments) {
    str +=
      "\n" + involvement.accomplishments.map((acc) => "* " + acc).join("\n");
  }
  if (involvement.lists) {
    str +=
      "\n\n" +
      involvement.lists
        .map((sublist) => {
          return (
            "#### " +
            sublist.name +
            "\n" +
            sublist.list.map((item) => "* " + item).join("\n")
          );
        })
        .join("\n\n");
  }
  return str;
}
