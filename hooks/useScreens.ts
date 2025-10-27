"use client";
import { createScreen, getScreens } from "@/api/screens";
import { IScreen } from "@/models/screen.model";
import { useQueryData } from "./useQueryData";
import { useEffect, useState } from "react";
import { useMutationData } from "./useMutation";


export const useScreens = () => {
    const [screens, setScreens] = useState<string[]>(["screen 1"]);
    const [currentScreen, setCurrentScreen] = useState<string>("1");
    const { data, isPending, isFetched, refetch, isFetching, ...rest } = useQueryData(["screens"], getScreens);
    useEffect(() => {
        if (data) {
            setScreens((data as IScreen[]).map((screen: IScreen) => `screen ${screen?.name}`));
            setCurrentScreen(`screen ${(data as IScreen[])?.[0]?.name || "1"}`);
        }
    }, [data]);
    return { screens, isPending, isFetched, refetch, isFetching, ...rest };
}


export const useCreateScreen = () => {
    const { mutate, isPending, isSuccess, isError, ...rest } = useMutationData(["createScreen"], createScreen, ["screens"]);
    return { mutate, isPending, isSuccess, isError, ...rest };
}