import Chat from "./model";

export async function list(query: object = {}) {
    const records = await Chat.find(query);
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

export async function create(form: any) {
    const newRecord = await new Chat(form);
     await newRecord.save();
    return {
        success: true,
        record: newRecord,
        code: 200,
    };
}

export async function remove(id) {
    const isFound = await isExist(id);
    if (isFound.success) {
        await Chat.findByIdAndDelete({ _id: isFound.record._id })
    }
}

async function isExist(id: string) {
    const record = await Chat.findOne({ _id: id });
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