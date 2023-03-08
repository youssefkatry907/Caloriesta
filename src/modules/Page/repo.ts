import { resTypes } from "../../helpers/responseTypes";
import Page from "./model";

export async function list(query: object = {}) {
  const records = await Page.findOne(query);
  return records;
}

export async function get(id, query: object = {}) {
  if (id) return await isExist(id);
  else {
    return {
      success: false,
      code: 400,
      errors: [
        {
          key: "id",
          value: `id is missed`,
        },
      ],
    };
  }
}

export async function update(id, form: any) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    isFound.record[form["type"]] = form["content"];
    await isFound.record.save();
  }

  return true;
}

async function isExist(id: string) {
  const record = await Page.find({});
  if (record[0]) {
    return {
      success: true,
      record: record[0],
      code: 200,
    };
  } else {
    return {
      code: 404,
      success: false,
      errors: [
        {
          key: "record",
          value: `record not found`,
        },
      ],
    };
  }
}
