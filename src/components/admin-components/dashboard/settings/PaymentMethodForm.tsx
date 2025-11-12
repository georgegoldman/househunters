import { useState } from "react";
import CaretDown from "../../../../assets/caret-down";
import EyeIconBlack from "../../../../assets/eye-icon-black";

interface PaymentFormState {
  bankName: string;
  accountNumber: string;
  accountName: string;
  paypalStripe: string;
  cryptoWallet: string;
  commissionRate: string;
}

const PaymentMethodForm: React.FC = () => {
  const [form, setForm] = useState<PaymentFormState>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    paypalStripe: "",
    cryptoWallet: "",
    commissionRate: "",
  });
  const [showPaypalStripe, setShowPaypalStripe] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard against placeholders being submitted
    if (!form.bankName || !form.commissionRate) {
      return;
    }
    // Submit hook
  };

  return (
    <form onSubmit={onSubmit} className="p-[15px] md:p-6">
      <h2 className="text-[18px] font-semibold mb-4">Payment Method</h2>

      <div className="flex flex-col gap-4">
        {/* Bank Name (select) */}
        <div>
          <label className="block text-sm text-black/70 mb-1">Bank Name</label>
          <div className="relative">
            <select
              name="bankName"
              value={form.bankName}
              onChange={onChange}
              required
              className={`appearance-none w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm pr-10 ${
                form.bankName ? "text-black" : "text-black/40"
              }`}
            >
              <option value="" disabled>
                e,g Access
              </option>
              <option value="Access">Access</option>
              <option value="GTBank">GTBank</option>
              <option value="Zenith">Zenith</option>
              <option value="UBA">UBA</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70">
              <CaretDown />
            </div>
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm text-black/70 mb-1">
            Account Number
          </label>
          <input
            name="accountNumber"
            value={form.accountNumber}
            onChange={onChange}
            placeholder="e,g 67218968897"
            className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
            type="text"
          />
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-sm text-black/70 mb-1">
            Account Name
          </label>
          <input
            name="accountName"
            value={form.accountName}
            onChange={onChange}
            placeholder="e,g John Deo"
            className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40"
            type="text"
          />
        </div>

        {/* Paypal/Stripe */}
        <div>
          <label className="block text-sm text-black/70 mb-1">
            Paypal/Stripe
          </label>
          <div className="relative">
            <input
              name="paypalStripe"
              value={form.paypalStripe}
              onChange={onChange}
              placeholder="Enter Paypal email or stripe key"
              className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40 pr-10"
              type={showPaypalStripe ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPaypalStripe((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60"
              aria-label="Toggle Paypal/Stripe visibility"
            >
              <EyeIconBlack />
            </button>
          </div>
        </div>

        {/* Crypto Wallet (Optional) */}
        <div>
          <label className="block text-sm text-black/70 mb-1">
            Crypto Wallet Address (Optional)
          </label>
          <div className="relative">
            <input
              name="cryptoWallet"
              value={form.cryptoWallet}
              onChange={onChange}
              placeholder="Enter wallet address"
              className="w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm placeholder:text-black/40 pr-10"
              type={showCrypto ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowCrypto((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60"
              aria-label="Toggle wallet visibility"
            >
              <EyeIconBlack />
            </button>
          </div>
        </div>

        {/* Commission Rate (select) */}
        <div>
          <label className="block text-sm text-black/70 mb-1">
            Commission Rate
          </label>
          <div className="relative">
            <select
              name="commissionRate"
              value={form.commissionRate}
              onChange={onChange}
              required
              className={`appearance-none w-full rounded-[10px] bg-transparent border border-black/10 outline-none px-3 py-3 text-sm pr-10 ${
                form.commissionRate ? "text-black" : "text-black/40"
              }`}
            >
              <option value="" disabled>
                Set commission rate percentage
              </option>
              <option value="2%">2%</option>
              <option value="3%">3%</option>
              <option value="5%">5%</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/70">
              <CaretDown />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-[10px] bg-black text-white py-3 text-sm font-medium hover:bg-black/90"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
