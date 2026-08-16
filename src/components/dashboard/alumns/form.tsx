import { useEffect, useState } from "react";
import { getAlumn, postAlumn, putAlumn } from "../../../services/alumn";
import { postGuardian, putGuardian } from "../../../services/guardian";
import { useNavigate, useParams } from "react-router";
import type { IAlumnNew } from "../../../types/alumns";
import type { IGuardianNew, IGuardianRecord, IPostGuardianResponse } from "../../../types/guardians";
import type { IErrorResponse } from "../../../types/errors";
import { getPlans } from "../../../services/plan";
import type { IPlanRecord } from "../../../types/plans";
import type { IPostSubscriptionResponse, ISubscriptionRecord } from "../../../types/subscriptions";
import { postSubscription, putSubscription } from "../../../services/subscription";
import DatePicker from "../../utils/datePicker";
import { parseDateToYYYYMMDD } from "../../../utils/stringFormatters";
import type { IPaymentNew, IPostPaymentResponse } from "../../../types/payments";
import { postPayment } from "../../../services/payment";
import { handlePriceInputChange } from "../../../utils/numbers";
import { HeartIcon, UserGroupIcon, UserIcon, UserPlusIcon } from "@heroicons/react/24/outline";
export default function AlumnForm() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("")
  const [last_name, setLastName] = useState<string>("")
  const [birth_date, setBirthDate] = useState<Date | null>(null)
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
  const [plansList, setPlansList] = useState<IPlanRecord[]>([]);
  const [plan_id, setPlanId] = useState<string>("");
  const [subscription_id, setSubscriptionId] = useState<string>("");
  const [subscribedAt, setSubscribedAt] = useState<Date | null>(null)
  const [isSubscriptionPaymentIncluded, setIsSubscriptionPaymentIncluded] = useState<boolean>(false);
  const [subscriptionPayment, setSubscriptionPayment] = useState<string>('')
  const [isMonthlyPaymentIncluded, setIsMonthlyPaymentIncluded] = useState<boolean>(false);
  const [monthlyPayment, setMonthlyPayment] = useState<string>('')

  useEffect(() => {
    loadFormData()
  }, []);

  useEffect(() => {
    if (plan_id !== '' && plansList.length > 0) {
      const selectedPlan = plansList.find(plan => plan.id.toString() === plan_id);
      if (selectedPlan) {
        setMonthlyPayment(selectedPlan.price.toString());
      }
    }
  }, [plan_id])
  function loadFormData() {
    const promises = []
    promises.push(loadPlans());
    if (id) {
      promises.push(loadAlumnData())
    }
    setIsLoading(true)
    Promise.all(promises).finally(() => {
      setIsLoading(false);
    })
  }

  async function loadPlans() {
    const response = await getPlans({});
    if (response.success) {
      setPlansList(response.data)
      if (response.data.length > 0) {
        setPlanId(response.data[0].id.toString())
      }
    }
  }

  function loadAlumnData() {
    if (id) {
      setIsLoading(true);
      getAlumn({ id }).then(response => {
        if (response.success) {
          const { guardians, alumn } = response.data
          const { name, last_name, address, phone_number, email, birth_date, special_med_conditions, plan_id, subscription_id, is_guardian_required_for_leaving } = alumn;
          setAddress(address || "");
          setBirthDate(birth_date ? new Date(birth_date + 'T00:00:00') : new Date());
          setEmail(email || "");
          setLastName(last_name || "");
          setName(name || "");
          setPhoneNumber(phone_number || "");
          setSpecialMedConditions(special_med_conditions || "");
          setIsGuardianRequiredForLeaving(!!is_guardian_required_for_leaving)
          if (plan_id) setPlanId(plan_id.toString());
          if (subscription_id) setSubscriptionId(subscription_id.toString())
          if (guardians.length > 0) {
            let guardian = guardians[0]
            setGuardianId(guardian.id);
            setGuardianName(guardian.name || "");
            setGuardianLastName(guardian.last_name || "");
            setGuardianPhoneNumber(guardian.phone_number || "");
            setGuardianEmail(guardian.email || "");
            if (guardians.length > 1) {
              guardian = guardians[1]
              setSecondaryGuardianId(guardian.id);
              setSecondaryGuardianName(guardian.name || "");
              setSecondaryGuardianLastName(guardian.last_name || "");
              setSecondaryGuardianPhoneNumber(guardian.phone_number || "");
              setSecondaryGuardianEmail(guardian.email || "");
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
    const alumn: IAlumnNew = {
      name,
      last_name,
      birth_date: parseDateToYYYYMMDD(birth_date),
      address,
      phone_number,
      email,
      special_med_conditions,
      is_guardian_required_for_leaving
    };
    const guardian = {
      name: guardian_name,
      last_name: guardian_last_name,
      phone_number: guardian_phone_number,
      email: guardian_email
    };
    const args: {
      alumn: IAlumnNew,
      guardian: IGuardianNew,
      secondaryGuardian?: IGuardianNew
    } = {
      alumn,
      guardian
    }

    if (secondary_guardian_name.trim().length > 0 && (secondary_guardian_email.trim().length > 0 || secondary_guardian_phone_number.trim().length > 0)) {
      args.secondaryGuardian = {
        name: secondary_guardian_name,
        last_name: secondary_guardian_last_name,
        phone_number: secondary_guardian_phone_number,
        email: secondary_guardian_email
      };
    }
    updateCreateAlumn(args);
  }

  async function updateCreateAlumn(args: { alumn: IAlumnNew, guardian: IGuardianNew, secondaryGuardian?: IGuardianNew }) {
    setIsLoading(true)
    const response = await (id
      ? putAlumn({ id, data: args.alumn })
      : postAlumn({ data: args.alumn }))
    if (response.success) {
      const promises: Promise<IPostGuardianResponse | IPostSubscriptionResponse | IErrorResponse>[] = [];
      promises.push(subscription_id
        ? putSubscription({ id: subscription_id, data: { alumn_id: response.data.id.toString(), plan_id } })
        : postSubscription({ data: { alumn_id: response.data.id.toString(), plan_id, subscribed_at: subscribedAt ? parseDateToYYYYMMDD(subscribedAt) : undefined } }))
      promises.push((guardianId
        ? putGuardian({ id: guardianId, data: args.guardian })
        : postGuardian({ data: { ...args.guardian, alumn_id: response.data.id.toString() } })))
      if (args.secondaryGuardian) {
        promises.push((secGuardianId
          ? putGuardian({ id: secGuardianId, data: args.secondaryGuardian })
          : postGuardian({ data: { ...args.secondaryGuardian, alumn_id: response.data.id.toString() } })))
      }
      Promise.all(promises)
        .then(res => {
          if (res[0].success && !id) {
            if (isSubscriptionPaymentIncluded || isMonthlyPaymentIncluded) {
              createInitialPayments({ payableId: res[0].data.id, alumnId: response.data.id })
            } else {
              navigate("/")
            }
          } else {
            if (res[0].success) {
              const subscriptionResponse = res[0].data as ISubscriptionRecord
              setSubscriptionId(subscriptionResponse.id.toString())
              setPlanId(subscriptionResponse.plan_id.toString())
            }
            if (res[1].success) {
              const subscriptionResponse = res[1].data as IGuardianRecord
              setGuardianId(subscriptionResponse.id)
            }
            if (res[2]?.success) {
              const subscriptionResponse = res[2]?.data as IGuardianRecord
              setGuardianId(subscriptionResponse.id)
            }
          }
        })
        .catch(() => {
          setIsLoading(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }

  async function createInitialPayments(args: { payableId: number, alumnId: number }) {
    const { alumnId, payableId } = args
    const promises: Promise<IPostPaymentResponse | IErrorResponse>[] = [];
    if (isSubscriptionPaymentIncluded) {
      const subscriptionPaymentPayload: IPaymentNew = {
        payment: {
          alumn_id: alumnId.toString(),
          quantity: subscriptionPayment,
        },
        payable_type: "subscription",
        payable_id: payableId.toString(),
      }
      if (subscribedAt) {
        subscriptionPaymentPayload.payment.paid_at = parseDateToYYYYMMDD(subscribedAt)
      }
      if (subscriptionPayment !== '') {
        subscriptionPaymentPayload.paid_amount = "0"
      }
      promises.push(postPayment({ data: subscriptionPaymentPayload }));
    }
    if (isMonthlyPaymentIncluded) {
      const monthlyPaymentPayload: IPaymentNew = {
        payment: {
          alumn_id: alumnId.toString(),
          quantity: monthlyPayment,
        },
        payable_type: "subscription",
        payable_id: payableId.toString(),
      }
      if (subscribedAt) {
        monthlyPaymentPayload.payment.paid_at = parseDateToYYYYMMDD(subscribedAt)
      }
      promises.push(postPayment({ data: monthlyPaymentPayload }))
    }
    Promise.all(promises).then(res => {
      let responseSuccess: boolean = true
      res.forEach(response => {
        if (!response.success) {
          responseSuccess = false
        }
      })
      if (responseSuccess) {
        navigate("/")
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const fieldClass = "w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none";
  const compactFieldClass = "w-full px-3 py-2 rounded-md border border-outline-variant bg-surface-lowest text-on-surface text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body-md outline-none";
  const labelClass = "block text-label-md font-label-md text-on-surface-variant";

  return (
    <form onSubmit={event => formSubmit(event)} className={`w-full min-w-0 flex flex-col gap-stack-md ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface">{id ? 'Edit Alumn' : 'Create Alumn'}</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">{id ? `${name} ${last_name}`.trim() : 'Add a new student and their contacts.'}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
          <button type="submit" disabled={isLoading} className={`px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-soft ${isLoading ? 'cursor-progress opacity-70' : ''}`}>{id ? 'Save Changes' : 'Create Alumn'}</button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <div className="xl:col-span-8 flex flex-col gap-gutter">
          <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-variant p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
              <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center"><UserIcon className="w-5 h-5" /></div>
              <h2 className="text-headline-md text-on-surface">Alumn Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-stack-md">
              <div className="space-y-2"><label htmlFor="name" className={labelClass}>First name</label><input onChange={e => setName(e.target.value)} value={name} type="text" id="name" name="name" className={fieldClass} placeholder="John" required /></div>
              <div className="space-y-2"><label htmlFor="last_name" className={labelClass}>Last name</label><input onChange={e => setLastName(e.target.value)} value={last_name} type="text" id="last_name" name="last_name" className={fieldClass} placeholder="Doe" required /></div>
              <div className="space-y-2 md:col-span-2"><label htmlFor="birth_date" className={labelClass}>Birth date</label><DatePicker value={birth_date ? new Date(birth_date) : null} onChange={date => setBirthDate(date)} id="birth_date" name="birth_date" /></div>
              <div className="space-y-2 md:col-span-2"><label htmlFor="address" className={labelClass}>Address</label><input onChange={e => setAddress(e.target.value)} value={address} type="text" id="address" name="address" className={fieldClass} placeholder="Street ##" required /></div>
              <div className="space-y-2"><label htmlFor="phone_number" className={labelClass}>Phone number</label><input onChange={e => setPhoneNumber(e.target.value)} value={phone_number} type="tel" id="phone_number" name="phone_number" className={fieldClass} placeholder="123-45-6789" pattern="[0-9]{10}" required /></div>
              <div className="space-y-2"><label htmlFor="email" className={labelClass}>Email address</label><input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" name="email" className={fieldClass} placeholder="john.doe@company.com" pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$" required /></div>
            </div>
          </section>

          <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-variant p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><HeartIcon className="w-5 h-5" /></div>
              <h2 className="text-headline-md text-on-surface">Program &amp; Health</h2>
            </div>
            <div className="space-y-stack-md">
              <div className="space-y-2"><label htmlFor="plan_id" className={labelClass}>Select a Plan</label><select id="plan_id" name="plan_id" value={plan_id} onChange={e => setPlanId(e.target.value)} className={fieldClass} required>{plansList.map(plan => <option key={`plan_${plan.id}`} value={plan.id.toString()}>{plan.name}</option>)}</select></div>
              <div className="space-y-2"><label htmlFor="special_med_conditions" className={labelClass}>Special medical conditions</label><textarea onChange={e => setSpecialMedConditions(e.target.value)} value={special_med_conditions} id="special_med_conditions" name="special_med_conditions" className={`${fieldClass} resize-none`} rows={3} placeholder="Allergies" required /><p className="text-xs text-on-surface-variant">Note any allergies or conditions instructors should be aware of.</p></div>
              <label className="flex items-start gap-3 rounded-lg bg-surface-container-low p-4 cursor-pointer"><input id="is_guardian_required_for_leaving" name="is_guardian_required_for_leaving" type="checkbox" checked={is_guardian_required_for_leaving} onChange={e => setIsGuardianRequiredForLeaving(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" /><span className="text-body-md text-on-surface">The student may leave the installations without a guardian.</span></label>
            </div>
          </section>

          {!id && <section className="bg-surface-lowest rounded-xl shadow-soft border border-surface-variant p-6 sm:p-8">
            <h2 className="text-headline-md text-on-surface mb-6">Subscription details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-stack-md">
              <div className="space-y-2 md:col-span-2"><label htmlFor="subscribedAt" className={labelClass}>Subscription date</label><DatePicker value={subscribedAt ? new Date(subscribedAt) : null} onChange={date => setSubscribedAt(date)} id="subscribedAt" name="subscribedAt" /></div>
              <label className="flex items-center gap-3 text-body-md text-on-surface cursor-pointer"><input id="isSubscriptionPaymentIncluded" name="isSubscriptionPaymentIncluded" type="checkbox" checked={isSubscriptionPaymentIncluded} onChange={e => setIsSubscriptionPaymentIncluded(e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />Create with subscription payment</label>
              <label className="flex items-center gap-3 text-body-md text-on-surface cursor-pointer"><input id="isMonthlyPaymentIncluded" name="isMonthlyPaymentIncluded" type="checkbox" checked={isMonthlyPaymentIncluded} onChange={e => setIsMonthlyPaymentIncluded(e.target.checked)} className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />Create with first monthly payment</label>
              {isSubscriptionPaymentIncluded && <div className="space-y-2"><label htmlFor="subscriptionPayment" className={labelClass}>Subscription</label><input onChange={e => handlePriceInputChange(e, setSubscriptionPayment)} value={subscriptionPayment} type="text" id="subscriptionPayment" name="subscriptionPayment" className={fieldClass} placeholder="$0.00" pattern="^\d+(\.\d{1,2})?$" /></div>}
              {isMonthlyPaymentIncluded && <div className="space-y-2"><label htmlFor="monthlyPayment" className={labelClass}>Monthly payment</label><input onChange={e => handlePriceInputChange(e, setMonthlyPayment)} value={monthlyPayment} type="text" id="monthlyPayment" name="monthlyPayment" className={fieldClass} placeholder="$0.00" pattern="^\d+(\.\d{1,2})?$" /></div>}
            </div>
          </section>}
        </div>

        <aside className="xl:col-span-4 flex flex-col gap-gutter">
          <section className="bg-surface-bright rounded-xl shadow-soft border border-surface-variant p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-variant"><div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center"><UserGroupIcon className="w-[18px] h-[18px]" /></div><h2 className="text-headline-sm text-on-surface">Main Guardian</h2></div>
            <div className="space-y-stack-sm">
              <div className="space-y-1"><label htmlFor="guardian_name" className={labelClass}>First name</label><input onChange={e => setGuardianName(e.target.value)} value={guardian_name} type="text" id="guardian_name" name="guardian_name" className={compactFieldClass} placeholder="John" required /></div>
              <div className="space-y-1"><label htmlFor="guardian_last_name" className={labelClass}>Last name</label><input onChange={e => setGuardianLastName(e.target.value)} value={guardian_last_name} type="text" id="guardian_last_name" name="guardian_last_name" className={compactFieldClass} placeholder="Doe" required /></div>
              <div className="space-y-1"><label htmlFor="guardian_phone_number" className={labelClass}>Phone number</label><input onChange={e => setGuardianPhoneNumber(e.target.value)} value={guardian_phone_number} type="tel" id="guardian_phone_number" name="guardian_phone_number" className={compactFieldClass} placeholder="123-45-678" pattern="[0-9]{10}" required /></div>
              <div className="space-y-1"><label htmlFor="guardian_email" className={labelClass}>Email address</label><input onChange={e => setGuardianEmail(e.target.value)} value={guardian_email} type="email" id="guardian_email" name="guardian_email" className={compactFieldClass} placeholder="john.doe@company.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required /></div>
            </div>
          </section>
          <section className="bg-surface-bright rounded-xl shadow-soft border border-surface-variant p-6">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-variant"><div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center"><UserPlusIcon className="w-[18px] h-[18px]" /></div><h2 className="text-headline-sm text-on-surface">Secondary Guardian</h2></div>
            <div className="space-y-stack-sm">
              <div className="space-y-1"><label htmlFor="secondary_guardian_name" className={labelClass}>First name</label><input onChange={e => setSecondaryGuardianName(e.target.value)} value={secondary_guardian_name} type="text" id="secondary_guardian_name" name="secondary_guardian_name" className={compactFieldClass} placeholder="John" /></div>
              <div className="space-y-1"><label htmlFor="secondary_guardian_last_name" className={labelClass}>Last name</label><input onChange={e => setSecondaryGuardianLastName(e.target.value)} value={secondary_guardian_last_name} type="text" id="secondary_guardian_last_name" name="secondary_guardian_last_name" className={compactFieldClass} placeholder="Doe" /></div>
              <div className="space-y-1"><label htmlFor="secondary_guardian_phone_number" className={labelClass}>Phone number</label><input onChange={e => setSecondaryGuardianPhoneNumber(e.target.value)} value={secondary_guardian_phone_number} type="tel" id="secondary_guardian_phone_number" name="secondary_guardian_phone_number" className={compactFieldClass} placeholder="123-45-678" pattern="[0-9]{10}" /></div>
              <div className="space-y-1"><label htmlFor="secondary_guardian_email" className={labelClass}>Email address</label><input onChange={e => setSecondaryGuardianEmail(e.target.value)} value={secondary_guardian_email} type="email" id="secondary_guardian_email" name="secondary_guardian_email" className={compactFieldClass} placeholder="john.doe@company.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" /></div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
