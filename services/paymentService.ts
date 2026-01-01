import { PlanType } from '../types';

export const initiatePayment = (plan: PlanType, amount: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const options = {
      key: "rzp_test_1234567890", // Mock Test Key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Text2APK.ai",
      description: `Upgrade to ${plan}`,
      image: "https://via.placeholder.com/150?text=Logo",
      handler: function (response: any) {
        console.log("Payment Successful", response);
        resolve(true);
      },
      modal: {
        ondismiss: function() {
          resolve(false);
        }
      },
      prefill: {
        name: "Developer",
        email: "dev@text2apk.ai",
        contact: "9999999999"
      },
      theme: {
        color: "#10b981"
      }
    };

    if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    } else {
        alert("Payment gateway failed to load. Please check your internet connection.");
        resolve(false);
    }
  });
};
