import User, { IUser } from "../model";


export async function get(id, query: object = {}) {
    if (id) {
        const address = await isExist(id);
        if (address.success) return address;
    }

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

export async function create(form: any, id) {
    if (id) {
        const user = await isExist(id);
        if (user.success) {
            const isDuplicated = await isParamsDuplicate({
                addresses: {
                    $elemMatch: form
                }
            })
            if (isDuplicated) {
                //console.log(isDuplicated);
                return {
                    success: false,
                    code: 409,
                    errors: [
                        {
                            key: "error",
                            value: `address already exist`,
                        },
                    ],
                };
            }
            else {
                console.log(form);
                const address = await User.findOneAndUpdate(
                    { _id: id },
                    { $push: { addresses: form.addresses } }
                );
                if (address) {
                    //console.log(address)
                    return {
                        success: true,
                        code: 201,
                    };
                }
            }
        }
    }

}

export async function update(id, index, form) {
    const user = await isExist(id);
    const addressLength = user.record.addresses.length;
    let addresses = user.record.addresses;
    if (id && user.success) {
        // Check if the index is not out of range
        if (index <= addressLength) {

            // find address by index and update it
            addresses[index] = form.addresses;
            console.log(addresses)
            const address = await
                User.findOneAndUpdate({ _id: id }, { addresses });
            if (address) {

                return {
                    success: true,
                    code: 201,
                    address,
                };
            }
            else {
                return {
                    success: false,
                    code: 409,
                    errors: [
                        {
                            key: "adress",
                            value: `address not found`,
                        },
                    ],
                };
            }
        } else {
            return {
                success: false,
                code: 400,
                errors: [
                    {
                        key: "error",
                        value: `This index is out of range`,
                    },
                ],
            };
        }
    } else {
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

export async function remove(id, index) {
    const user = await isExist(id);
    const addressLength = user.record.addresses.length;
    let addresses = user.record.addresses;
    if (id && user.success) {
        // Check if the index is not out of range
        if (index <= addressLength) {
            addresses.splice(index, 1);
            await User.findOneAndUpdate(
                { _id: id }, { addresses }
            )
            return {
                success: true,
                code: 201,
                addresses
            };
        } else {
            return {
                success: false,
                code: 409,
                errors: [
                    {
                        key: "error",
                        value: `This index is out of range`,
                    },
                ],
            };
        }
    } else {
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
