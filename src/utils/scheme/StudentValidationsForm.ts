export const validateForm = (formData: any) => {
  const errors: any = {};

  errors.firstName = formData.firstName ? "" : "Este campo es obligatorio";
  errors.lastName = formData.lastName ? "" : "Este campo es obligatorio";
  if (!formData.dni) {
    errors.dni = "Este campo es obligatorio";
  } else if (!/^\d{8}$/.test(formData.dni)) {
    errors.dni = "El DNI debe tener 8 dígitos numéricos";
  } else {
    errors.dni = "";
  }

  errors.mail =
    formData.mail && /\S+@\S+\.\S+/.test(formData.mail)
      ? ""
      : "Correo electrónico inválido";

  if (!formData.phone) {
    errors.phone = "Este campo es obligatorio";
  } else if (!/^9\d{8}$/.test(formData.phone)) {
    errors.phone =
      "El número de teléfono debe tener 9 dígitos y comenzar con 9";
  } else {
    errors.phone = "";
  }

  errors.gender =
  formData.gender === "Masculino" || formData.gender === "Femenino"|| formData.gender == true || formData.gender == false
    ? ""
    : "Seleccione un género válido";

  errors.code = formData.code ? "" : "Ingrese un codigo";
  errors.birthDate = formData.birthDate ? "" : "Ingrese una fecha";

  return errors;
};
