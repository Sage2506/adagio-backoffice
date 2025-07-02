import { useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";

export default function AlumnForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {

  }, []);

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())
    const {
      name,
      last_name,
      birth_date,
      address,
      phone_number,
      email,
      guardian_name,
      guardian_last_name,
      guardian_phone_number,
      guardian_email,
      secondary_guardian_name,
      secondary_guardian_last_name,
      secondary_guardian_phone_number,
      secondary_guardian_email,
    } = formValues
    const alumn = { name, last_name, birth_date, address, phone_number, email };
    const guardian = { name: guardian_name, last_name: guardian_name, phone_number: guardian_phone_number, email: guardian_email };
    console.log("guardian: ", guardian)
    const secondary_guardian = { name: guardian_name, last_name: guardian_name, phone_number: guardian_phone_number, email: guardian_phone_number };
  }
  return (
    <form onSubmit={event => formSubmit(event)}
      className="py-6 px-6 space-y-6" >
      <div className="grid gap-6 mb-5 md:grid-cols-2">
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Alumn
          </div>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input type="text" id="last_name" name="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
          </div>
          <div>
            <label htmlFor="birth_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birth date</label>
            <Datepicker id="birth_date" name="birth_date" />
          </div>
          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
            <input type="text" id="address" name="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Street ##" required />
          </div>
          <div>
            <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input type="tel" id="phone_number" name="phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-6789" pattern="[0-9]{10}" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" required />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Main guardian</div>
          <div>
            <label htmlFor="guardian_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" id="guardian_name" name="guardian_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
          </div>
          <div>
            <label htmlFor="guardian_last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input type="text" id="guardian_last_name" name="guardian_last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
          </div>
          <div>
            <label htmlFor="guardian_phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input type="tel" id="guardian_phone_number" name="guardian_phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{10}" required />
          </div>
          <div>
            <label htmlFor="guardian_email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="guardian_email" name="guardian_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" required />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Secondary guardian</div>
          <div>
            <label htmlFor="second_guardian_first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" id="second_guardian_first_name" name="second_guardian_first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" />
          </div>
          <div>
            <label htmlFor="second_guardian_last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input type="text" id="second_guardian_last_name" name="second_guardian_last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" />
          </div>
          <div>
            <label htmlFor="second_guardian_phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input type="tel" id="second_guardian_phone_number" name="second_guardian_phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{10}" />
          </div>
          <div>
            <label htmlFor="second_guardian_email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input type="email" id="second_guardian_email" name="second_guardian_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div>
            <label htmlFor="special_med_conditions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Special medical conditions</label>
            <input type="text" id="special_med_conditions" name="special_med_conditions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Allergies" required />
          </div>
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input id="remember" name="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
        </div>
        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">The student may leave the installations wihout a guardian.</label>
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>

  );
};