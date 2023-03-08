import Package from "./model";

export async function list(query: object = {}) {
  const records = await Package.find(query).populate({
    path: "cities.city",
    select: "name code currency",
  });
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
    const newRecord = new Package(form);

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
    await Package.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Package.deleteOne({ _id: id });
  }
  return isFound;
}

async function isNameDuplicate(name: string) {
  const record = await Package.findOne({ name: name });
  return record;
}

async function isExist(id: string) {
  const record = await Package.findOne({ _id: id }).populate({
    path: "cities.city",
    select: "name",
  });
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
