// import React, { createContext, useContext, useEffect, ReactNode } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Switch,
// } from 'react-native';
// import {
//   observable,
//   action,
//   computed,
//   makeObservable,
//   runInAction,
// } from 'mobx';
// import { Observer, useLocalObservable } from 'mobx-react-lite';
// import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
// import { Form, type FormSpec } from './forms/Form';
// import type { FormFieldSpec } from './forms/FormField';

// // Example usage
// type Address = {
//   street: string;
//   city: string;
// };

// type UserForm = {
//   name: string;
//   email: string;
//   password: string;
//   isStudent: boolean;
//   address: Address;
// };

// const initialForm: FormSpec<UserForm> = {
//   data: {
//     name: '',
//     email: '',
//     password: '',
//     isStudent: false,
//     address: {
//       street: '',
//       city: '',
//     },
//   },
//   errors: {},
//   validationRules: {
//     name: (value) => (value.length > 0 ? null : 'Name is required'),
//     email: (value) =>
//       /\S+@\S+\.\S+/.test(value) ? null : 'Invalid email address',
//     password: (value) =>
//       value.length >= 8 ? null : 'Password must be at least 8 characters long',
//   },
// };

// export function UserFormExample() {
//   const handleSubmit = async (data: UserForm) => {
//     console.log('Form submitted:', data);
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   };

//   return (
//     <Form<UserForm>
//       for={initialForm}
//       change="form_change"
//       submit="form_submit"
//       pushEvent={handleSubmit}
//     >
//       {(form) => (
//         <>
//           <TextFormField
//             field={form.getField(['name'])}
//             label="Name"
//             placeholder="Enter your name"
//           />
//           <TextFormField
//             field={form.getField(['email'])}
//             label="Email"
//             placeholder="Enter your email"
//             keyboardType="email-address"
//           />
//           <TextFormField
//             field={form.getField(['password'])}
//             label="Password"
//             placeholder="Enter your password"
//             secureTextEntry
//           />
//           <SwitchFormField
//             field={form.getField(['isStudent'])}
//             label="Are you a student?"
//           />
//           <InputsFor for={form.getField(['address'])}>
//             {(addressForm) => (
//               <>
//                 <TextFormField
//                   field={addressForm.getField(['street'])}
//                   label="Street"
//                   placeholder="Enter your street"
//                 />
//                 <TextFormField
//                   field={addressForm.getField(['city'])}
//                   label="City"
//                   placeholder="Enter your city"
//                 />
//               </>
//             )}
//           </InputsFor>
//           <SubmitButton title="Create Account" />
//         </>
//       )}
//     </Form>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   fieldContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     padding: 10,
//   },
//   error: {
//     color: 'red',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   nestedFormContainer: {
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     padding: 10,
//   },
//   submitButton: {
//     backgroundColor: '#007AFF',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#A0CFFF',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });
