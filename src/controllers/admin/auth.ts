import User from "../../modules/User/model";
import { generateToken } from "../../helpers/jwt";
import { resTypes } from "../../helpers/responseTypes";
import { create } from "../../modules/User/repo";

export async function login(req, res) {
  const user = await User.isExist(req.body.auth);

  if (user && (await user.authenticate(req.body.password))) {
    res.status(200).json(
      resTypes(200, {
        admin: {
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
            value: "email or password not correct",
          },
        ],
      })
    );
  }
}

export async function creatAdmin(req, res) {
  let admin = await create(req.body);

  console.log("new Aadmin", admin);

  if (admin.record) {
    admin.record
      .save()
      .then(() => res.json(resTypes(200)))
      .catch((err) => {
        console.log("err", err);

        res.json(resTypes(400, { errors: err }));
      });
  } else res.json(resTypes(400, { errors: admin.errors }));
}
