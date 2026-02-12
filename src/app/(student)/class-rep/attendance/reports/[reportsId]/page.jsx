"use client";

import { useParams } from "next/navigation";
import ReportDetails from "./ReportDetails";
import useStore from "@/store";

export default function Page() {
  const params = useParams();
  const urlId = params?.reportsId;

  const { Id: storeId } = useStore();
  const finalId = storeId || urlId;

  return <ReportDetails reportsId={finalId} />;
}
