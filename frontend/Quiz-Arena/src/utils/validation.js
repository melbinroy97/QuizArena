export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRegister = (form) => {
  const errors = {};

  if (!form.username || form.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (!form.fullName || form.fullName.trim().length === 0) {
    errors.fullName = "Full name is required";
  }

  if (!form.email || !validateEmail(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password || form.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};

export const validateLogin = (form) => {
  const errors = {};

  if (!form.email || !validateEmail(form.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!form.password) {
    errors.password = "Password is required";
  }

  return errors;
};
