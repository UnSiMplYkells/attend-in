"use client"
import { useState } from "react";
import ModalPortal from "../admin/components/ModalPortal";
import Modal from "../admin/components/ui/Modal";
import { GrUserAdmin } from "react-icons/gr";
import { RxPerson } from "react-icons/rx";
import Button from "../admin/components/ui/Button";

export default function AuthModal({ open, setOpen, onConfirmStudent, onConfirmClassRep }) {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({
    contact: "",
    otp: "",
  });

  const [isClassRepFormVisible, setClassRepFormVisible] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (contact.length !== 11) {
      newErrors.contact = "Invalid phone number";
      isValid = false;
    }
    if (otp.length !== 8) {
      newErrors.otp = "Incomplete otp";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onConfirmClassRep(contact, otp);
    }
  }

  function handleClose() {
    setOpen(false);
    // Optional: delay resetting form visibility so it doesn't flicker while closing
    setTimeout(() => setClassRepFormVisible(false), 300);
  };

  return (
    <ModalPortal>
      <div>
        <Modal open={open} onClose={handleClose}>
          {isClassRepFormVisible ? (
            <div className="flex-1">
              <div>
                <h2 className=" text-lg sm:text-xl font-semibold mb-3">
                  continue as class representative
                </h2>
                <p className=" mb-2">To continue, input:</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium leading-6 "
                  >
                    Phone Number - whatsapp prefarably
                  </label>
                  <div className="mt-1">
                    <input
                      id="phoneNumber"
                      type="text"
                      autoComplete="phoneNumber"
                      placeholder="08012345678"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        setErrors((prev) => ({ ...prev, contact: "" }));
                      }}
                      required
                      className="mb-2 block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
                    />
                    {errors.contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium leading-6"
                  >
                    OTP
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      type="text"
                      autoComplete="otp"
                      placeholder="12345678"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setErrors((prev) => ({ ...prev, otp: "" }));
                      }}
                      required
                      className=" block w-full rounded-md border border-transparent bg-white/5 py-2 px-3 text-white shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none sm:text-md sm:leading-6"
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                    )}
                  </div>
                </div>
                <Button margin="mt-6" type="submit" variant="secondary">
                  continue as class rep
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row flex-1 gap-4 sm:gap-6">
              <div className="flex flex-row sm:flex-col items-center m-auto">
                <RxPerson className="size-10 p-1 rounded-full bg-black" />
                <p className="p-2">- or -</p>
                <GrUserAdmin className="size-10 p-1 rounded-full bg-red-500/70" />
              </div>
              <div className="flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Choose role</h2>
                  <p className=" mb-5">who do you choose to sign up as?</p>
                </div>
                <div className="flex justify-center gap-10">
                  <Button
                    variant="primary"
                    onClick={() => {onConfirmStudent()}}
                  >
                    Student
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {setClassRepFormVisible(true)}}
                  >
                    Class Rep
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ModalPortal>
  );
}