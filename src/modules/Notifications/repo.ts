import Notification from "./model"

//Create, get, list

export async function create(form: any) {
    form.date = new Date(Date.now())
    const newRecord = await new Notification(form);
    await newRecord.save();
    return {
        success: true,
        record: newRecord,
        code: 200,
    };
}


export async function list(query: object = {}) {
    const limitValue = 10;
    const skipValue = 0;

    const records = await Notification.find(query)
        .limit(limitValue).skip(skipValue).sort({ "date": -1 });
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

export async function remove(id) {
    const isFound = await isExist(id);
    if (isFound.success) {
        await isFound.record.remove();
    }
}

async function isExist(id: string) {
    const record = await Notification.findOne({ _id: id });
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