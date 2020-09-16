import React from 'react';
import { useReducer } from 'react';
import { PlainObject } from '../_types';

// THERE ARE PLANS TO IMPROVED THIS MODULE

//
// ---------------------------Types--------------------------- //
//
// Type for each form field
type FormFieldOption = {
	name: string;
	value: string | number;
	type: 'text' | 'email' | 'password' | 'submit' | 'radio' | 'checkbox';
	label?: string;
	group?: string;
	choices?: ({ label: string; value: string | number } | string | number)[];
	inlineLable?: boolean;
	className?: string;
	hidden?: boolean;
	placeholder?: string;
	required?: boolean;
	autocomplete?: boolean;
};

// Form field template
export type FormTemplateOption = {
	[formField: string]: FormFieldOption;
};
//
// ------------------------------------FORM HOOK------------------------------------
//
// Custom useForm hook. Return a rendered form component and current form value object
// The rendered form component handles its own state change events.
// The returned value object contain current input values of the form.
export const useForm = (
	formTemplate: FormTemplateOption,
	onSubmit?: (formValues?: PlainObject) => void
): [JSX.Element, PlainObject] => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [formValues, dispatch] = useReducer(
		(state: PlainObject, action: { target: any }) => {
			switch (action.target.type) {
				case 'checkbox':
					return { ...state, [action.target.id]: action.target.checked };
				case 'radio':
					return { ...state, [action.target.name]: action.target.value };
				default:
					return { ...state, [action.target.id]: action.target.value };
			}
		},
		getFormValue(formTemplate)
	);

	// submit handler
	const submitHandler = (event: Event | any) => {
		if (event) event.preventDefault();
		if (onSubmit) onSubmit(formValues);
	};

	// Change handler
	const changeHandler = (event: Event | any) => {
		return dispatch({ target: event.target });
	};

	const Form = generateForm(
		formTemplate,
		formValues,
		changeHandler,
		submitHandler
	);
	return [Form, formValues];
};
//
// ---------------------------SUPPORTED FORM INPUT TYPE---------------------------
//
// Generic form component
interface FormField {
	// basic form field
	name: string;
	label?: string;
}
//
// Basic form input type
export interface BasicFormField extends FormField {
	value: string;
	type: 'text' | 'email' | 'password' | 'submit';
}
//
// Choose-one form input type
export interface ChooseOneFormField extends FormField {
	group: string;
	value: string;
	choices: string[];
	type: 'radio';
}

// Choose-many form input type
export interface ChooseManyFormField extends FormField {
	value: boolean;
	type: 'checkbox';
}

//
// --------------------------- MODULE METHODS --------------------------- //
//

// Generate a form component
const generateForm = (
	// option for each field
	template: FormTemplateOption,
	// value state for the form
	values: PlainObject,
	// handle change for controlled components
	handleChange: any,
	// handle submit
	handleSubmit: any
) => {
	return (
		<form onSubmit={handleSubmit}>
			{Object.getOwnPropertyNames(template).map(field => {
				// each form input renderer need a props containing options, state value and change handler
				// for each field
				switch (template[field].type) {
					// field has type radio => choose-one
					case 'radio':
						return (
							<RadioFormInput
								key={field}
								option={template[field]}
								value={values[template[field].name]}
								handleChange={handleChange}
							/>
						);
					// field has type checkbox => choose-many
					case 'checkbox':
						return (
							<CheckBoxInput
								key={field}
								option={template[field]}
								value={values[template[field].name]}
								handleChange={handleChange}
							/>
						);
					// field is a basic input
					default:
						return (
							<BasicInput
								key={field}
								option={template[field]}
								value={values[template[field].name]}
								handleChange={handleChange}
							/>
						);
				}
			})}
		</form>
	);
};

// Initialize form values from FormTemplateOption
const getFormValue = (fieldOption: FormTemplateOption): PlainObject => {
	const intialVals: PlainObject = {};
	if (fieldOption)
		Object.getOwnPropertyNames(fieldOption).forEach(field => {
			intialVals[fieldOption[field].name] = fieldOption[field].value;
		});
	return intialVals;
};

// Component for rendering basic form input
const BasicInput = (props: {
	option: FormFieldOption;
	value: any;
	handleChange: any;
}) => {
	const option = props.option;
	const formComponent = (
		<>
			{option.label ? (
				<>
					<label
						htmlFor={option.name}
						style={option.inlineLable ? { marginRight: '.5em' } : {}}>
						{option.label}
					</label>
					{option.inlineLable ? null : <br />}
				</>
			) : null}
			<input
				id={option.name}
				type={option.type}
				value={props.value}
				onChange={props.handleChange}
				tabIndex={option.hidden ? -1 : 0}
				placeholder={option.placeholder}
				required={option.required}
				autoComplete={
					option.autocomplete === true
						? 'on'
						: option.autocomplete === false
						? 'off'
						: 'on'
				}
			/>
		</>
	);
	return (
		<>
			<div className={option.className}>{formComponent}</div>
		</>
	);
};

// Component for rendering choose-many form input
const CheckBoxInput = (props: {
	option: FormFieldOption;
	value: any;
	handleChange: any;
}) => {
	const option = props.option;
	return (
		<div className={option.className}>
			<input
				id={option.name}
				type={option.type}
				checked={props.value}
				onChange={props.handleChange}
				required={option.required}
			/>
			<label htmlFor={option.name}>{option.label}</label>
		</div>
	);
};

// Component for rendering choose-one form input
const RadioFormInput = (props: {
	option: FormFieldOption;
	value: any;
	handleChange: any;
}) => {
	const option = props.option;
	return (
		<div className={option.className}>
			{option.label ? (
				<label htmlFor={option.group}>{option.label}</label>
			) : null}
			<div id={option.group}>
				{option.choices?.map(choice => {
					choice = choice as { label: string; value: string | number };
					return (
						<span key={choice.value} style={{ marginRight: '1em' }}>
							<input
								id={choice.value as string}
								type={option.type}
								value={choice.value}
								name={option.group}
								checked={props.value === choice.value ? true : false}
								onChange={props.handleChange}
								required={option.required}
							/>
							<label htmlFor={choice.value as string}>{choice.label}</label>
						</span>
					);
				})}
			</div>
		</div>
	);
};
