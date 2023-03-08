import Cart from "./model";

export async function list(query: object = {}) {
  const records = await Cart.find(query);
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
  try {
    const newRecord = new Cart(form);
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
      code: 200,
    };
  }
}

export async function update(id, form: any) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await Cart.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}

export async function flush(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    isFound.record.items = [];
    await isFound.record.save();
  }
  return isFound;
}

async function isExist(id: string) {
  const record = await Cart.findOne({ _id: id }).populate({
    path: "items.product resturant",
    select:
      "name image fullName avatar type calories quantity price finalPrice discount",
  });
  if (record) {
   // console.log("repo of : ",record);
    
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
