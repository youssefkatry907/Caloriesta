import Message from "./model";

export async function list(query: object = {}) {
  const records = await Message.find(query);
  return records;
}

export async function get(id) {
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
    await Message.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (isFound.success) {
    await isFound.record.remove();
  }
}

async function isExist(id: string) {
  const record = await Message.findOne({ _id: id });
  if (record) {
    return {
      success: true,
      record: record,
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
