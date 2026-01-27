import { Suspense } from "react"
import { createClient } from "@/shared/api/supabase/server"
import { getTranslations } from "next-intl/server"
import { parsePhoneModel, getDBModelKey } from "@/features/phone/lib/phoneModel"
import { getPlanMetadata } from "@/features/phone/lib/phonedata"
import { calcKTmarketSubsidy } from "@/features/phone/lib/asamo-utils"
import { checkIsSoldOut } from "@/features/phone/lib/stock"
import PhoneDetailClient from "@/features/phone/components/PhoneDetailClient" // Verify path
import PhoneDetailSkeleton from "@/features/phone/components/skeleton/PhoneDetailSkeleton"

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ model?: string }>
}

export default async function PhonePage({ params, searchParams }: Props) {
    return (
        <Suspense fallback={<PhoneDetailSkeleton />}>
            <PhoneServerLoader params={params} searchParams={searchParams} />
        </Suspense>
    )
}

async function PhoneServerLoader({ params, searchParams }: Props) {
    const { locale } = await params
    const { model } = await searchParams
    const t = await getTranslations({ locale })
    const supabase = await createClient()

    // 1. URL Parsing
    const urlModel = model || "aip17-256"
    const { prefix, capacity, color: colorFromUrl } = parsePhoneModel(urlModel)
    const dbModelKey = getDBModelKey(prefix, capacity)

    // 2. Default Preferences (Server-side default)
    // Note: Use chg/chg as safe defaults. Client side will override if needed via store,
    // but initially we render based on defaults.
    const regType = "chg"
    const planTable = "device_plans_chg"

    // 3. Parallel Data Fetching
    const PLAN_METADATA = getPlanMetadata(t)

    const [deviceRes, subsidyRes, planRes] = await Promise.all([
        supabase.from("devices").select("*").eq("model", dbModelKey).maybeSingle(),
        supabase.from("ktmarket_subsidy").select("*").eq("model", dbModelKey).maybeSingle(),
        supabase.from(planTable).select("plan_id, price, disclosure_subsidy").eq("model", dbModelKey).in("plan_id", PLAN_METADATA.map(p => p.dbId))
    ])

    if (!deviceRes.data) {
        // Handle 404 or redirect? For now, maybe return null or error UI
        return <div className="p-10 text-center">Device not found</div>
    }

    const device = deviceRes.data
    const subsidies = subsidyRes.data || {}
    const dbPlans = planRes.data || []

    // 4. Data Merging & Logic
    const mergedPlans = PLAN_METADATA.map(meta => {
        const dbData = dbPlans.find(p => p.plan_id === meta.dbId)
        const price = meta.fixedPrice || dbData?.price || 0
        const marketSubsidy = calcKTmarketSubsidy(meta.dbId, price, subsidies, dbModelKey, regType)

        return {
            id: meta.uuid,
            dbId: meta.dbId,
            name: meta.name,
            data: meta.data,
            description: meta.description,
            calls: meta.calls,
            texts: meta.texts,
            price,
            disclosureSubsidy: dbData?.disclosure_subsidy || 0,
            marketSubsidy
        }
    })

    // 5. Colors & Images
    const colors = (device.colors_en || []).filter((c: string) => {
        return device.images?.[c]?.length > 0
    })

    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || ""
    const imagesMap: Record<string, string[]> = {}

    colors.forEach((c: string) => {
        const files = device.images?.[c] || []
        imagesMap[c] = files.map((f: string) =>
            `${cdnUrl}/phone/${device.category}/${c}/${f}.png`
        )
    })

    // 6. Selection Logic (Default Color)
    const inStockColors = colors.filter((c: string) => !checkIsSoldOut(prefix, capacity, c))
    const isUrlColorValid = colorFromUrl && colors.includes(colorFromUrl)
    const isUrlColorInStock = isUrlColorValid && !checkIsSoldOut(prefix, capacity, colorFromUrl)

    const selectedColor = isUrlColorInStock
        ? colorFromUrl
        : (inStockColors[0] || colors[0] || (device.colors_en || [])[0] || "black")

    // Note: If URL color was invalid/OOS and we switched, we technically "redirect" logic
    // But in Server Component we just render the CORRECT data. 
    // The client component can optionally update URL on mount if it mismatches.

    const currentImageUrls = imagesMap[selectedColor] || []
    const currentImageUrl = currentImageUrls[0] || ""

    const initialData = {
        model: urlModel,
        title: device.pet_name,
        capacity: device.capacity,
        color: selectedColor,
        originPrice: device.price,
        imageUrl: currentImageUrl,
        imageUrls: currentImageUrls,
        plans: mergedPlans,
        subsidies,
        registrationType: regType as "chg" | "mnp",
        userCarrier: "",
        availableColors: colors,
        colorImages: imagesMap,
        prefix
    }

    return (
        <PhoneDetailClient initialData={initialData} locale={locale} />
    )
}