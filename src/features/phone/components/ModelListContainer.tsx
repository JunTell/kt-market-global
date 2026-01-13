import { createClient } from "@/shared/api/supabase/client"
import ModelListClient from "./ModelListClient"
import { type RegType } from "@/features/phone/lib/asamo-utils"

interface Props {
    sectionTitle?: string
    planId?: string
    userCarrier?: string
    registrationType?: RegType
}

const GONGGU_MODELS = [
    "aip17-256",
    "sm-m366k",
    "aip16e-128",
    "sm-s931nk",
    "aip17p-256"
]

export default async function ModelListContainer({
    sectionTitle,
    planId = "ppllistobj_0808",
    userCarrier,
    registrationType
}: Props) {
    const supabase = createClient()

    const { data: devicesData } = await supabase
        .from("devices")
        .select(`*, device_plans_chg (*), device_plans_mnp (*)`)
        .in("model", GONGGU_MODELS)

    const { data: subsidiesData } = await supabase
        .from("ktmarket_subsidy")
        .select("*")
        .in("model", GONGGU_MODELS)

    return (
        <ModelListClient
            sectionTitle={sectionTitle}
            planId={planId}
            userCarrier={userCarrier}
            registrationType={registrationType}
            initialDevices={devicesData || []}
            initialSubsidies={subsidiesData || []}
        />
    )
}
