import { useContext } from "react";
import { AppsContext } from "../context/AppsContext";

export function useApps() {
    const context = useContext(AppsContext);
    if (!context) {
        throw new Error("useApps must be used within AppsProvider");
    }
    return context;
}