const validator = (req, res, next) => {
    const { firstName, lastName, dob, mobileNumber, address } = req.body;
    const errors = {};

    // First Name
    if (!firstName) {
        errors.firstName = "First Name is empty";
    } else {
        if (firstName.length < 3) {
            errors.firstName = "First Name should be at least 3 characters";
        }
        if (!/^[A-Za-z]+$/.test(firstName)) {
            errors.firstName = "First Name should contain only alphabets";
        }
    }

    // Last Name
    if (!lastName) {
        errors.lastName = "Last Name is empty";
    } else {
        if (lastName.length < 3) {
            errors.lastName = "Last Name should be at least 3 characters";
        }
        if (!/^[A-Za-z]+$/.test(lastName)) {
            errors.lastName = "Last Name should contain only alphabets";
        }
    }

    // Date of Birth
    if (!dob) {
        errors.dob = "Date of birth is empty";
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isDate = new Date(dob);
        if (isNaN(isDate.getTime()) || isDate > today) {
            errors.dob = "Enter a valid date of birth";
        }
    }

    // Mobile Number
    if (!mobileNumber) {
        errors.mobileNumber = "Mobile Number is empty";
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
        errors.mobileNumber = "Mobile Number must be exactly 10 digits and contain only numbers";
    }

    // Address
    if (!address) {
        errors.address = "Address is empty";
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation error occurred",
            errors
        });
    }

    next();
};

module.exports = validator;
