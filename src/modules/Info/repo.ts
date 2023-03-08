import { resTypes } from "../../helpers/responseTypes";
import { encrypt } from "../../utilities/encrypt";
import Info from "./model";

export async function get() {
  const info = await Info.find();
  return {
    settings: info[0].info(),
  };
}

export async function update(form: any) {
  const isFound = await get();
  console.log(isFound);

  if (form.password) form.password = await encrypt(form.password);
  try {
    await Info.updateOne({ _id: isFound.settings._id }, form, {
      runValidators: true,
    });

    const updatedRecord = await get();
    return updatedRecord;
  } catch (err) {
    console.log(err);
  }
}
