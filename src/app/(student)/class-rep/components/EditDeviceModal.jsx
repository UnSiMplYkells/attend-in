"use client"
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import toast from "react-hot-toast";
import ModalPortal from "@/app/components/ModalPortal";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import { FaExclamationTriangle } from "react-icons/fa";


export default function EditDeviceModalModal({ open, setOpen, student }) {
  const supabase = createClient();
  
  const { full_name, matric_number } = student || {};

  const [loading, setLoading] = useState(false);

  async function handleChangeDevice() {
    try {
      setLoading(true);

      const updatePromise = (async () => {
        const { error } = await supabase
          .from("users")
          .update({ bound_device_id: null })
          .eq("matric_number", matric_number);

        if (error) throw error;
      })();

      await toast.promise(updatePromise, {
        loading: "Changing authorized device...",
        success: "Authorized device changed successfully. User should login on new device",
        error: "Failed to change authorized device. Please try again.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <ModalPortal>
      <div>
        <Modal open={open} onClose={handleClose}>
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex items-center justify-center p-2.5 size-12 bg-red-600/30 rounded-full">
              <FaExclamationTriangle className="relative bottom-0.5 text-red-600 text-4xl " />
            </div>
            <div>
              <div>
                <h2 className=" text-lg sm:text-xl font-semibold mb-3">
                  Change Authorized Device
                </h2>
                <p>
                  Are you sure you want to change the authorized device for:
                </p>
                <p className="mt-2 mb-5">
                  {full_name} <br />
                  {matric_number}
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-5 sm:gap-10">
                <Button
                  disabled={loading}
                  variant="danger"
                  onClick={handleChangeDevice}
                >
                  Change Device
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </ModalPortal>
  );
}