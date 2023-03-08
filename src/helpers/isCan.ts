export function isPremit(
  user: object,
  module: string,
  permission: string,
  url: string
) {
  let types = {
    GET: "list",
    PUT: "update",
    PATCH: "update",
    DELETE: "delete",
  };

  if (module === "Users") {
    module =
      url.split("=")[1].charAt(0).toUpperCase() +
      url.split("=")[1].slice(1) +
      "s";
  }

  console.log("module", module);
  console.log(
    "module",
    user["role"]["permissions"].find((item) => item.name === module)
  );

  return user["role"]["permissions"].find((item) => item.name === module)
    ?.roles[types[permission]];
}
