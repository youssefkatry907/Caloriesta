import User from "../modules/User/model";
import { generateToken } from "../helpers/jwt";
import { resTypes } from "../helpers/responseTypes";
import { create, update, get } from "../modules/User/repo";
import {
  create as createAddress, update as updateUserAddress,
  get as getUserAddress, remove as removeUserAddress
}
  from "../modules/User/helpers/address"
import { encrypt, makeId } from "../utilities/encrypt";
import {
  isValidAppUsersTypes,
  validateConsultant,
  validateCustomer,
} from "../modules/User/validate";
import upload from "../helpers/upload";
import fs from "fs";
//import { remove } from "../modules/Package/repo";

export async function login(req, res) {
  const user = await User.isExist(req.body.auth);

  if (
    req.body.auth &&
    req.body.auth.length > 2 &&
    user &&
    (await user.authenticate(req.body.password))
  ) {
    res.status(200).json(
      resTypes(200, {
        customer: {
          ...user.info(),
          token: generateToken({
            _id: user._id,
            email: user.email,
            type: user.type,
            role: user.role,
          }),
        },
      })
    );
  } else {
    res.status(401).json(
      resTypes(401, {
        errors: [
          {
            key: "error",
            value: "auth or password not correct",
          },
        ],
      })
    );
  }
}

export async function register(req, res) {
  if (
    isValidAppUsersTypes(req.body.type, res) &&
    validateConsultant(req.body, res) &&
    validateCustomer(req.body, res)
  ) {
    let customer = await create(req.body);

    if (customer.success) {
      try {
        res.json(
          resTypes(200, {
            record: {
              ...customer.record.info(),
              token: customer.record.token(),
            },
          })
        );
      } catch (err) {
        console.log("error", err);
        res
          .status(customer.code)
          .json(resTypes(customer.code, { errors: customer.errors }));
      }
    } else
      res
        .status(customer.code)
        .json(resTypes(customer.code, { errors: customer.errors }));
  }
}

export async function updateInfo(req, res) {
  if (isValidAppUsersTypes(req.body.type, res)) {
    const customer = await update(req.body.user._id, req.body);

    if (customer.success)
      res.json(
        resTypes(201, {
          record: {
            ...customer.record.info(),
            token: customer.record.token(),
          },
        })
      );
    else
      res
        .status(customer.code)
        .json(resTypes(customer.code, { errors: customer.errors }));
  }
}

export async function getInfo(req, res) {
  const customer = await get(req.body.user._id);

  if (customer.success) {
    res.json(
      resTypes(200, {
        record: {
          ...customer.record.info(),
          token: customer.record.token(),
        },
      })
    );
  } else
    res
      .status(customer.code)
      .json(resTypes(customer.code, { errors: customer.errors }));
}

export async function getResetCode(req, res) {
  const customer = await User.isExist(req.body.auth);

  if (customer) {
    const resetCode = makeId(5);
    customer.resetCode = resetCode;

    await customer.save();

    res.json(
      resTypes(200, {
        record: {
          ...customer.info(),
          token: customer.token(),
        },
        resetCode,
      })
    );
  } else res.status(400).json(resTypes(404));
}

export async function validateResetCode(req, res) {
  const customer = await User.isExist(req.body.auth);

  if (customer && customer.resetCode === req.body.resetCode) {
    res.json(
      resTypes(200, {
        message: "Reset code is correct, you can now reset password",
      })
    );
  } else
    res.status(400).json(
      resTypes(400, {
        errors: {
          key: "resetCode",
          message: "reset code not valid",
        },
      })
    );
}

export async function resetPassword(req, res) {
  const customer = await User.isExist(req.body.auth);

  if (customer && customer.resetCode === req.body.resetCode) {
    req.body.password
      ? (customer.hashedPassword = await encrypt(req.body.password))
      : res.status(400).json(
        resTypes(400, {
          errors: {
            key: "password",
            message: "password not valid",
          },
        })
      );

    customer
      .save()
      .then(() =>
        res.json(
          resTypes(200, {
            message: "password reseted successfully",
          })
        )
      )
      .catch((errors) =>
        res.status(400).json(
          resTypes(400, {
            errors,
          })
        )
      );
  } else
    res.status(400).json(
      resTypes(400, {
        errors: {
          key: "resetCode",
          message: "reset code not valid",
        },
      })
    );
}

export async function updateFiles(req, res) {
  const customer = await get(req.body.user._id);

  if (customer.success) {
    upload(`users/${customer.record.username}`).parse(
      req,
      async (err, fields, files) => {
        if (err) {
          console.log(err);
        }

        const params = [
          "cover",
          "avatar",
          "professionCertificate",
          "commercialRegister",
          "taxCard",
        ];

        params.map((param: string) => {
          if (files[param]) {
            // delete old file
            if (customer.record[param]) {
              try {
                fs.unlinkSync(`./${customer.record[param]}`);
              } catch (err) {
                console.log("can't remove file", err);
              }
            }
            customer.record[param] = files[param].path;
          }
        });

        await customer.record.save();

        res.json(
          resTypes(201, {
            record: {
              ...customer.record.info(),
              token: customer.record.token(),
            },
          })
        );
      }
    );
  } else res.status(400).json(resTypes(404));
}

//addresses
export async function addAddress(req, res) {
  const customer = req.params.id;
  let address = await createAddress(req.body, customer);
  if (customer) {
    if (address.success) {
      try {
        res.json(
          resTypes(201, { customer })
        )
      }
      catch (err) {
        console.log("error", err);
        res
          .status(address.code)
          .json(resTypes(address.code, { errors: address.errors }));
      }
    }
    else
      res.status(address.code).json(resTypes(address.code, { errors: address.errors }));
  }
}

export async function getAddress(req, res) {
  const user = await getUserAddress(req.params.id);

  if (user) {
    res.json(
      resTypes(200, { address: user.record.addresses })
    );
  } else
    res.status(user.code).json(resTypes(user.code, { errors: user.errors }));
}
// Check the package repo
export async function removeAddress(req, res) {
  if (req.params.id && req.params.index) {
    const newAddresses = await removeUserAddress(req.params.id, req.params.index);
    res.status(200).json(
      resTypes(200, {
        message: `address has been removed`,
        addresses: newAddresses.addresses
      })
    );
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `address not found`,
      })
    );
  }
}

export async function updateAddress(req, res) {
  const newAddress = await updateUserAddress(req.params.id, req.params.index, req.body);

  if (newAddress.success)
    res.json(
      resTypes(201)
    );
  else
    res.status(newAddress.code)
      .json(resTypes(newAddress.code, { errors: newAddress.errors }));
}