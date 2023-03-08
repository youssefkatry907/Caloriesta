import { isValidObjectId } from "mongoose";
import { handleName } from "./helpers/handleName";
import { handlePrice } from "./helpers/handlePrice";
import Meal from "./model";

export async function list(query: object = {}, cp = null, options = {}) {
  const records = await Meal.find(query, cp, options).populate({
    path: "category resturant",
    select: "name avatar fullName",
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
    form;
    if (form.discount) form = handlePrice(form);
    form.stringQuery = handleName(form);
    const newRecord = await new Meal(form);

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
    form.stringQuery = handleName(form);
    if (form.discount) form = handlePrice(form);
    await Meal.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Meal.deleteOne({ _id: id });
  }
  return isFound;
}

async function isNameDuplicate(name: string) {
  const record = await Meal.findOne({ name: name });
  return record;
}

async function isExist(value: string) {
  const type = isValidObjectId(value) ? "_id" : "slug";

  const record = await Meal.findOne({ [type]: value }).populate({
    path: "category rates.user resturant",
    select: "name avatar rate fullName username",
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
