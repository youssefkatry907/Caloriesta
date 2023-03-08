import { encrypt } from "../../utilities/encrypt";
import { handleUsername } from "../../helpers/username";
import User, { IUser } from "./model";

export async function list(query: object = {}, cp = null, options = {}) {
  const records = await User.find(query, cp, options).populate(
    "industry"
  );
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
  let availableParams = [];

  if (form["email"])
    availableParams.push({ email: form["email"].toLowerCase() });
  if (form["phone"]) availableParams.push({ phone: form["phone"] });
  if (form["username"])
    availableParams.push({ username: handleUsername(form["username"]) });

  const duplicated = await isParamsDuplicate({
    $or: availableParams,
  });

  if (duplicated) {
    return {
      success: false,
      code: 409,
      errors: [
        {
          key: "error",
          value: `email or phone already taken`,
        },
      ],
    };
  } else {
    form.hashedPassword = await encrypt(form.password);

    try {
      const newRecord = new User(form);
      await newRecord.save();

      return {
        success: true,
        record: newRecord,
        code: 200,
      };
    } catch (err) {
      return {
        success: false,
        errors: err,
        code: 400,
      };
    }
  }
}

export async function update(id, form: any) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    if (form.password) form.hashedPassword = await encrypt(form.password);
    await User.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) await User.deleteOne({ _id: id });

  return isFound;
}

async function isParamsDuplicate(query: any) {
  const record = await User.findOne(query);
  return record;
}

async function isExist(id: string) {
  let record: IUser = await User.findOne({ _id: id }).populate({
    path: "",
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

export async function customQuery(
  matchQuery?: object,
  lookup?: object,
  unwind?: string,
  project?: object,
  limit?: number,
  sort?: object
) {
  let queries = [];

  if (matchQuery) queries.push({ $match: matchQuery });
  if (lookup) queries.push({ $lookup: lookup });
  if (unwind) queries.push({ $unwind: unwind });
  if (limit)
    queries.push({
      $limit: limit,
    });
  if (sort)
    queries.push({
      $sort: sort,
    });
  if (project) queries.push({ $project: project });

  const result = await User.aggregate(queries);

  return result;
}
