import Category from "./model";

export async function list(query: object = {}) {
  const records = await Category.find(query).populate({
    path: "subCategories",
    select: "name cover",
  });
  return records;
}

export async function get(id, query: object = {}) {
  if (id) return await isExist(id, query);
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
    const newRecord = new Category(form);

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
    await Category.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Category.deleteOne({ _id: id });
  }
  return isFound;
}

async function isNameDuplicate(name: string) {
  const record = await Category.findOne({ name: name });
  return record;
}

async function isExist(value: string, query = {}) {
  const record = await Category.findOne({ _id: value, ...query }).populate({
    path: "subCategories parent",
    select: "name cover sort",
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
