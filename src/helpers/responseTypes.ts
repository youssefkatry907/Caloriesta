const types = {
  400: {
    success: false,
    code: 400,
  },
  401: {
    success: false,
    code: 401,
    message: "premession denided",
  },
  404: {
    success: false,
    code: 404,
    message: "record not found",
  },
  409: {
    success: false,
    code: 409,
    message: "conflict record already found",
  },
  500: {
    success: false,
    code: 500,
    message: "something went wrong",
  },
  200: {
    success: true,
    code: 200,
  },
  201: {
    success: true,
    code: 201,
    message: "record updated successfully",
  },
};

export function resTypes(code: number, data = {}) {
  return { ...types[code], ...data };
}
