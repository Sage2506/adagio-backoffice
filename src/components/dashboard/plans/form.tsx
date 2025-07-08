import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getPlan, postPlan, putPlan } from "../../../services/plan";
import type { IPlanNew } from "../../../types/plans";

export default function PlanForm() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [subscription_duration, setSubscriptionDuration] = useState<string>("")
  const [tolerance_days, setToleranceDays] = useState<string>("")

  useEffect(() => {
    loadFormData()
  }, []);

  function loadFormData() {
    const promises = [];
    if (id) {
      promises.push(loadPlan());
    }
    setIsLoading(true);
    Promise.all(promises).finally(() => {
      setIsLoading(false)
    })
  }

  async function loadPlan() {
    if (id) {
      const response = await getPlan({ id });
      if (response.success) {
        const { name, price, subscription_duration, tolerance_days } = response.data
        setName(name);
        setPrice(price.toString());
        setSubscriptionDuration(subscription_duration.toString());
        setToleranceDays(tolerance_days.toString())
      }
    }
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data: { plan: IPlanNew } = {
      plan: {
        name, price, tolerance_days, subscription_duration
      }
    }

    updateCreatePlan({ data });
  }

  async function updateCreatePlan(args: { data: { plan: IPlanNew } }) {
    setIsLoading(true)
    const { data } = args
    const response = await (id ? putPlan({ id, data }) : postPlan({ data }))
    if (response.success) {
      if (id) {
        const { name, price, subscription_duration, tolerance_days } = response.data
        setName(name)
        setPrice(price.toString())
        setSubscriptionDuration(subscription_duration.toString())
        setToleranceDays(tolerance_days.toString())
      } else {
        navigate('/plans')
      }
    }
  }
  return (
    <form onSubmit={event => formSubmit(event)} className={`py-6 px-6 space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="grid gap-6 mb-5 md:grid-cols-2">
        <div className="rounded-sm bg-gray-50 dark:bg-gray-800 py-4 px-4">
          <div className="block mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Plan
          </div>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ballet" required />
          </div>
          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
            <input onChange={(e) => { setPrice(e.target.value) }} value={price} type="number" id="price" name="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="99.9" pattern="^\d+(\.\d{1,2})?$" required />
          </div>
          <div>
            <label htmlFor="subscription_duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration</label>
            <input onChange={(e) => { setSubscriptionDuration(e.target.value) }} value={subscription_duration} type="text" id="subscription_duration" name="subscription_duration" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="30 days" pattern="^\d+$" required />
          </div>
          <div>
            <label htmlFor="tolerance_days" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tolerance Days</label>
            <input onChange={(e) => { setToleranceDays(e.target.value) }} value={tolerance_days} type="text" id="tolerance_days" name="tolerance_days" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="5 days" pattern="^\d+$" required />
          </div>
        </div>
      </div>
      <button type="submit" disabled={isLoading} className={`text-white ${isLoading ? "bg-gray-400 cursor-progress" : "bg-blue-700 hover:bg-blue-800 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  dark:focus:ring-blue-800`}>Submit</button>
    </form>
  );
};