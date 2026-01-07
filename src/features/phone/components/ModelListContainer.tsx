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

    // Fetch data for BOTH chg and mnp to support client-side filtering/switching without refetching
    const { data: devicesData } = await supabase
        .from("devices")
        .select(`*, device_plans_chg (*), device_plans_mnp (*)`)
        .in("model", GONGGU_MODELS)

    // Note: We are fetching ALL plans for these models that match the planId might be tricky if we filter on server.
    // The previous code filtered `.eq('${planTable}.plan_id', planId)`.
    // Since we want both, we might just fetch all and filter in client or try to filter here.
    // Supabase nested filtering is: `device_plans_chg!inner(plan_id, ...)` if we want to filter parent.
    // But here we want the parent regardless, just the child rows filtered.
    // Supabase default is left join.
    // Let's filter in the select string directly if possible or just fetch all and let client filter?
    // Actually, `device_plans_chg(price, plan_id, disclosure_subsidy)` and filter by plan_id in application logic?
    // Or closer: `device_plans_chg(*), device_plans_mnp(*)` and filtered by plan_id.
    // Supabase postgrest filter on nested resource: `device_plans_chg.plan_id.eq.${planId}`

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
