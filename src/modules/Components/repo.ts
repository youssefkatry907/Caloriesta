import Component from "./model";

export async function list(query: object = {}) {
  const records = await Component.find(query);
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

async function isExist(id: string) {
  const record = await Component.findOne({ _id: id });
  if (record) {
    return {
      success: true,
      record,
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
