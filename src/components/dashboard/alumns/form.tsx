import { useEffect, useState } from "react";
import { Datepicker } from "flowbite-react";
import { getAlumn, postAlumn, putAlumn } from "../../../services/alumn";
import { postGuardian, putGuardian } from "../../../services/guardian";
import { useNavigate, useParams } from "react-router";
import type { IAlumnNew } from "../../../types/alumns";
import type { IGuardianNew, IPostGuardianResponse } from "../../../types/guardians";
import type { IErrorResponse } from "../../../types/errors";

export default function AlumnForm() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("")
  const [last_name, setLastName] = useState<string>("")
  const [birth_date, setBirthDate] = useState<string>((new Date()).toString())
  const [address, setAddress] = useState<string>("")
  const [phone_number, setPhoneNumber] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [is_guardian_required_for_leaving, setIsGuardianRequiredForLeaving] = useState<boolean>(false);
  const [guardianId, setGuardianId] = useState<number>();
  const [guardian_name, setGuardianName] = useState<string>("")
  const [special_med_conditions, setSpecialMedConditions] = useState<string>("")
  const [guardian_last_name, setGuardianLastName] = useState<string>("")
  const [guardian_phone_number, setGuardianPhoneNumber] = useState<string>("")
  const [guardian_email, setGuardianEmail] = useState<string>("")
  const [secGuardianId, setSecondaryGuardianId] = useState<number>()
  const [secondary_guardian_name, setSecondaryGuardianName] = useState<string>("")
  const [secondary_guardian_last_name, setSecondaryGuardianLastName] = useState<string>("")
  const [secondary_guardian_phone_number, setSecondaryGuardianPhoneNumber] = useState<string>("")
  const [secondary_guardian_email, setSecondaryGuardianEmail] = useState<string>("")

  useEffect(() => {
    if (id) { loadAlumnData() }
  }, []);

  function loadAlumnData() {
    if (id) {
      setIsLoading(true);
      getAlumn({ id }).then(response => {
        if (response.success) {
          const { name, last_name, email, birth_date, phone_number, address, special_med_conditions, guardians } = response.data
          setAddress(address || "");
          setBirthDate(birth_date ? birth_date + 'T00:00:00' : (new Date()).toString());
          setEmail(email || "");
          setLastName(last_name || "");
          setName(name || "");
          setPhoneNumber(phone_number || "");
          setSpecialMedConditions(special_med_conditions);
          if (guardians.length > 0) {
            let guardian = guardians[0]
            setGuardianId(guardian.id);
            setGuardianName(guardian.name);
            setGuardianLastName(guardian.last_name)
            setGuardianPhoneNumber(guardian.phone_number);
            setGuardianEmail(guardian.email);
            if (guardians.length > 1) {
              guardian = guardians[1]
              setSecondaryGuardianId(guardian.id);
              setSecondaryGuardianName(guardian.name);
              setSecondaryGuardianLastName(guardian.last_name)
              setSecondaryGuardianPhoneNumber(guardian.phone_number);
              setSecondaryGuardianEmail(guardian.email);
            }
          }
        }
      }).finally(() => {
        setIsLoading(false);
      })
    }
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const alumn: IAlumnNew = { name, last_name, birth_date, address, phone_number, email, special_med_conditions, is_guardian_required_for_leaving };
    const guardian = { name: guardian_name, last_name: guardian_last_name, phone_number: guardian_phone_number, email: guardian_email };
    const args: {
      alumn: IAlumnNew,
      guardian: IGuardianNew,
      secondaryGuardian?: IGuardianNew
    } = {
      alumn, guardian
    }
    if (secondary_guardian_name.trim().length > 0 && (secondary_guardian_email.trim().length > 0 || secondary_guardian_email.trim().length > 0)) {
      args.secondaryGuardian = { name: secondary_guardian_name, last_name: secondary_guardian_last_name, phone_number: secondary_guardian_phone_number, email: secondary_guardian_email };
    }
    if (id) {
      updateAlumn(args)
    } else {
      createAlumn(args)
    }
  }

  async function createAlumn(args: { alumn: IAlumnNew, guardian: IGuardianNew, secondaryGuardian?: IGuardianNew }) {
    const response = await postAlumn({ data: args.alumn })
    if (response.success) {
      const promises: Promise<IPostGuardianResponse | IErrorResponse>[] = [];
      promises.push(postGuardian({ data: { ...args.guardian, alumn_id: response.data.id } }));
      if (args.secondaryGuardian) {
        promises.push(postGuardian({ data: { ...args.secondaryGuardian, alumn_id: response.data.id } }))
      }
      Promise.all(promises)
        .then(res => {
          if (res[0].success) {
            navigate("/")
          }
        })
        .catch(error => {
          console.log(error);

        }).finally(() => {
          setIsLoading(false)
        });
    }
    setIsLoading(false);
  }

  async function updateAlumn(args: { alumn: IAlumnNew, guardian: IGuardianNew, secondaryGuardian?: IGuardianNew }) {
    if (id) {
      const response = await putAlumn({ id, data: args.alumn });
      if (response.success) {
        if (guardianId) {
          const promises: Promise<IPostGuardianResponse | IErrorResponse>[] = [];
          promises.push(putGuardian({ id: guardianId, data: args.guardian }))
          if (secGuardianId && args.secondaryGuardian) {
            promises.push(putGuardian({ id: secGuardianId, data: args.secondaryGuardian }))
          }
          Promise.all(promises)
            .then(res => {
              if (res[0].success) {
              }
            }).finally(() => {
              setIsLoading(false)
            })
        }
      }
    }
  }

  return (
    <form onSubmit={event => formSubmit(event)}
      className={`py-6 px-6 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`} >
      <div className="grid gap-6 mb-5 md:grid-cols-2">
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Alumn
          </div>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input onChange={(e) => { setLastName(e.target.value) }} value={last_name} type="text" id="last_name" name="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
          </div>
          <div>
            <label htmlFor="birth_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birth date</label>
            <Datepicker onChange={(value) => { setBirthDate(value?.toString() || "") }} value={new Date(birth_date)} id="birth_date" name="birth_date" />
          </div>
          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
            <input onChange={(e) => { setAddress(e.target.value) }} value={address} type="text" id="address" name="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Street ##" required />
          </div>
          <div>
            <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input onChange={(e) => { setPhoneNumber(e.target.value) }} value={phone_number} type="tel" id="phone_number" name="phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-6789" pattern="[0-9]{10}" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" required />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Main guardian</div>
          <div>
            <label htmlFor="guardian_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input onChange={(e) => { setGuardianName(e.target.value) }} value={guardian_name} type="text" id="guardian_name" name="guardian_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
          </div>
          <div>
            <label htmlFor="guardian_last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input onChange={(e) => { setGuardianLastName(e.target.value) }} value={guardian_last_name} type="text" id="guardian_last_name" name="guardian_last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
          </div>
          <div>
            <label htmlFor="guardian_phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input onChange={(e) => { setGuardianPhoneNumber(e.target.value) }} value={guardian_phone_number} type="tel" id="guardian_phone_number" name="guardian_phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{10}" required />
          </div>
          <div>
            <label htmlFor="guardian_email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input onChange={(e) => { setGuardianEmail(e.target.value) }} value={guardian_email} type="email" id="guardian_email" name="guardian_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" required />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">Secondary guardian</div>
          <div>
            <label htmlFor="secondary_guardian_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input onChange={(e) => { setSecondaryGuardianName(e.target.value) }} value={secondary_guardian_name} type="text" id="secondary_guardian_name" name="secondary_guardian_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" />
          </div>
          <div>
            <label htmlFor="secondary_guardian_last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input onChange={(e) => { setSecondaryGuardianLastName(e.target.value) }} value={secondary_guardian_last_name} type="text" id="secondary_guardian_last_name" name="secondary_guardian_last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" />
          </div>
          <div>
            <label htmlFor="secondary_guardian_phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input onChange={(e) => { setSecondaryGuardianPhoneNumber(e.target.value) }} value={secondary_guardian_phone_number} type="tel" id="secondary_guardian_phone_number" name="secondary_guardian_phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" pattern="[0-9]{10}" />
          </div>
          <div>
            <label htmlFor="secondary_guardian_email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
            <input onChange={(e) => { setSecondaryGuardianEmail(e.target.value) }} value={secondary_guardian_email} type="email" id="secondary_guardian_email" name="secondary_guardian_email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" />
          </div>
        </div>
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div>
            <label htmlFor="special_med_conditions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Special medical conditions</label>
            <input onChange={(e) => { setSpecialMedConditions(e.target.value) }} value={special_med_conditions} type="text" id="special_med_conditions" name="special_med_conditions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Allergies" required />
          </div>
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input id="is_guardian_required_for_leaving" name="is_guardian_required_for_leaving" type="checkbox" checked={is_guardian_required_for_leaving} onChange={e => setIsGuardianRequiredForLeaving(e.target.checked)} className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
        </div>
        <label htmlFor="is_guardian_required_for_leaving" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">The student may leave the installations wihout a guardian.</label>
      </div>
      <button type="submit" disabled={isLoading} className={`text-white ${isLoading ? "bg-gray-400 cursor-progress" : "bg-blue-700 hover:bg-blue-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  dark:focus:ring-blue-800`}>Submit</button>
    </form>

  );
};