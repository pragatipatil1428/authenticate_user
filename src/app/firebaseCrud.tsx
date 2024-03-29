"use client"
import React, { useState, useEffect } from "react";
import { ref, set, get, update, remove, child, onValue, off, push } from "firebase/database";
import FirebaseConfig from "./firebase";

const database = FirebaseConfig();

function FirebaseCrud() {
  const [id, setId] = useState<string | null>('');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [isDataInserted, setIsDataInserted] = useState<boolean>(false); // New state to track data insertion

  const isNullOrWhiteSpaces = (value: string) => {
    value = value.toString();
    return value == null || value.replaceAll(' ', '').length < 1;
  };

  useEffect(() => {
    const dbref = ref(database);
    const customersRef = child(dbref, 'Customer');

    const fetchData = () => {
      onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const customerList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setCustomers(customerList);
        } else {
          setCustomers([]);
        }
      });
    };

    fetchData();

    return () => {
      // Cleanup subscription
      off(customersRef);
    };
  }, []);

  const InsertData = () => {
    const dbref = ref(database);

    if (
      isNullOrWhiteSpaces(name) ||
      isNullOrWhiteSpaces(contact) ||
      isNullOrWhiteSpaces(address)
    ) {
      alert("Fill all the fields..");
      return;
    }

    const customersRef = child(dbref, 'Customer');

    const newCustomerRef = push(customersRef); 
    const newCustomerId = newCustomerRef.key; 

    set(newCustomerRef, {
      sname: name,
      scontact: contact,
      saddress: address,
    })
      .then(() => {
        setId(newCustomerId); 
        setIsDataInserted(true); // Set the flag to true after data insertion
        alert("Customer inserted successfully....");
      })
      .catch((error) => {
        console.log(error);
        alert("There was an error while inserting the customer...");
      });
  };

  const handleReset = () => {
    setId('');
    setName('');
    setContact('');
    setAddress('');
    setIsDataInserted(false); // Reset the flag when resetting the form
  };

  const UpdateData = () => {
    const dbref = ref(database);
    //@ts-ignore
    if (isNullOrWhiteSpaces(id)) {
      alert(
        "id is empty, try to select a user first, with the select button"
      );
      return;
    }

    get(child(dbref, 'Customer/' + id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(ref(database, 'Customer/' + id), {
            sname: name,
            scontact: contact,
            saddress: address,
          })
            .then(() => {
              alert("customer updated successfully....");
            })
            .catch((error) => {
              console.log(error);
              alert("there was an error while updating the customer...");
            });
        } else {
          alert("error: The customer does not exist");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error data retrieval was unsuccessful...");
      });
  };

  const DeleteData = (customerId: string) => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(customerId)) {
      alert("ID is required to delete the customer");
      return;
    }

    get(child(dbref, 'Customer/' + customerId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          remove(ref(database, 'Customer/' + customerId))
            .then(() => {
              alert("Customer deleted successfully....");
            })
            .catch((error) => {
              console.log(error);
              alert("There was an error while deleting the customer...");
            });
        } else {
          alert("Error: The customer does not exist");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error: Data retrieval was unsuccessful...");
      });
  };

  const SelectData = (customerId: string) => {
    if (customerId !== null) {
      const selectedCustomer = customers.find(customer => customer.id === customerId);
      if (selectedCustomer) {
        setId(selectedCustomer.id);
        setName(selectedCustomer.sname);
        setContact(selectedCustomer.scontact);
        setAddress(selectedCustomer.saddress);
      } else {
        alert("No data available for the selected customer");
      }
    } else {
      alert("No data available for the selected customer");
    }
  };

  return (
    <table className="border-collapse border border-gray-200">
      <tbody>
        <tr>
          <td className="p-4">
            <form className="max-w-md mx-auto bg-white rounded shadow-md" onSubmit={InsertData}>
              <fieldset className="p-4">
                <legend className="text-xl font-bold mb-4">Registration Form</legend>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name :</label>
                  <input type="text" id="name" value={name} onChange={(e) => { setName(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-600">Contact :</label>
                  <input type="tel" id="contact" value={contact} onChange={(e) => { setContact(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required pattern="[0-9]{10}" />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address :</label>
                  <input type="text" id="address" value={address} onChange={(e) => { setAddress(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required />
                </div>
                <div className="flex space-x-4">
                  {!isDataInserted && <button type="button" onClick={InsertData} className="px-4 py-2 bg-blue-500 text-white rounded-md">Insert</button>}
                  {isDataInserted && <button type="button" onClick={UpdateData} className="px-4 py-2 bg-green-500 text-white rounded-md">Update</button>}
                  <button type="button" onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded-md">Reset</button>
                </div>
              </fieldset>
            </form>
          </td>
        </tr>
  
        <tr>
          <th className="px-4 py-2 border border-gray-200  text-white">Id</th>
          <th className="px-4 py-2 border border-gray-200  text-white">Name</th>
          <th className="px-4 py-2 border border-gray-200  text-white">Contact</th>
          <th className="px-4 py-2 border border-gray-200  text-white">Address</th>
          <th className="px-4 py-2 border border-gray-200  text-white">Actions</th>
        </tr>
  
        {customers.map(customer => (
          <tr key={customer.id}>
            <td className="px-4 py-2 border border-gray-200  text-white">{customer.id}</td>
            <td className="px-4 py-2 border border-gray-200  text-white">{customer.sname}</td>
            <td className="px-4 py-2 border border-gray-200  text-white">{customer.scontact}</td>
            <td className="px-4 py-2 border border-gray-200  text-white">{customer.saddress}</td>
            <td className="px-4 py-2 border border-gray-200">
              <button onClick={() => SelectData(customer.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Select</button> &nbsp;
              <button type="button" onClick={() => DeleteData(customer.id)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
}

export default FirebaseCrud;






// import React, { useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
// import { ref, set, get, update, remove, child, onValue, off, push } from "firebase/database";
// import FirebaseConfig from "../firebaseConfig/firebaseConfig";

// const database = FirebaseConfig();
// const auth = getAuth();

// function FirebaseCrud() {
//   // State variables for authentication
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState<User | null>(null); // Keep track of authenticated user

//   // State variables for CRUD operations
//   const [id, setId] = useState<string | null>('');
//   const [name, setName] = useState<string>('');
//   const [contact, setContact] = useState<string>('');
//   const [address, setAddress] = useState<string>('');
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [isDataInserted, setIsDataInserted] = useState<boolean>(false);

//   // Check if user is already authenticated
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });

//     // Clean up subscription
//     return () => unsubscribe();
//   }, []);

//   // Sign up function
//   const handleSignUp = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Sign in function
//   const handleSignIn = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const isNullOrWhiteSpaces = (value: string) => {
//         value = value.toString();
//         return value == null || value.replaceAll(' ', '').length < 1;
//       };

//   // CRUD operations remain unchanged from your existing code...

//   const InsertData = () => {
//         const dbref = ref(database);
    
//         if (
//           isNullOrWhiteSpaces(name) ||
//           isNullOrWhiteSpaces(contact) ||
//           isNullOrWhiteSpaces(address)
//         ) {
//           alert("Fill all the fields..");
//           return;
//         }
    
//         const customersRef = child(dbref, 'Customer');
    
//         const newCustomerRef = push(customersRef); 
//         const newCustomerId = newCustomerRef.key; 
    
//         set(newCustomerRef, {
//           sname: name,
//           scontact: contact,
//           saddress: address,
//         })
//           .then(() => {
//             setId(newCustomerId); 
//             setIsDataInserted(true); // Set the flag to true after data insertion
//             alert("Customer inserted successfully....");
//           })
//           .catch((error) => {
//             console.log(error);
//             alert("There was an error while inserting the customer...");
//           });
//       };
    
//       const handleReset = () => {
//         setId('');
//         setName('');
//         setContact('');
//         setAddress('');
//         setIsDataInserted(false); // Reset the flag when resetting the form
//       };
    
//       const UpdateData = () => {
//         const dbref = ref(database);
//         //@ts-ignore
//         if (isNullOrWhiteSpaces(id)) {
//           alert(
//             "id is empty, try to select a user first, with the select button"
//           );
//           return;
//         }
    
//         get(child(dbref, 'Customer/' + id))
//           .then((snapshot) => {
//             if (snapshot.exists()) {
//               update(ref(database, 'Customer/' + id), {
//                 sname: name,
//                 scontact: contact,
//                 saddress: address,
//               })
//                 .then(() => {
//                   alert("customer updated successfully....");
//                 })
//                 .catch((error) => {
//                   console.log(error);
//                   alert("there was an error while updating the customer...");
//                 });
//             } else {
//               alert("error: The customer does not exist");
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//             alert("Error data retrieval was unsuccessful...");
//           });
//       };
    
//       const DeleteData = (customerId: string) => {
//         const dbref = ref(database);
    
//         if (isNullOrWhiteSpaces(customerId)) {
//           alert("ID is required to delete the customer");
//           return;
//         }
    
//         get(child(dbref, 'Customer/' + customerId))
//           .then((snapshot) => {
//             if (snapshot.exists()) {
//               remove(ref(database, 'Customer/' + customerId))
//                 .then(() => {
//                   alert("Customer deleted successfully....");
//                 })
//                 .catch((error) => {
//                   console.log(error);
//                   alert("There was an error while deleting the customer...");
//                 });
//             } else {
//               alert("Error: The customer does not exist");
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//             alert("Error: Data retrieval was unsuccessful...");
//           });
//       };
    
//       const SelectData = (customerId: string) => {
//         if (customerId !== null) {
//           const selectedCustomer = customers.find(customer => customer.id === customerId);
//           if (selectedCustomer) {
//             setId(selectedCustomer.id);
//             setName(selectedCustomer.sname);
//             setContact(selectedCustomer.scontact);
//             setAddress(selectedCustomer.saddress);
//           } else {
//             alert("No data available for the selected customer");
//           }
//         } else {
//           alert("No data available for the selected customer");
//         }
//       };

//   return (
//     <div>
//       {user ? (
//         // Display CRUD functionality when user is authenticated
//         <table className="border-collapse border border-gray-200">
//                <tbody>
//                  <tr>
//                    <td className="p-4">
//                      <form className="max-w-md mx-auto bg-white rounded shadow-md" onSubmit={InsertData}>
//                        <fieldset className="p-4">
//                          <legend className="text-xl font-bold mb-4">Registration Form</legend>
//                          <div className="mb-4">
//                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name :</label>
//                            <input type="text" id="name" value={name} onChange={(e) => { setName(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required />
//                          </div>
//                          <div className="mb-4">
//                            <label htmlFor="contact" className="block text-sm font-medium text-gray-600">Contact :</label>
//                            <input type="tel" id="contact" value={contact} onChange={(e) => { setContact(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required pattern="[0-9]{10}" />
//                          </div>
//                          <div className="mb-4">
//                            <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address :</label>
//                            <input type="text" id="address" value={address} onChange={(e) => { setAddress(e.target.value); }} className="mt-1 p-2 w-full border rounded-md" autoComplete="off" required />
//                          </div>
//                          <div className="flex space-x-4">
//                            {!isDataInserted && <button type="button" onClick={InsertData} className="px-4 py-2 bg-blue-500 text-white rounded-md">Insert</button>}
//                            {isDataInserted && <button type="button" onClick={UpdateData} className="px-4 py-2 bg-green-500 text-white rounded-md">Update</button>}
//                            <button type="button" onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded-md">Reset</button>
//                          </div>
//                        </fieldset>
//                      </form>
//                    </td>
//                  </tr>
          
//                  <tr>
//                    <th className="px-4 py-2 border border-gray-200">Id</th>
//                    <th className="px-4 py-2 border border-gray-200">Name</th>
//                    <th className="px-4 py-2 border border-gray-200">Contact</th>
//                    <th className="px-4 py-2 border border-gray-200">Address</th>
//                    <th className="px-4 py-2 border border-gray-200">Actions</th>
//                  </tr>
          
//                  {customers.map(customer => (
//                    <tr key={customer.id}>
//                      <td className="px-4 py-2 border border-gray-200">{customer.id}</td>
//                      <td className="px-4 py-2 border border-gray-200">{customer.sname}</td>
//                      <td className="px-4 py-2 border border-gray-200">{customer.scontact}</td>
//                      <td className="px-4 py-2 border border-gray-200">{customer.saddress}</td>
//                      <td className="px-4 py-2 border border-gray-200">
//                        <button onClick={() => SelectData(customer.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Select</button> &nbsp;
//                        <button type="button" onClick={() => DeleteData(customer.id)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
//                      </td>
//                    </tr>
//                  ))}
//                </tbody>
//              </table>
//       ) : (
//         // Display authentication UI when user is not authenticated
//         <div>
//           <h2>Sign Up</h2>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//           <button onClick={handleSignUp}>Sign Up</button>

//           <h2>Sign In</h2>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//           <button onClick={handleSignIn}>Sign In</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default FirebaseCrud;   