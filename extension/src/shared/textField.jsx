import {TextField} from "@material-ui/core";
import React from "react";

const renderTextField = ({
                             name,
                             input,
                             type,
                             label,
                             placeholder = '',
                             className = '',
                             meta: {touched, error, invalid},
                             ...custom
                         }) => {
    return (
        <TextField
            name={name}
            className={className}
            label={label}
            placeholder={placeholder}
            type={type}
            margin='normal'
            error={touched && invalid}
            helperText={touched && error}
            required={invalid}
            fullWidth
            {...input}
            {...custom}
        />
    )
};
export default renderTextField;
