import { createClient } from "@/shared/api/supabase/server"
import ModelListClient, { ModelList } from "./ModelListClient"
import { type RegType, calcKTmarketSubsidy, getDeviceImageUrl, getDeviceImageUrls } from "@/features/phone/lib/asamo-utils"

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
    const supabase = await createClient()

    const { data: devicesData } = await supabase
        .from("devices")
        .select(`*, device_plans_chg (*), device_plans_mnp (*)`)
        .in("model", GONGGU_MODELS)

    const { data: subsidiesData } = await supabase
        .from("ktmarket_subsidy")
        .select("*")
        .in("model", GONGGU_MODELS)

    // Helper to map devices to deals on the server
    const mapToDeals = (regType: RegType) => {
        if (!devicesData) return []

        const planTableKey = regType === "chg" ? "device_plans_chg" : "device_plans_mnp"

        interface DevicePlan {
            price: number;
            disclosure_subsidy: number;
        }

        return devicesData
            .map((device) => {
                const planList = (device[planTableKey] as DevicePlan[] | undefined) || []
                const plan = planList.find((p) => p.price === 69000) || planList[0]
                if (!plan) return null

                const subsidyRow = subsidiesData?.find((s) => s.model === device.model)
                const ktmarketDiscount = calcKTmarketSubsidy(planId, plan.price ?? 0, subsidyRow, device.model as string, regType)

                return {
                    model: device.model as string,
                    title: (device.pet_name as string) ?? (device.model as string),
                    capacity: (device.capacity as string) ?? "",
                    originPrice: (device.price as number) ?? 0,
                    disclosureSubsidy: (plan.disclosure_subsidy as number) ?? 0,
                    ktmarketDiscount,
                    specialDiscount: 0,
                    planMonthlyDiscount: Math.floor((plan.price ?? 0) * 0.25),
                    imageUrl: getDeviceImageUrl(device),
                    imageUrls: getDeviceImageUrls(device),
                }
            })
            .filter((item): item is ModelList => item !== null)
            .sort((a, b) => GONGGU_MODELS.indexOf(a.model) - GONGGU_MODELS.indexOf(b.model))
    }

    const initialDealsChg = mapToDeals("chg")
    const initialDealsMnp = mapToDeals("mnp")

    return (
        <ModelListClient
            sectionTitle={sectionTitle}
            userCarrier={userCarrier}
            registrationType={registrationType}
            initialDealsChg={initialDealsChg}
            initialDealsMnp={initialDealsMnp}
        />
    )
}
