import type { User } from "~/types/user.types";

export default function (user: User) {
  if (!user) {
    return { color: "error", text: "نا مشخص" };
  }

  // Handle Approved/Trusted status
  if (user.status === "Approved" || user.status === "Trusted") {
    return { color: "success", text: "احراز کامل" };
  }

  // Handle Rejected status
  if (user.status !== "Register") {
    return { color: "error", text: "احراز رد شده" };
  }

  // Handle Register status with different steps
  switch (user.stepRequest) {
    case "None":
      if (user.stepAuth === "None") {
        return { color: "error", text: "احراز نشده" };
      }
      break;

    case "PendingStep1":
      return { color: "warning", text: "در انتظار تایید مرحله اول" };

    case "PendingStep2":
      return { color: "warning", text: "در انتظار تایید مرحله دوم" };

    case "Step1":
      if (user.stepAuth === "Step1") {
        return { color: "info", text: "تایید مرحله اول" };
      }
      break;

    case "RejectStep1":
      return { color: "error", text: "رد شده مرحله اول" };

    case "RejectStep2":
      return { color: "error", text: "رد شده مرحله دوم" };
  }

  // Default case
  return { color: "error", text: "احراز نشده" };
}
