import React from "react";
import { IonSpinner } from "@ionic/react";

export default function Loading() {
  return (
    <div className="flex items-center bg-white justify-center flex-1 h-screen fixed top-0 left-0 z-400 w-full">
      <IonSpinner name="crescent" />
    </div>
  );
}
