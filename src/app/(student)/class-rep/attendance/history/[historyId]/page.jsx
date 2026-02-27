
"use client";
import { useParams } from "next/navigation";
import HistoryDetails from "./HistoryDetails"
import useStore from "@/store";


export default function page() {
  const params = useParams();
  const urlId = params?.historyId;

  const { HistoryId: storeId } = useStore();
  const finalId = storeId || urlId;

  return <HistoryDetails historyId={finalId}/>
}

