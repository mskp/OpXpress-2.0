"use client";

import { checkout } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckoutDialog } from "@/lib/redux/features/checkout-dialog/use-checkout-dialog";
import { checkoutSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "../ui/card";
import { useFormStatus } from "react-dom";

// Define the type of the checkout form data
type CheckoutSchema = z.infer<typeof checkoutSchema>;

/**
 * CheckoutDialog component for handling the checkout process.
 * @returns {JSX.Element | null} The JSX element representing the checkout dialog.
 */
export default function CheckoutDialog(): JSX.Element | null {
  const router = useRouter();
  const { setCheckoutDialog, checkoutDialog } = useCheckoutDialog();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
  });

  /**
   * Handler for form submission
   */
  const handleAddToCart: () => void = handleSubmit(async (checkoutDetails) => {
    const ordered = await checkout(checkoutDetails);
    if (ordered) {
      setCheckoutDialog(false);
      router.push(`/orders`);
    }
  });

  // If the dialog is not open, return null
  if (!checkoutDialog.isOpen) return null;

  return (
    <Dialog open={true} onOpenChange={setCheckoutDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-1 text-center"></DialogHeader>
        <Card className="w-full max-w-md border-none rounded-lg">
          <CardContent>
            <form action={handleAddToCart} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    placeholder="Enter Full Name"
                    type="text"
                    {...register("fullname")}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile</Label>
                  <Input
                    maxLength={10}
                    id="phone"
                    placeholder="Enter Mobile Number"
                    type="tel"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter Address"
                    type="text"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    maxLength={6}
                    minLength={6}
                    id="pincode"
                    placeholder="Enter Pincode"
                    type="text"
                    {...register("pincode")}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter City"
                    type="text"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <CheckoutButton isDisabled={!isValid} />
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutButton({ isDisabled = false }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || isDisabled}
      className="w-full mt-4 rounded-full"
      type="submit"
    >
      {pending ? "Checking out..." : "Checkout"}
    </Button>
  );
}
