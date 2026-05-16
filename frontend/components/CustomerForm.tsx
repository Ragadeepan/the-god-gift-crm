"use client";

import { useState, useEffect } from "react";
import { Loader2, Phone, User, Instagram, CheckCircle2, PlusCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { customerApi, Customer } from "@/services/api";
import { usePhoneCheck } from "@/hooks/useCustomers";
import { isValidWhatsAppNumber, isValidInstagramUrl } from "@/lib/utils";

interface CustomerFormProps {
  onSaved: () => void;
}

interface FormData {
  whatsappNumber: string;
  name: string;
  instagramLink: string;
}

interface FormErrors {
  whatsappNumber?: string;
  name?: string;
  instagramLink?: string;
}

export default function CustomerForm({ onSaved }: CustomerFormProps) {
  const { checking, result, checkPhone, reset } = usePhoneCheck();
  const [form, setForm] = useState<FormData>({
    whatsappNumber: "",
    name: "",
    instagramLink: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    if (result) {
      setIsExisting(result.exists);
      if (result.exists && result.customer) {
        setExistingCustomer(result.customer);
        setForm((prev) => ({
          ...prev,
          name: result.customer!.name,
          instagramLink: result.customer!.instagramLink || "",
        }));
      } else {
        setExistingCustomer(null);
        setForm((prev) => ({ ...prev, name: "", instagramLink: "" }));
      }
    }
  }, [result]);

  const handlePhoneChange = (value: string) => {
    setForm((prev) => ({ ...prev, whatsappNumber: value }));
    setErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
    reset();
    if (value.replace(/\s+/g, "").length >= 7) {
      checkPhone(value);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!isValidWhatsAppNumber(form.whatsappNumber)) {
      newErrors.whatsappNumber = "Enter a valid WhatsApp number (7–15 digits)";
    }
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Customer name must be at least 2 characters";
    }
    if (form.instagramLink && !isValidInstagramUrl(form.instagramLink)) {
      newErrors.instagramLink =
        "Enter a valid Instagram URL (e.g. https://instagram.com/yourpage)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isExisting && existingCustomer) {
        await customerApi.update(existingCustomer.id, {
          name: form.name,
          instagramLink: form.instagramLink || undefined,
        });
        toast.success("Customer updated successfully!");
      } else {
        await customerApi.create({
          whatsappNumber: form.whatsappNumber,
          name: form.name,
          instagramLink: form.instagramLink || undefined,
        });
        toast.success("Customer saved successfully!");
      }
      handleReset();
      onSaved();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save customer";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({ whatsappNumber: "", name: "", instagramLink: "" });
    setErrors({});
    setIsExisting(false);
    setExistingCustomer(null);
    reset();
  };

  const phoneChecked = result !== null;
  const showFields = phoneChecked || form.whatsappNumber.length === 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-100">
      {/* Form header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Add Customer</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter WhatsApp number to auto-detect existing customers
          </p>
        </div>
        {isExisting && (
          <Badge variant="existing" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Existing Customer
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* WhatsApp Number */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <Phone className="w-3.5 h-3.5 text-brand-500" />
            WhatsApp Number
          </label>
          <div className="relative">
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.whatsappNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              error={errors.whatsappNumber}
              className="pr-10"
            />
            {checking && (
              <Loader2 className="absolute right-3 top-3 w-4 h-4 text-brand-500 animate-spin" />
            )}
            {phoneChecked && !checking && (
              <CheckCircle2
                className={`absolute right-3 top-3 w-4 h-4 ${
                  isExisting ? "text-blue-500" : "text-brand-500"
                }`}
              />
            )}
          </div>
          {phoneChecked && !checking && (
            <p
              className={`text-xs font-medium ${
                isExisting ? "text-blue-600" : "text-brand-600"
              }`}
            >
              {isExisting
                ? "✓ Existing customer — details auto-filled below"
                : "✓ New customer — please fill in details"}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <User className="w-3.5 h-3.5 text-brand-500" />
            Customer Name
          </label>
          <Input
            type="text"
            placeholder="Enter customer name"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            disabled={checking}
          />
        </div>

        {/* Instagram Link */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <Instagram className="w-3.5 h-3.5 text-brand-500" />
            Instagram Page{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <Input
            type="url"
            placeholder="https://instagram.com/yourpage"
            value={form.instagramLink}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, instagramLink: e.target.value }));
              setErrors((prev) => ({ ...prev, instagramLink: undefined }));
            }}
            error={errors.instagramLink}
            disabled={checking}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            onClick={handleSave}
            disabled={saving || checking}
            className="flex-1"
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : isExisting ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Update Customer
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Save Customer
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset} size="lg">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
