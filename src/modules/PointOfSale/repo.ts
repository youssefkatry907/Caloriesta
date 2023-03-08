import PointOfSale from "./model";
import Meal from "../Meal/model";

export async function list(query: object = {}) {
  const records = await PointOfSale.find(query);
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
    const newRecord = new PointOfSale(form);

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
    await PointOfSale.updateOne({ _id: id }, form, {
      runValidators: true,
    });
  }

  const updatedRecord = await isExist(id);
  return updatedRecord;
}


export async function remove(id) {
  const isFound = await isExist(id);
  if (id && isFound.success) {
    await PointOfSale.deleteOne({ _id: id });
  }
  return isFound;
}


export async function addMeal(pointId, mealId){
  const isPointFound = await isExist(pointId);
  const isMealFound = await Meal.find({ _id: mealId });

  if (pointId && isPointFound.success && mealId && isMealFound) {
    if((isPointFound.record.meals).includes(mealId)){
      return {
        code: 400,
        success: false,
        errors: [
          {
            key: "meal",
            value: `meal already exist`,
          },
        ],
      };
    }
    else{
      await PointOfSale.updateOne({ _id: pointId }, {"$push": { meals: mealId }}, {
        runValidators: true,
      });
    }
    
  }

  const updatedRecord = await isExist(pointId);
  return updatedRecord;
}


export async function removeMeal(pointId, mealId){
  const isPointFound = await isExist(pointId);
  const isMealFound = await Meal.find({ _id: mealId });

  if (pointId && isPointFound.success && mealId && isMealFound) {
    if((isPointFound.record.meals).includes(mealId)){
      await PointOfSale.updateOne({ _id: pointId }, {"$pull": { meals: mealId }}, {
        runValidators: true,
      });
    }else {
      return {
        code: 404,
        success: false,
        errors: [
          {
            key: "meal",
            value: `meal not found`,
          },
        ],
      };
    }
    
  }

  const updatedRecord = await isExist(pointId);
  return updatedRecord;
}


async function isNameDuplicate(name: string) {
  const record = await PointOfSale.findOne({ name: name });
  return record;
}


async function isExist(id: string) {
  const record = await PointOfSale.findOne({ _id: id });
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
