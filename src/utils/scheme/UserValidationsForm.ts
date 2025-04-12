export const validateForm = (formData: any, isUpdate: boolean = false) => {
  const errors: any = {};

  errors.name = formData.name ? "" : "Este campo es obligatorio";
  errors.lastName = formData.lastName ? "" : "Este campo es obligatorio";
  errors.nameUser = formData.nameUser ? "" : "Este campo es obligatorio";
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


    if (!isUpdate) {
      if (!formData.password) {
        errors.password = "Este campo es obligatorio";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(formData.password)) {
        errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
      } else {
        errors.password = "";
      }
    }
    

  return errors;
};
