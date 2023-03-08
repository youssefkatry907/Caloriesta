import Programme from "./model";

export async function list(query: object = {}) {
  const records = await Programme.find(query);
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

export async function create(form: any) {
  if (await isNameDuplicate(form["code"])) {
    return {
      success: false,
      code: 400,
      errors: [
        {
          key: "code",
          value: `${form["code"]} already taken`,
        },
      ],
    };
  } else {
    const newRecord = new Programme(form);

    return {
      success: true,
      record: newRecord,
      code: 200,
    };
  }
}

export async function update(id, form: any) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Programme.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Programme.deleteOne({ _id: id });
  }
  return isFound;
}

async function isNameDuplicate(code: string) {
  const record = await Programme.findOne({ code: code });
  return record;
}

async function isExist(id: string) {
  const record = await Programme.findOne({ _id: id });
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
