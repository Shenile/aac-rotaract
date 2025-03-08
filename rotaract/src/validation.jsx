import * as Yup from 'yup';

// Utility function to build the schema dynamically based on options
const buildStudentSchema = (deptOptions, startYearOptions, endYearOptions) => {
  return Yup.object().shape({
    roll_no: Yup.string()
      .required('Roll number is required')
      .matches(/^[A-Za-z0-9]+$/, 'Roll number must be alphanumeric'),
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters long'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
    dept: Yup.string()
      .required('Department is required')
      .oneOf(deptOptions, 'Invalid department'),
    startYear: Yup.number()
      .required('Start year is required')
      // .min(2000, 'Start year must be after 2000')
      .oneOf(startYearOptions, 'Invalid start year'),
      endYear: Yup.number()
      .required('End year is required')
      // .min(Yup.ref('startYear'), 'End year must be after start year')
      .oneOf(endYearOptions, 'Invalid end year'),
    mobileNo: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  });
};

export default buildStudentSchema;

export const getValidationErrors = async (data, deptOptions, startYearOptions, endYearOptions) => {
  

  try {
    // Build schema dynamically based on options
    const schema = buildStudentSchema(deptOptions, startYearOptions, endYearOptions);

    await schema.validate(data, { abortEarly: false });
    return null; // Return null if no validation errors
  } catch (err) {
    if (err.inner && err.inner.length > 0) {
      const errors = err.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      return errors;
    }
    return { general: err.message };
  }
};
