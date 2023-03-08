import City from "./model";

export async function list(query: object = {}) {
  const records = await City.find(query);
  return records;
}

export async function get(value, type: string = "_id") {
  if (value) return await isExist(value, type);
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
  if (await isNameDuplicate(form["name"])) {
    return {
      success: false,
      code: 400,
      errors: [
        {
          key: "name",
          value: `${form["name"]} already taken`,
        },
      ],
    };
  } else {
    const newRecord = new City(form);

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
    await City.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await City.deleteOne({ _id: id });
  }
  return isFound;
}

async function isNameDuplicate(name: string) {
  const record = await City.findOne({ name: name });
  return record;
}

async function isExist(value: string, type: string = "_id") {
  const record = await City.findOne({ [type]: value });
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
